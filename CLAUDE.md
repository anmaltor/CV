# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is a personal CV/résumé repository for **Antonio Mallol Torralbo** (rail & transit executive). It is not a software project — it holds versioned CV documents plus the lightweight tooling used to generate them. Typical work here is producing role-tailored variants of the CV (e.g. repositioning the same career history for a specific job, company, or sector).

## Source of truth for career facts

`CV Antonio Mallol_Dec2025_FLOW_.pdf` is the canonical master record of Antonio's career history (roles, dates, employers, metrics). **Do not invent or alter facts** — every claim in any tailored variant must trace back to this master. Tailoring means re-emphasizing, re-ordering, and reframing existing facts for a target role, not adding new ones. When a tailored variant needs information not in the master (e.g. languages, relocation willingness), flag it as an assumption rather than asserting it.

## Generation pipeline

Two independent generators produce the two output formats from the same content:

- **PDF** is rendered from a hand-authored HTML file via WeasyPrint. The HTML carries the full two-column visual design (serif headings, green `#5f7d6e` / `#46604f` accent theme matching the original template). This is the verified, presentation-quality output.
- **DOCX** is built programmatically with `python-docx` (see `make_docx.py`) as an editable single-column version. Content is duplicated in the script, so **keep the HTML and the script in sync** when editing content.

### Commands

```bash
# Regenerate the PDF from the HTML source
python3 -c "from weasyprint import HTML; HTML('cv_bid_manager.html').write_pdf('CV Antonio Mallol_Bid Manager_RATP Dubai Blue Line.pdf')"

# Regenerate the DOCX
python3 make_docx.py

# One-time dependency install if missing
pip install weasyprint python-docx
```

Verify a rendered PDF by reading it back with the Read tool (it ingests PDFs visually) to check layout and page breaks.

### Environment note

LibreOffice/`soffice` is installed, but **headless DOCX→PDF conversion fails in this sandbox** ("source file could not be loaded"). Do not rely on it to validate DOCX output; instead validate with `python-docx` (reopen the file) and treat the WeasyPrint PDF as the layout reference.

## Conventions

- Tailored variants are named `CV Antonio Mallol_<Target Role/Org>_...` — filenames contain spaces, so quote them in shell commands.
- Each tailored variant is a separate, self-contained pair of generator + outputs; existing CVs are kept rather than overwritten so prior versions remain available.

## Workflow

Develop on the designated feature branch, commit with descriptive messages, push with `git push -u origin <branch>`, then open a **draft** PR. Commit the generated PDF and DOCX alongside their HTML/Python sources so a variant can be regenerated later.
