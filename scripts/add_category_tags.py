#!/usr/bin/env python3
"""Add category folder name as a tag to all glossary files."""

import re
from pathlib import Path

GLOSSARIES_DIR = Path(__file__).parent.parent / "glossaries"

def add_category_tags():
    updated = 0
    skipped = 0

    for md_file in GLOSSARIES_DIR.rglob("*.md"):
        category = md_file.parent.name
        category_tag = category.replace("-", " ").title()
        
        with open(md_file, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Check if file has frontmatter
        if not content.startswith("---"):
            continue
        
        # Find the end of frontmatter
        end_match = content.find("---", 3)
        if end_match == -1:
            continue
        
        frontmatter = content[3:end_match]
        body = content[end_match+3:]
        
        # Check if tags already exist
        if "tags:" in frontmatter:
            # Check if category tag is already there (case-insensitive)
            if category_tag.lower() in frontmatter.lower():
                skipped += 1
                continue
            # Add to existing tags (insert after "tags:\n")
            frontmatter = re.sub(
                r"(tags:\s*\n)",
                f"\\1  - {category_tag}\n",
                frontmatter
            )
        else:
            # Add new tags section
            frontmatter = frontmatter.rstrip() + f"\ntags:\n  - {category_tag}\n"
        
        new_content = "---" + frontmatter + "---" + body
        
        with open(md_file, "w", encoding="utf-8") as f:
            f.write(new_content)
        
        updated += 1
        print(f"Updated: {md_file.name} -> added tag \"{category_tag}\"")

    print(f"\nDone! Updated {updated} files, skipped {skipped} (already had category tag)")

if __name__ == "__main__":
    add_category_tags()
