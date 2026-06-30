# Swas Kaushal - Personal Portfolio Website

A modern, responsive personal/academic website for **Swas Kaushal** - PhD researcher in
Plant Breeding & Genetics, Phenomics, Quantitative Genetics, and AI.

🔗 **Live site (after deploy):** https://swaskaushal.github.io

Built as a static site (HTML + CSS + vanilla JS) so it's fast, free to host on
**GitHub Pages**, and easy to update - all content lives in simple JSON/Markdown files.

---

## ✨ Features

| Section | What it does |
|---|---|
| **Hero** | Animated intro with photo, tagline, and social links |
| **About** | Bio + quick-facts card + CV download |
| **Journey** | Education & research timeline |
| **Projects** | Filterable cards pulling from your GitHub repos |
| **Publications** | Selected papers with links (full list → Google Scholar) |
| **Insights** | Cool charts: research focus, publications/year, skills |
| **Blog** | Weekly posts written in Markdown, opened in a modal reader |
| **Awards** | Honours & recognition with the story behind each |
| **Mentorship** | People you mentor - photo, name, role & university |
| **Gallery** | Photo wall with captions & dates (click to enlarge) |
| **Contact** | All your social/professional links |
| Extras | Dark/light theme, scroll progress, mobile menu, animations |

---

## 🗂️ Project structure

```
Swaskaushal.github.io/
├── index.html              ← page structure
├── .nojekyll               ← serve /data folder as-is
├── assets/
│   ├── css/style.css       ← all styling + theme
│   ├── js/main.js          ← all interactions & data loading
│   └── Swas_Kaushal_CV.pdf ← (add your CV here - see below)
└── data/                   ← ✏️ EDIT THESE to update the site
    ├── journey.json        ← timeline entries
    ├── projects.json       ← project cards
    ├── publications.json   ← publications
    ├── awards.json         ← awards
    ├── mentees.json        ← people you mentor
    ├── gallery.json        ← photo gallery (caption + date)
    ├── insights.json       ← chart numbers
    └── blog/
        ├── posts.json      ← list of blog posts
        └── *.md            ← one markdown file per post
```

---

## 🚀 Everyday updates - the easy way

Two PowerShell helpers live in the repo root. Open PowerShell in this folder and run:

**Publish any change to the live site:**
```powershell
./publish.ps1 "what I changed"
```
It checks your JSON files for typos, then commits & pushes. Your site refreshes in ~1 min.

**Update your CV** (converts a Word file to the PDF the site links to):
```powershell
./update-cv.ps1 "C:\path\to\CV_Kaushal.docx"          # just convert
./update-cv.ps1 "C:\path\to\CV_Kaushal.docx" -Publish  # convert + publish
```

## 👥 Add people you mentor
Edit `data/mentees.json` and put their photos in `assets/mentees/`:
```json
{ "name": "Jane Doe", "role": "MS Student", "university": "SDSU",
  "photo": "assets/mentees/jane.jpg", "linkedin": "", "email": "" }
```
No photo yet? It shows an automatic initials avatar.

## 🖼️ Add gallery photos
Put images in `assets/gallery/` and add an entry to `data/gallery.json`:
```json
{ "image": "assets/gallery/fieldday.jpg",
  "caption": "Field phenotyping day", "date": "2025-06-15" }
```
Newest photos show first; click any photo to view it large.

---

## ✏️ How to update the site (no coding needed)

Everything is data-driven. To change content, edit the JSON files in `data/`.

### Add a project
Open `data/projects.json` and copy a block:
```json
{
  "title": "My New Project",
  "description": "What it does.",
  "icon": "fa-solid fa-flask",
  "categories": ["AI / Tools"],
  "tags": ["Python", "ML"],
  "repo": "https://github.com/Swaskaushal/your-repo",
  "demo": "https://your-demo-link"
}
```
Icons use [Font Awesome](https://fontawesome.com/search) class names.

### Add a publication
Edit `data/publications.json`:
```json
{
  "title": "Paper title",
  "authors": "Kaushal, S., Coauthor, A.",
  "venue": "Journal name, Vol(Issue), pages",
  "year": 2025,
  "link": "https://link-to-paper",
  "doi": "10.xxxx/xxxxx"
}
```
> Your name is automatically **bold-highlighted** in the author list.

### Add an award
Edit `data/awards.json` - copy a block and fill in `title`, `org`, `year`, `story`, `icon`.

### Add a weekly blog post (2 steps)
1. Create a markdown file in `data/blog/`, e.g. `2026-07-06-my-post.md`.
2. Add an entry at the **top** of `data/blog/posts.json`:
```json
{
  "title": "My post title",
  "date": "2026-07-06",
  "readTime": "4 min",
  "excerpt": "One-line teaser shown on the card.",
  "tags": ["Paper Notes"],
  "file": "2026-07-06-my-post.md"
}
```

### Update the charts
Edit the numbers in `data/insights.json`.

### Add your CV
Drop your CV as `assets/Swas_Kaushal_CV.pdf` (export the .docx to PDF). The
"Download CV" button already points there.

---

## 🚀 Deploy to GitHub Pages

Because the repo is named **`Swaskaushal.github.io`**, it becomes your personal
site at `https://swaskaushal.github.io` automatically.

### One-time setup
```bash
cd Swaskaushal.github.io
git init
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin https://github.com/Swaskaushal/Swaskaushal.github.io.git
git push -u origin main
```

Then on GitHub:
1. Go to the repo → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: **`main`**, folder: **`/ (root)`** → **Save**.
4. Wait ~1 minute. Your site is live at **https://swaskaushal.github.io** 🎉

### Updating later
```bash
git add .
git commit -m "Add new blog post / project"
git push
```
The live site refreshes automatically within a minute.

---

## 🧪 Preview locally

Because the site fetches JSON files, open it through a local server (not by
double-clicking `index.html`):

```bash
# Python
python -m http.server 8000
# then visit http://localhost:8000
```

---

## 📝 Notes / things to personalize

- Update **education entries** in `data/journey.json` (Master's & undergrad placeholders).
- Replace **placeholder publications** with your real papers from Google Scholar.
- Replace **placeholder awards** with your real awards and stories.
- Confirm your **email** in `index.html` (currently `swas.kaushal@jacks.sdstate.edu`).
- Add your **CV PDF** to `assets/`.

Enjoy! The site is designed to grow with you. 🌱
