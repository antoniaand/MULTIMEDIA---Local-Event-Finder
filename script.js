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

  const canvas = document.getElementById("eventsCanvas");

  if (canvas && typeof EVENTS !== "undefined") {

    function getCategoryStats(events) {
      const counts = {};
      events.forEach(ev => {
        const cat = ev.category || "Other";
        counts[cat] = (counts[cat] || 0) + 1;
      });

      return Object.keys(counts).map(key => ({
        name: key,
        value: counts[key]
      }));
    }

    const eventStats = getCategoryStats(EVENTS);

    const ctx = canvas.getContext("2d");
    const categoryColors = {
      "Music": "#4A90E2",
      "Tech": "#F5A623",
      "Food": "#7ED321",
      "Art": "#BD10E0",
      "Other": "#9B9B9B"
    };

    const eventsData = eventStats.map((cat) => ({
      ...cat,
      color: categoryColors[cat.name] || "#5D9CBA"
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
      ctx.font = "700 18px 'Nunito Sans'";
      ctx.textAlign = "left"; 
      ctx.fillText("Event Activity by Category", padding, 30);

      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      ctx.shadowBlur = 0; 
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
      }

      eventsData.forEach((event, index) => {
        const x = padding + index * 140;
        const fullHeight = (event.value / maxValue) * chartHeight;
        const height = fullHeight * progress;
        const y = canvas.height - padding - height;

        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.fillStyle = event.color;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, [12, 12, 0, 0]);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = "#2e434c";
        ctx.font = "700 14px 'Nunito Sans'";
        ctx.textAlign = "center";
        ctx.fillText(event.name, x + barWidth / 2, canvas.height - padding + 25);

        if (hoveredIndex === index) {
          ctx.fillStyle = "#000";
          ctx.font = "800 15px 'Nunito Sans'";
          ctx.fillText(event.value, x + barWidth / 2, y - 10);
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

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      hoveredIndex = -1;

      eventsData.forEach((event, index) => {
        const x = padding + index * 140;
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
