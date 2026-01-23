# Chrome Extensions Collection

This repository contains four Chrome extensions designed to streamline everyday browsing tasks.

## Extensions

### 1. Markdown Link Copier
Copy the current page's title and URL in link format to the clipboard.

**Features:**
- Supports three formats: Markdown, HTML, and Text
- Select format from popup and copy with one click

**Usage:**
Click the extension icon, select your desired format, and press the "Copy" button.

---

### 2. Amazon Markdown Copier
Extract product information from Amazon product pages and generate Markdown-formatted links.

**Features:**
- Automatically retrieves product name, thumbnail image, and ASIN
- Generates image and link in Markdown format
- Supports affiliate tags

**Usage:**
Click the extension icon on an Amazon product page to copy the Markdown-formatted link to your clipboard.

**Output Format:**
```markdown
![Product Name](Thumbnail Image URL)

[Product Name](Product Page URL)
```

---

### 3. TVer Full Width Player
Display TVer's video player at full browser width.

**Features:**
- Maximize video with one click
- Press Esc key or click anywhere to return to normal view
- Automatically adds "⛶ Display at full browser width" button on video pages

**Usage:**
Click the button that appears on TVer video pages, or click the extension icon.

---

### 4. MCP Server Config Extractor
Extract MCP server configuration from JSON, removing the outer `mcpServers` wrapper.

**Features:**
- Extracts content from within `mcpServers` key in JSON
- Automatically formats and removes outer wrapper
- Keyboard shortcut support: `Ctrl+Shift+E` (Windows/Linux) or `Command+Shift+E` (Mac)

**Usage:**
Select JSON text containing `mcpServers` configuration on any webpage and press the keyboard shortcut to copy the extracted configuration to your clipboard.

**Input Example:**
```json
{
  "mcpServers": {
    "server1": {
      "command": "node",
      "args": ["server.js"]
    }
  }
}
```

**Output:**
```json
"server1": {
  "command": "node",
  "args": ["server.js"]
}
```

---

## Installation

Each extension can be installed individually.

1. Open Chrome extensions page (`chrome://extensions/`)
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the folder of the extension you want to install (`markdown_link_copier`, `amazon_markdown_copier`, `tver-full-width`, or `mcpconfig`)

## License

MIT License - All extensions are available for personal and commercial use.
