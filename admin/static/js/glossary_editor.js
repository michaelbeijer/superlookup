// Glossary Editor JavaScript
// Excel-like spreadsheet functionality

class GlossaryEditor {
    constructor() {
        this.glossaryData = window.GLOSSARY_DATA;
        this.filename = window.GLOSSARY_FILENAME;
        this.entries = [...this.glossaryData.entries];
        this.originalEntries = JSON.parse(JSON.stringify(this.entries));
        this.undoStack = [];
        this.redoStack = [];
        this.hasChanges = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        console.log(`Glossary editor initialized: ${this.entries.length} entries`);
    }
    
    setupEventListeners() {
        // Save button
        document.querySelector('[data-action="save"]').addEventListener('click', () => this.save());
        
        // Toolbar buttons
        document.querySelector('[data-action="add-row"]').addEventListener('click', () => this.addRow());
        document.querySelector('[data-action="delete-rows"]').addEventListener('click', () => this.deleteSelectedRows());
        document.querySelector('[data-action="sort-asc"]').addEventListener('click', () => this.sort('asc'));
        document.querySelector('[data-action="sort-desc"]').addEventListener('click', () => this.sort('desc'));
        document.querySelector('[data-action="import"]').addEventListener('click', () => this.importTSV());
        document.querySelector('[data-action="export"]').addEventListener('click', () => this.exportTSV());
        document.querySelector('[data-action="find-duplicates"]').addEventListener('click', () => this.findDuplicates());
        
        // Undo/Redo buttons
        document.querySelector('[data-action="undo"]').addEventListener('click', () => this.undo());
        document.querySelector('[data-action="redo"]').addEventListener('click', () => this.redo());
        
        // Search
        document.querySelector('[data-action="search"]').addEventListener('input', (e) => this.search(e.target.value));
        
        // Select all checkbox
        document.getElementById('select-all').addEventListener('change', (e) => this.selectAll(e.target.checked));
        
        // Cell editing
        this.setupCellEditing();
    }
    
