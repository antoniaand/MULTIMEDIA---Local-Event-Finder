

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
});
