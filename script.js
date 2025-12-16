

document.addEventListener("DOMContentLoaded", function () {
  const locateBtn = document.getElementById("locate-btn");
  const searchBtn = document.getElementById("search-btn");
  const cityInput = document.getElementById("city-input");


  if (locateBtn) {
    locateBtn.addEventListener("click", function () {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const ev = new CustomEvent("user-location", {
            detail: { lat: pos.coords.latitude, lng: pos.coords.longitude }
          });
          document.dispatchEvent(ev);
        },
        (err) => {
          alert("Unable to retrieve your location. Check site permissions.");
          console.error("Geolocation error:", err);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }


  if (searchBtn) {
    searchBtn.addEventListener("click", function () {
      cityInput.focus();
    });
  }



  // ==============================
  // Render event cards (Stage 3)
  // ==============================

  const container = document.getElementById("events-container");

  if (container && typeof EVENTS !== "undefined") {

    let html = "";

    EVENTS.forEach((ev) => {

      html += `
      <div class="event-card" id="event-${ev.id}">
        <h3>${ev.name}</h3>

        <p><strong>Location:</strong> ${ev.locationName}</p>
        <p><strong>Date:</strong> ${ev.date}</p>
    `;

      // Event image
      if (ev.image) {
        html += `
        <img class="event-thumb" src="${ev.image}" alt="${ev.name}">
      `;
      }

      // Event description
      if (ev.description) {
        html += `
        <p style="margin-top: 0.75rem;">${ev.description}</p>
      `;
      }

      // Audio controls (Stage 3 – Audio API)
      if (ev.audio) {
        html += `
        <div class="audio-api-controls" data-audio="${ev.audio}">
          <button type="button" class="card-audio-play">Play</button>
          <button type="button" class="card-audio-pause">Pause</button>
          <button type="button" class="card-audio-stop">Stop</button>
        </div>
      `;
      }

      html += `
      </div>
    `;
    });

    container.innerHTML = html;
    // ==============================
    // Audio buttons (event delegation)
    // ==============================
    if (!container.dataset.audioBound) {
      container.dataset.audioBound = "true";
      container.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const controls = btn.closest(".audio-api-controls");
        if (!controls) return;

        const src = controls.dataset.audio;
        if (!src) return;

        if (btn.classList.contains("card-audio-play")) {
          window.AudioController?.play(src);
        }

        if (btn.classList.contains("card-audio-pause")) {
          window.AudioController?.togglePause();
        }

        if (btn.classList.contains("card-audio-stop")) {
          window.AudioController?.stop();
        }
      });
    }

  }


});