    setupCellEditing() {
        const tableBody = document.getElementById('table-body');
        
        // Track changes on cell edit
        tableBody.addEventListener('input', (e) => {
            if (e.target.matches('[contenteditable]')) {
                const row = e.target.closest('tr');
                const index = parseInt(row.dataset.index);
                const field = e.target.dataset.field;
                const value = e.target.textContent.trim();
                
                // Update data
                if (!this.entries[index]) {
                    this.entries[index] = { source: '', target: '', notes: '' };
                }
                this.entries[index][field] = value;
                
                // Mark as modified
                row.classList.add('modified');
                this.hasChanges = true;
                this.updateStatus('Modified (unsaved)');
            }
        });
        
        // Tab navigation between cells
        tableBody.addEventListener('keydown', (e) => {
            if (e.target.matches('[contenteditable]')) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    this.navigateCell(e.target, e.shiftKey ? 'prev' : 'next');
                }
                else if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    this.addRow();
                }
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S: Save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.save();
            }
            // Ctrl+Z: Undo
            else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
            }
            // Ctrl+Shift+Z or Ctrl+Y: Redo
            else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                this.redo();
            }
            // Delete: Delete selected rows
            else if (e.key === 'Delete') {
                const activeElement = document.activeElement;
                if (!activeElement.matches('[contenteditable]')) {
                    this.deleteSelectedRows();
                }
            }
        });
    }
    
    navigateCell(currentCell, direction) {
        const row = currentCell.closest('tr');
        const cells = Array.from(row.querySelectorAll('[contenteditable]'));
        const currentIndex = cells.indexOf(currentCell);
        
        let nextCell;
        
        if (direction === 'next') {
            if (currentIndex < cells.length - 1) {
                nextCell = cells[currentIndex + 1];
            } else {
                // Move to next row, first cell
                const nextRow = row.nextElementSibling;
                if (nextRow) {
                    nextCell = nextRow.querySelector('[contenteditable]');
                } else {
                    // Add new row if at end
                    this.addRow();
                    setTimeout(() => {
                        const lastRow = document.querySelector('#table-body tr:last-child');
                        if (lastRow) {
                            lastRow.querySelector('[contenteditable]').focus();
                        }
                    }, 50);
                    return;
                }
            }
        } else {
            if (currentIndex > 0) {
                nextCell = cells[currentIndex - 1];
            } else {
                // Move to previous row, last cell
                const prevRow = row.previousElementSibling;
                if (prevRow) {
                    const prevCells = prevRow.querySelectorAll('[contenteditable]');
                    nextCell = prevCells[prevCells.length - 1];
                }
            }
        }
        
        if (nextCell) {
            nextCell.focus();
            // Select all text
            const range = document.createRange();
            range.selectNodeContents(nextCell);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    
    addRow() {
        const newEntry = { source: '', target: '', notes: '' };
        this.entries.push(newEntry);
        
        const tableBody = document.getElementById('table-body');
        const row = this.createRow(newEntry, this.entries.length - 1);
        tableBody.appendChild(row);
        
        // Focus first cell
        setTimeout(() => row.querySelector('[contenteditable]').focus(), 50);
        
        this.updateEntryCount();
        this.hasChanges = true;
        showNotification('Row added');
    }
    
    createRow(entry, index) {
        const row = document.createElement('tr');
        row.dataset.index = index;
        row.innerHTML = `
            <td class="col-select"><input type="checkbox" class="row-select"></td>
            <td class="col-number">${index + 1}</td>
            <td class="col-source" contenteditable="true" data-field="source">${entry.source || ''}</td>
            <td class="col-target" contenteditable="true" data-field="target">${entry.target || ''}</td>
            <td class="col-notes" contenteditable="true" data-field="notes">${entry.notes || ''}</td>
        `;
        return row;
    }
    
    deleteSelectedRows() {
        const selected = Array.from(document.querySelectorAll('.row-select:checked'));
        if (selected.length === 0) {
            showNotification('No rows selected', 'error');
            return;
        }
        
        if (!confirm(`Delete ${selected.length} row(s)?`)) {
            return;
        }
        
        // Get indices to delete (reverse order to avoid index shifting)
        const indices = selected.map(cb => {
            return parseInt(cb.closest('tr').dataset.index);
        }).sort((a, b) => b - a);
        
        // Remove from data
        indices.forEach(index => {
            this.entries.splice(index, 1);
        });
        
        // Rebuild table
        this.rebuildTable();
        this.hasChanges = true;
        showNotification(`Deleted ${selected.length} row(s)`);
    }
    
    sort(order) {
        this.entries.sort((a, b) => {
            const aVal = (a.source || '').toLowerCase();
            const bVal = (b.source || '').toLowerCase();
            return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });
        
        this.rebuildTable();
        this.hasChanges = true;
        showNotification(`Sorted ${order === 'asc' ? 'A→Z' : 'Z→A'}`);
    }
    
    search(query) {
        const rows = document.querySelectorAll('#table-body tr');
        const lowerQuery = query.toLowerCase();
        
        let visibleCount = 0;
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(lowerQuery)) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        this.updateStatus(`Showing ${visibleCount} of ${this.entries.length} entries`);
    }
    
    findDuplicates() {
        const seen = new Map();
        const duplicates = [];
        
        this.entries.forEach((entry, index) => {
            const key = entry.source.toLowerCase().trim();
            if (key) {
                if (seen.has(key)) {
                    duplicates.push(index);
                    duplicates.push(seen.get(key));
                } else {
                    seen.set(key, index);
                }
            }
        });
        
        // Clear previous highlights
        document.querySelectorAll('.duplicate').forEach(el => el.classList.remove('duplicate'));
        
        if (duplicates.length === 0) {
            showNotification('No duplicates found', 'success');
            return;
        }
        
        // Highlight duplicates
        const uniqueDuplicates = [...new Set(duplicates)];
        uniqueDuplicates.forEach(index => {
            const row = document.querySelector(`tr[data-index="${index}"]`);
            if (row) {
                row.classList.add('duplicate');
            }
        });
        
        showNotification(`Found ${uniqueDuplicates.length} duplicate entries`, 'error');
    }
    
    importTSV() {
        const input = document.getElementById('import-file');
        input.click();
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                this.parseTSV(text);
            };
            reader.readAsText(file);
        };
    }
    
    parseTSV(text) {
        const lines = text.split('\n');
        const newEntries = [];
        
        lines.forEach((line, index) => {
            if (index === 0) return; // Skip header
            const parts = line.split('\t');
            if (parts.length >= 2) {
                newEntries.push({
                    source: parts[0].trim(),
                    target: parts[1].trim(),
                    notes: parts[2] ? parts[2].trim() : ''
                });
            }
        });
        
        if (confirm(`Import ${newEntries.length} entries? This will replace the current data.`)) {
            this.entries = newEntries;
            this.rebuildTable();
            this.hasChanges = true;
            showNotification(`Imported ${newEntries.length} entries`);
        }
    }
    
    exportTSV() {
        let tsv = `${this.glossaryData.source_lang}\t${this.glossaryData.target_lang}\tNotes\n`;
        
        this.entries.forEach(entry => {
            tsv += `${entry.source || ''}\t${entry.target || ''}\t${entry.notes || ''}\n`;
        });
        
        const blob = new Blob([tsv], { type: 'text/tab-separated-values' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.filename}.tsv`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Exported as TSV');
    }
    
    selectAll(checked) {
        document.querySelectorAll('.row-select').forEach(cb => {
            cb.checked = checked;
        });
    }
    
    rebuildTable() {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        
        this.entries.forEach((entry, index) => {
            const row = this.createRow(entry, index);
            tableBody.appendChild(row);
        });
        
        this.updateEntryCount();
    }
    
    updateEntryCount() {
        document.querySelector('.entry-count').textContent = `${this.entries.length} entries`;
    }
    
    updateStatus(message, type = '') {
        const statusEl = document.getElementById('status-message');
        statusEl.textContent = message;
        statusEl.className = type;
    }
    
    undo() {
        // TODO: Implement undo functionality
        showNotification('Undo not yet implemented');
    }
    
    redo() {
        // TODO: Implement redo functionality
        showNotification('Redo not yet implemented');
    }
    
    async save() {
        this.updateStatus('Saving...', 'saving');
        
        // Clean up entries (remove empty rows)
        const cleanedEntries = this.entries.filter(entry => {
            return entry.source.trim() || entry.target.trim();
        });
        
        // Prepare data for save
        const data = {
            ...this.glossaryData,
            entries: cleanedEntries
        };
        
        try {
            const response = await fetch(`/api/glossaries/${this.filename}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.hasChanges = false;
                this.entries = cleanedEntries;
                
                // Remove modified highlights
                document.querySelectorAll('.modified').forEach(el => {
                    el.classList.remove('modified');
                });
                
                // Update last saved time
                const now = new Date().toLocaleTimeString();
                document.getElementById('last-saved').textContent = now;
                
                this.updateStatus('All changes saved', 'saved');
                showNotification('Saved successfully!', 'success');
                
                // Rebuild if we cleaned rows
                if (cleanedEntries.length !== this.entries.length) {
                    this.rebuildTable();
                }
            } else {
                throw new Error('Save failed');
            }
        } catch (error) {
            console.error('Save error:', error);
            this.updateStatus('Error saving', 'error');
            showNotification('Error saving changes', 'error');
        }
    }
}

// Initialize editor when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.editor = new GlossaryEditor();
});

// Warn before leaving with unsaved changes
window.addEventListener('beforeunload', (e) => {
    if (window.editor && window.editor.hasChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});
