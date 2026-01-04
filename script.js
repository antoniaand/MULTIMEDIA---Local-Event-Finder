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

      if (ev.image) {
        html += `
        <img class="event-thumb" src="${ev.image}" alt="${ev.name}">
      `;
      }

      if (ev.description) {
        html += `
        <p style="margin-top: 0.75rem;">${ev.description}</p>
      `;
      }

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

  // ---- CANVAS CHART CODE ----
  const canvas = document.getElementById("eventsCanvas");

  if (canvas && typeof EVENTS !== "undefined") {

    // <-- ADD THIS: generate eventStats from EVENTS -->
    const eventStats = getEventStats(EVENTS);

    const ctx = canvas.getContext("2d");
    const colors = ["#4A90E2", "#F5A623", "#7ED321", "#BD10E0"];

    const eventsData = eventStats.map((event, index) => ({
      ...event,
      color: colors[index % colors.length]
    }));

    const padding = 50;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = 60;
    const maxValue = Math.max(...eventsData.map(e => e.value));

    let animationProgress = 0;
    let hoveredIndex = -1;

    function drawChart(progress = 1) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#2e434c";
      ctx.font = "700 16px 'Nunito Sans'";
      ctx.fillText("Event Popularity Overview", padding, 28);

      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
      }

      eventsData.forEach((event, index) => {
        const x = padding + index * 120;
        const fullHeight = (event.value / maxValue) * chartHeight;
        const height = fullHeight * progress;
        const y = canvas.height - padding - height;

        ctx.fillStyle = event.color;
        ctx.fillRect(x, y, barWidth, height);

        ctx.fillStyle = "#2e434c";
        ctx.font = "600 13px 'Nunito Sans'";
        ctx.fillText(event.name, x + 5, canvas.height - padding + 18);

        if (hoveredIndex === index) {
          ctx.fillStyle = "#000";
          ctx.font = "700 14px 'Nunito Sans'";
          ctx.fillText(event.value, x + 10, y - 8);
        }
      });
    }

    function animate() {
      animationProgress += 0.02;
      if (animationProgress > 1) animationProgress = 1;

      drawChart(animationProgress);

      if (animationProgress < 1) {
        requestAnimationFrame(animate);
      }
    }

    animate();

  function getEventStats(events) {
  // Each event is a bar, value is 1
  return events.map(event => ({
    name: event.name || "Unnamed Event",
    value: 1
  }));
}


    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      hoveredIndex = -1;

      eventsData.forEach((event, index) => {
        const x = padding + index * 120;
        const height = (event.value / maxValue) * chartHeight;
        const y = canvas.height - padding - height;

        if (
          mouseX >= x &&
          mouseX <= x + barWidth &&
          mouseY >= y &&
          mouseY <= y + height
        ) {
          hoveredIndex = index;
        }
      });

      drawChart(animationProgress);
    });

    canvas.addEventListener("mouseleave", () => {
      hoveredIndex = -1;
      drawChart(animationProgress);
    });
  }
});
