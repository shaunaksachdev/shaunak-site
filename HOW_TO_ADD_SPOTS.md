# How to Add a Spot to the Metro Vancouver Map

## Step 1 — Find the coordinates

**Option A — Use the built-in coordinate finder (easiest)**
1. Serve the site locally (see below)
2. Open `vancouver.html` in your browser
3. Click anywhere on the map
4. The coordinates are copied to your clipboard as JSON and a toast appears confirming
5. Paste into `data/spots.json`

**Option B — Use geojson.io**
1. Go to https://geojson.io
2. Click your location on the map
3. The sidebar shows `[ longitude, latitude ]` — note these are reversed from Leaflet's order

## Step 2 — Edit data/spots.json

Open `data/spots.json` and add a new object to the array:

```json
{
  "name": "Place Name",
  "lat": 49.3097,
  "lng": -123.0753,
  "category": "coffee",
  "note": "Why this place is worth visiting."
}
```

Valid categories: `coffee` | `food` | `nature` | `view`

## Step 3 — Done

Refresh `vancouver.html` and your pin appears on the map.

## Running locally (required for map to load)

The map fetches `data/spots.json` via `fetch()`, which doesn't work over `file://` URLs. Run a simple local server from the project root:

```bash
# Python 3
python -m http.server 8000

# Node (if you have npx)
npx serve .
```

Then open http://localhost:8000 in your browser.

On GitHub Pages, this works automatically — no server needed.
