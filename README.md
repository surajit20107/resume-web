# Resume Studio

An editable, ATS-friendly web version of my resume. Instead of editing a PDF
by hand, edit the page in the browser (or in one data file) and download a fresh,
clean copy every time.

## Run it

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
npm run lint     # lint
```

## Editing the resume

There are two ways, and they share the same data:

1. **In the browser (quick edits).** Click **Edit** in the toolbar, change any
   field, then click **Done editing**. Changes are saved to `localStorage`
   automatically, so they survive a refresh.

2. **In code (permanent defaults).** Edit `src/data/resume.js`. This file is the
   single source of truth for the content, so the rendered page and the exports
   always stay in sync.

Use **Export** to save the current content as JSON (a backup) and **Import** to
load it back. **Reset** returns everything to the values in
`src/data/resume.js`.

## Downloading the resume

The toolbar has three export buttons:

| Button | What it gives you | Best for |
| --- | --- | --- |
| **Download PDF** | Opens the browser print dialog — choose **Save as PDF** | Sending to recruiters, uploading to job portals |
| **.txt** | A plain-text version | Maximum ATS compatibility (paste into online application boxes) |
| **Export** | The raw content as `.json` | Backing up / moving edits between machines |

**For the cleanest PDF:** in the print dialog set **Margins: Default**, turn
**Headers and footers off**, and make sure scaling is 100% (not "Fit to page").
This keeps the text layer clean so ATS software reads it correctly.

Use the **1-page / Roomier** toggle to switch between a tight single-page layout
and a slightly more relaxed one.

## Dark mode

The theme switch at the right of the toolbar has three options:
**Light**, **Dark** and **System** (follows your OS setting). Your choice is
saved and applied before the page paints, so there is no flash of light mode on
load. The default is **System**.

Dark mode only changes the screen. The downloaded PDF is **always black text on
white paper**, so you can edit comfortably at night without any risk to the
output.

## Why the downloaded PDF is ATS-friendly

- **Real, selectable text** — never an image or a scan.
- **Single column**, no tables, text boxes, columns, or graphics.
- **Standard section headings**: Summary, Technical Skills, Education,
  Experience, Projects.
- **Plain, standard fonts**, with letter-spacing removed in print so PDF text
  extraction does not insert stray spaces (e.g. `S U M M A RY`).
- **Entries and bullets never split** across page breaks.
- Contact details and links appear as **readable text**, not as icons.

## Project structure

```
src/
  data/resume.js            Content — edit this to change the resume
  lib/resumeIO.js           Storage keys, downloads, plain-text export
  hooks/useResume.js        State + localStorage persistence
  hooks/useTheme.js         Light / dark / system theme
  components/
    ResumeSheet.jsx         The resume document (semantic, single column)
    EditorPanel.jsx         Live editor UI
    Toolbar.jsx             Edit / download / import / reset controls
    ThemeToggle.jsx         Light / dark / system switch
  index.css                 Screen styles + A4 print stylesheet
```
