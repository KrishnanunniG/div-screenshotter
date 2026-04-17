# Element Screenshot

A Chrome extension that lets you screenshot any element on a page — just like Firefox's built-in screenshot tool, but for Chrome.

Hover over any element to highlight it, click to capture it, and get a pixel-perfect cropped PNG downloaded instantly.

![Element Screenshot in action](https://via.placeholder.com/800x400?text=Add+a+gif+or+screenshot+here)

---

## Features

- **Element picker** — hover over any div, image, section, or other element to highlight it
- **Pixel-perfect crop** — captures only the selected element, not the whole page
- **Retina/HiDPI support** — accounts for device pixel ratio so screenshots are sharp on high-density displays
- **Keyboard shortcut** — `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
- **Live tooltip** — shows the element's tag, id/class, and pixel dimensions as you hover
- **Flash feedback** — brief white flash confirms the capture before the file downloads
- **No server, no tracking** — everything happens locally in your browser

---

## Installation

### From the Chrome Web Store

> Coming soon

### Manual install (developer mode)

1. Download or clone this repo
2. Go to `chrome://extensions` in your browser
3. Enable **Developer mode** using the toggle in the top-right corner
4. Click **Load unpacked** and select the `div-screenshot` folder
5. The extension icon will appear in your toolbar

---

## Usage

1. Press **Ctrl+Shift+X** (or **Cmd+Shift+X** on Mac), or click the extension icon and hit **Activate Picker**
2. Hover over any element on the page — it'll be highlighted with a blue outline
3. Click the element to capture it
4. A cropped PNG downloads automatically to your downloads folder
5. Press **Esc** at any time to cancel

---

## How it works

When you trigger a capture, the extension:

1. Takes a full visible-tab screenshot via the Chrome `captureVisibleTab` API
2. Reads the selected element's bounding rect (`getBoundingClientRect`)
3. Crops the screenshot to those exact coordinates on an HTML5 canvas, scaled by `devicePixelRatio`
4. Exports the canvas as a PNG and triggers a download

No external services, no image uploads, no dependencies.

---

## Project structure

```
div-screenshot/
├── manifest.json     # Extension manifest (MV3)
├── background.js     # Service worker — handles keyboard shortcut and tab capture
├── content.js        # Element picker — hover highlight, click to capture
├── content.css       # Overlay, tooltip, and flash animation styles
├── popup.html        # Toolbar popup UI
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## Permissions

| Permission | Why it's needed |
|---|---|
| `activeTab` | To access the current tab's DOM for element picking |
| `scripting` | To inject the content script on demand |
| `downloads` | To save the screenshot PNG to your downloads folder |

---

## Development

Clone the repo and load it unpacked as described above. Edit any file and hit the refresh button on `chrome://extensions` to reload.

```bash
git clone https://github.com/yourusername/div-screenshot.git
```

No build step required — it's plain HTML, CSS, and JavaScript.

---

## Contributing

PRs welcome. Some ideas if you want to contribute:

- Copy to clipboard instead of (or in addition to) downloading
- Capture elements that are partially off-screen by scrolling
- Add a delay timer for capturing hover states
- Support for selecting a custom region by dragging

---

## License

MIT
