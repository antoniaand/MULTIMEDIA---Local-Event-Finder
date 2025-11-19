(function () {
  if (typeof L === "undefined") {
    console.error("Leaflet not loaded. Make sure leaflet.js is included.");
    return;
  }

  const DEFAULT_CENTER = [44.439663, 26.096306];
  const DEFAULT_ZOOM = 13;

  const map = L.map("map", {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    zoomControl: true
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(map);

  L.control.scale().addTo(map);

  let userMarker = null;

  function addEventMarker(ev) {
    const marker = L.circleMarker([ev.lat, ev.lng], {
      radius: 9,
      fillColor: "#5D9CBA",
      color: "#2e434c",
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.95
    }).addTo(map);

    const popupHtml = `
      <div class="popup-card">
        <h3 class="popup-title">${ev.name}</h3>
        <p class="popup-location"><strong>${ev.locationName}</strong> — ${ev.date}</p>
        <p class="popup-desc">${ev.description || ""}</p>
        ${ev.image ? `<img class="popup-thumb" src="${ev.image}" alt="${ev.name}">` : ""}
        ${ev.audio ? `<audio controls class="popup-audio"><source src="${ev.audio}" type="audio/mpeg">Your browser does not support audio.</audio>` : ""}
        <div style="margin-top: 0.5rem;"><a href="#event-${ev.id}" class="popup-link">View details</a></div>
      </div>
    `;

    marker.bindPopup(popupHtml, { minWidth: 220, maxWidth: 320 });

    marker.on("mouseover", () => marker.openPopup());
    marker.on("mouseout", () => marker.closePopup());
  }

  if (typeof EVENTS !== "undefined" && Array.isArray(EVENTS) && EVENTS.length > 0) {
    EVENTS.forEach(addEventMarker);

    try {
      const bounds = L.latLngBounds(EVENTS.map(e => [e.lat, e.lng]));
      map.fitBounds(bounds.pad(0.25));
    } catch (err) {
      console.warn("Could not fit bounds, using default center.", err);
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  } else {
    console.warn("No EVENTS array found; map initialized with default center.");
  }

  const LegendControl = L.Control.extend({
    options: { position: "topright" },
    onAdd: function () {
      const el = L.DomUtil.create("div", "map-legend");
      el.innerHTML = `<strong>Legend</strong><br><span class="legend-dot"></span> Event location`;
      return el;
    }
  });
  map.addControl(new LegendControl());

  document.addEventListener("user-location", (e) => {
    const { lat, lng } = e.detail || {};
    if (!lat || !lng) return;
    if (userMarker) {
      map.removeLayer(userMarker);
      userMarker = null;
    }
    userMarker = L.circleMarker([lat, lng], {
      radius: 8,
      fillColor: "#B0D980",
      color: "#2e434c",
      weight: 1.25,
      fillOpacity: 0.95
    }).addTo(map);

    userMarker.bindPopup("<strong>Your location</strong>").openPopup();

    map.setView([lat, lng], 14, { animate: true });
  });
})();
