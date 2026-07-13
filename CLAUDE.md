# CLAUDE.md

Guidance for AI assistants (and humans) working in this repository.

## What this repository is

This is a **Streamlit application scaffold**, generated from the standard
Streamlit + GitHub Codespaces template. At present it is essentially empty —
the application entry point exists but contains no code yet. Treat this as a
greenfield project: the conventions below describe how the scaffold is wired,
so new work should build on that wiring rather than replace it.

## Repository structure

```
.
├── streamlit_app.py          # Application entry point (currently empty)
├── README.md                 # Project README (placeholder: "# 123")
└── .devcontainer/
    └── devcontainer.json     # Dev container / Codespaces configuration
```

There is no `requirements.txt`, `packages.txt`, test suite, or CI
configuration yet. When you add dependencies or tooling, follow the
conventions in the sections below so the dev container keeps working.

## Key files

- **`streamlit_app.py`** — the single entry point Streamlit runs. All app code
  starts here. The dev container launches it with
  `streamlit run streamlit_app.py`.
- **`.devcontainer/devcontainer.json`** — defines the reproducible dev
  environment (Python 3.11 on Debian Bookworm). It drives dependency
  installation and app startup; see below.

## Development environment

The project targets **Python 3.11** via the dev container image
`mcr.microsoft.com/devcontainers/python:1-3.11-bookworm`.

The dev container automates two things:

1. **Dependency install** (`updateContentCommand`), run when the container is
   created/updated. It:
   - installs system packages from `packages.txt` (via `apt`) **if that file
     exists**,
   - installs Python packages from `requirements.txt` (via `pip`) **if that
     file exists**,
   - always installs `streamlit`.
2. **App startup** (`postAttachCommand`), run when you attach to the
   container:
   ```
   streamlit run streamlit_app.py --server.enableCORS false --server.enableXsrfProtection false
   ```
   The app is served on **port 8501**, which is forwarded and auto-opened as a
   preview.

### Adding dependencies

- **Python packages:** create/edit `requirements.txt` in the repo root. It is
  picked up automatically by the dev container on rebuild. Streamlit itself is
  always installed, so it does not need to be listed (but pinning it there is
  fine if you want a specific version).
- **System packages:** create/edit `packages.txt` (one apt package name per
  line). It is installed via `apt` before the Python packages.

## Running the app locally

Outside the dev container:

```bash
pip install streamlit          # plus: pip install -r requirements.txt (once it exists)
streamlit run streamlit_app.py
```

Then open http://localhost:8501.

## Conventions

- **Single entry point:** keep `streamlit_app.py` as the file Streamlit runs.
  If the app grows, factor logic into additional modules/packages that
  `streamlit_app.py` imports, rather than renaming the entry point (the dev
  container hardcodes this filename).
- **Editor tooling:** the dev container enables the VS Code Python and Pylance
  extensions, so code is expected to be Python and type-check-friendly.
- **Keep the scaffold intact:** the dev container's install/startup commands
  depend on the file names above (`streamlit_app.py`, optional
  `requirements.txt`, optional `packages.txt`). Update
  `.devcontainer/devcontainer.json` in step if you change them.

## Git workflow

- Default branch: `main`.
- Make focused commits with clear, descriptive messages.
- Do not force-push to `main`.

## Notes for AI assistants

- This repo is currently a blank slate. Before assuming a framework, database,
  or architecture exists, check the actual files — most "expected" project
  files (tests, CI, requirements) are not present yet.
- When you add real functionality, update this CLAUDE.md and the README to
  reflect what the app actually does.
