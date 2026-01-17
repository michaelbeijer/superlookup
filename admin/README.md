# Beijerterm Admin Panel

Custom Flask-based CMS for managing [Beijerterm](https://beijerterm.com) content (glossaries, terms, and resources).

## ✨ Features

- **📚 Glossary Editor**: Excel-like spreadsheet interface for editing bilingual glossaries
- **📝 Term Editor**: Markdown editor with formatting toolbar for term pages
- **📄 Resource Editor**: Markdown editor for blog posts and documentation
- **🔍 Search & Filter**: Find content quickly across 200+ glossaries
- **🚀 Git Integration**: Commit and push changes directly from the UI
- **✨ Create New**: Add new glossaries, terms, and resources with templates
- **🔐 GitHub OAuth**: Secure authentication (production) or bypass (development)

---

## 🚀 Quick Start (Development)

### Prerequisites

- Python 3.8+
- Git
- Access to michaelbeijer/beijerterm repository

### Installation

```bash
cd beijerterm/admin
pip install -r requirements.txt
```

### Run Locally

```bash
python start_dev.py
```

The admin panel will open at: **http://localhost:5000**

Development mode automatically bypasses GitHub OAuth for easy local testing.

### VS Code Shortcuts

If working in the Supervertaler workspace:

- Press **Ctrl+Shift+Alt+A** to start the server
- Or run task: **"🌐 Start Beijerterm Admin Panel"**
- Or double-click `start-admin.ps1` in the project root

---

## 🌐 Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete step-by-step deployment guide.

**Quick summary:**
1. Create GitHub OAuth App
2. Deploy to Railway/Render/Fly.io
3. Set environment variables
4. Configure custom domain (optional)

**Supported Platforms:**
- ✅ Railway (recommended - easiest)
- ✅ Render
- ✅ Fly.io
- ✅ Any platform supporting Python + gunicorn

---

## 🔧 Configuration

### Environment Variables

**Development** (set in `start_dev.py` or shell):
```bash
ADMIN_DEV_MODE=true
```

**Production** (set in hosting platform):
```env
FLASK_SECRET_KEY=<random-secret-key>
GITHUB_CLIENT_ID=<oauth-app-client-id>
GITHUB_CLIENT_SECRET=<oauth-app-client-secret>
ALLOWED_GITHUB_USERS=michaelbeijer
PRODUCTION=true
CALLBACK_URL=https://admin.beijerterm.com/auth/github/callback
```

### File Structure

```
admin/
├── app.py                  # Main Flask application
├── start_dev.py            # Development server launcher
├── requirements.txt        # Python dependencies
├── Procfile                # Deployment configuration
├── railway.json            # Railway-specific config
├── render.yaml             # Render-specific config
├── .env.example            # Environment variables template
├── templates/              # Jinja2 HTML templates
│   ├── index.html         # Dashboard
│   ├── login.html         # OAuth login page
│   ├── glossaries.html    # Glossaries list
│   ├── glossary_editor.html
│   ├── glossary_new.html
│   ├── terms.html         # Terms list
│   ├── term_editor.html
│   ├── term_new.html
│   ├── resources.html     # Resources list
│   ├── resource_editor.html
│   └── resource_new.html
└── static/
    ├── css/admin.css       # Styles
    └── js/
        ├── admin.js        # Common JavaScript
        └── glossary_editor.js  # Spreadsheet functionality
```

---

## 📝 Usage

### Editing Glossaries

1. Go to **Glossaries** tab
2. Click a glossary name to open the spreadsheet editor
3. Edit cells (Excel-like interface):
   - Click cell to edit
   - Tab/Enter to move between cells
   - Ctrl+S to save
4. Click **🚀 Commit & Push** to publish to GitHub

### Creating New Content

**New Glossary:**
- Glossaries → **+ New Glossary**
- Choose subdirectory (e.g., `automotive/`)
- Enter filename, title, source/target languages
- Click **Create Glossary**

**New Term:**
- Terms → **+ New Term Page**
- Enter filename, title, description, content
- Click **Create Term**

**New Resource:**
- Resources → **+ New Resource**
- Enter filename, title, content
- Click **Create Resource**

### Publishing Changes

Two ways to publish:

1. **Save + Commit & Push** (recommended):
   - Edit content
   - Save (Ctrl+S)
   - Click **🚀 Commit & Push**
   - Enter commit message
   - Confirm

2. **Manual git workflow**:
   - Edit and save multiple files
   - Exit admin panel
   - Use git commands in terminal

---

## 🔐 Authentication

### Development Mode
- Bypasses GitHub OAuth for local testing
- Set `ADMIN_DEV_MODE=true` environment variable
- Click "Continue as dev user" on login page

### Production Mode
- Requires GitHub OAuth
- Only users in `ALLOWED_GITHUB_USERS` can access
- OAuth token used for git operations

---

## 🐛 Troubleshooting

**Server won't start**
```bash
# Check if port 5000 is already in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <process_id> /F
```

**OAuth errors**
- Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
- Check `CALLBACK_URL` matches GitHub OAuth app settings
- Make sure user is in `ALLOWED_GITHUB_USERS` list

**Git push fails**
- Make sure you have push access to the repository
- Check GitHub token permissions
- Try manual git push to verify credentials

**Changes not appearing on site**
- Changes need to be pushed to GitHub
- Static site rebuilds automatically via GitHub Actions
- Wait 1-2 minutes for GitHub Pages deployment

---

## 🛠️ Development

### Adding New Features

1. Edit `app.py` for new routes/APIs
2. Add templates in `templates/`
3. Add styles in `static/css/admin.css`
4. Add JavaScript in `static/js/`
5. Test locally with `python start_dev.py`
6. Commit and push to deploy

### Tech Stack

- **Backend**: Flask 3.0+
- **Frontend**: Vanilla JavaScript, no framework
- **Styling**: Custom CSS, no framework
- **Data Format**: YAML frontmatter + Markdown
- **Deployment**: gunicorn WSGI server
- **Authentication**: GitHub OAuth 2.0

---

## 📄 License

Same as Beijerterm project - see main repository LICENSE.

---

## 🆘 Support

- Report issues: [GitHub Issues](https://github.com/michaelbeijer/beijerterm/issues)
- Contact: info@michaelbeijer.co.uk
- Website: https://beijerterm.com
