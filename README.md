# bathtimefish.github.io

Source of https://www.bathtimefish.com/ (GitHub Pages, plain static HTML).

| Path | Page |
|---|---|
| `index.html` | Top page |
| `company.html` | Company profile |
| `kraken/` | Kraken product page (`index.html` = ja, `en.html` = en) |
| `mrag/` | mrag product page (`index.html` = ja, `en.html` = en) |
| `bjigcli/` | BraveJIG CLI product page (`index.html` = ja, `en.html` = en) |
| `bjigmcp/` | BraveJIG MCP Server product page (`index.html` = ja) |
| `kraken-by-bathtimefish/`, `bjigcli-by-bathtimefish/` | Redirect stubs for the old product-site URLs |

Shared design lives in `css/site.css` and `js/site.js`; each product page adds only its own
page-specific rules (`kraken/kraken.css`, `mrag/mrag.css`, `bjigcli/bjigcli.css`, `bjigmcp/bjigmcp.css`). When adding a page, copy the
`site-header` / `site-footer` blocks from an existing page and link `/css/site.css`.

Local preview: `python3 -m http.server 8000` then open http://localhost:8000/
