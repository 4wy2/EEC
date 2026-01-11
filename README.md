# EE Portal (Organized)

## Structure
- `index.html` : Main portal + sidebar navigation
- `faculty.html` : Faculty search page

### Assets
- `assets/css/style.css` : Shared theme/components (glass/buttons/background)
- `assets/css/faculty.css` : Faculty-page-only CSS (toast/table hints)
- `assets/js/portal.js` : Sidebar open/close logic for the portal
- `assets/js/faculty-data.js` : Faculty dataset (offline-friendly, edit here to update names)
- `assets/js/faculty.js` : Faculty search/filter/copy logic

## How to edit safely
1. **Design/theme**: edit `assets/css/style.css`
2. **Faculty table/toast**: edit `assets/css/faculty.css`
3. **Sidebar behavior**: edit `assets/js/portal.js`
4. **Faculty names/emails/offices**: edit `assets/js/faculty-data.js`
5. **Search behavior**: edit `assets/js/faculty.js`

## Run
Open `index.html` in a browser. All data is local (no fetch), so it works on `file://` and any hosting.
