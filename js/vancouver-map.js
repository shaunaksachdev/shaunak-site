const map = L.map('map', {
  center:           [49.55, -123.05],
  zoom:             10,
  scrollWheelZoom:  false,
  zoomControl:      true,
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: [
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">',
    'OpenStreetMap</a> contributors',
    ' &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
  ].join(''),
  subdomains: 'abcd',
  maxZoom: 19,
}).addTo(map);

map.on('click', function (e) {
  const lat  = e.latlng.lat.toFixed(4);
  const lng  = e.latlng.lng.toFixed(4);
  const json = `{ "lat": ${lat}, "lng": ${lng} }`;

  navigator.clipboard.writeText(json).then(() => {
    showToast(`Copied: ${json}`);
  }).catch(() => {
    showToast(`${lat}, ${lng}`);
  });
});

function showToast(msg) {
  const el = document.createElement('div');
  el.className  = 'coord-toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, 3000);
}

const markerStore = [];

async function init() {
  let spots;
  try {
    const res = await fetch('data/spots.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    spots = await res.json();
  } catch (err) {
    console.error('Could not load spots.json:', err);
    document.getElementById('spotList').innerHTML =
      '<p style="color: var(--muted); font-style: italic; padding: 1rem 0;">' +
      'Map data unavailable. See HOW_TO_ADD_SPOTS.md for setup instructions.' +
      '</p>';
    return;
  }

  buildMarkers(spots);
  buildSpotList(spots);
  initFilters();
}

function buildMarkers(spots) {
  spots.forEach((spot, i) => {
    const marker = L.circleMarker([spot.lat, spot.lng], {
      radius:      7,
      fillColor:   '#1C1917',
      color:       '#1C1917',
      weight:      0,
      fillOpacity: 0.80,
    });

    marker.on('mouseover', function () { this.setStyle({ fillOpacity: 1 }); });
    marker.on('mouseout',  function () { this.setStyle({ fillOpacity: 0.80 }); });

    marker.bindPopup(
      `<span class="popup-name">${spot.name}</span>` +
      `<span class="popup-cat">${spot.category}</span>` +
      `<p class="popup-note">${spot.note}</p>`,
      { maxWidth: 220, minWidth: 170, className: 'site-popup' }
    );

    marker.addTo(map);
    markerStore.push({ marker, spot, index: i });
  });
}

function buildSpotList(spots) {
  const list = document.getElementById('spotList');

  spots.forEach((spot, i) => {
    const item = document.createElement('div');
    item.className    = 'spot-item';
    item.dataset.cat  = spot.category;
    item.dataset.idx  = i;
    item.innerHTML    =
      `<div class="spot-left">` +
        `<div class="spot-name">${spot.name}</div>` +
        `<div class="spot-note">${spot.note}</div>` +
      `</div>` +
      `<span class="spot-tag">${spot.category}</span>`;

    item.addEventListener('click', () => {
      map.flyTo([spot.lat, spot.lng], 14, { duration: 0.8 });
      const { marker } = markerStore[i];
      setTimeout(() => marker.openPopup(), 870);
    });

    list.appendChild(item);
  });
}

function initFilters() {
  let active = 'all';

  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      active = pill.dataset.cat;

      document.querySelectorAll('.pill').forEach(p =>
        p.classList.toggle('active', p.dataset.cat === active)
      );

      markerStore.forEach(({ marker, spot }) => {
        const show = active === 'all' || spot.category === active;
        show ? marker.addTo(map) : marker.remove();
      });

      document.querySelectorAll('.spot-item').forEach(item => {
        item.style.display =
          (active === 'all' || item.dataset.cat === active) ? '' : 'none';
      });
    });
  });
}

init();
