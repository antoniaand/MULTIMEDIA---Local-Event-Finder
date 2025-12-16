// scripts/audio.js
(() => {
  let audio = null;
  let currentSrc = null;

  function stopInternal() {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }

  function ensure(src) {
    // If switching tracks, stop previous
    if (audio && currentSrc && currentSrc !== src) {
      stopInternal();
    }

    // If no audio yet, or new track -> create a new Audio object
    if (!audio || currentSrc !== src) {
      audio = new Audio(src);
      audio.volume = 0.75;
      currentSrc = src;

      // Optional: cleanup when finished
      audio.addEventListener("ended", () => {
        // keep object (fine), or reset if you prefer:
        // audio = null; currentSrc = null;
      });
    }

    return audio;
  }

  function play(src) {
    if (!src) return;
    const a = ensure(src);

    a.play().catch((err) => {
      console.warn("Audio play blocked until user interaction.", err);
    });
  }

  function pause() {
    if (!audio) return;
    audio.pause();
  }

  function stop() {
    stopInternal();
  }

  function setVolume(v) {
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, v));
  }

  function togglePause() {
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch((err) => {
        console.warn("Audio play blocked until user interaction.", err);
      });
    } else {
      audio.pause();
    }
  }

  window.AudioController = { play, pause, togglePause, stop, setVolume };

})();
