# 🎉 Events Hub – Local Event Finder

**Events Hub** (aka *Local Event Finder*) is a web project for discovering local events in a rich, interactive way. The project is structured in incremental stages: starting from HTML/CSS, then adding Canvas visuals, audio, and video as the project progresses.

---

## 🧭 Project Overview

- A simple, user-friendly interface to explore local events  
- Designed to grow in complexity over four stages:  
  1. **HTML & CSS** – structure and layout  
  2. **Canvas API** – dynamic graphics and animations  
  3. **Audio API** – music, sound effects, or event audio  
  4. **Video API** – embedded / interactive video content  
- Built with maintainability and expandability in mind: clean structure, modular JS / assets


---

## 🟦 Stage 1 – HTML & CSS (Structure and Styling)

**Goal:** Build a clean, responsive website layout.

### What was implemented
- Semantic HTML structure (`header`, `main`, `section`, `footer`)
- Navigation menu with anchor links
- Event list section dynamically populated with JavaScript
- Responsive layout using Flexbox and CSS Grid
- Modern UI design:
  - Cards with shadows and hover effects
  - Gradients and animations
  - Google Fonts (Nunito Sans)

### Files involved
- `index.html`
- `styles.css`

---

## 🟩 Stage 2 – Canvas API (Graphics & Animation)

**Goal:** Use the HTML5 Canvas API for dynamic data visualization.

### What was implemented
- Animated **bar chart** showing number of events per category
- Bars animate smoothly on page load
- Hover interaction displays category values
- Custom colors for each category
- Entire visualization drawn and animated using Canvas

### Files involved
- `script.js`

---

## 🟨 Stage 3 – Audio API (Sound Integration)

**Goal:** Add interactive audio previews using the Audio API.

### What was implemented
- Audio preview for each event
- Custom audio controls (Play / Pause / Stop)
- Single global `AudioController` to prevent multiple audio tracks playing at once
- Audio previews available in:
  - Event cards
  - Map popups
- Graceful handling of browser autoplay restrictions

### Files involved
- `scripts/audio.js`
- `scripts/events.js`
- `script.js`
- `scripts/map.js`

---

## 🟥 Stage 4 – Video API (Video Integration)

**Goal:** Integrate video content using the HTML5 Video API.

### What was implemented
- Featured video section highlighting a Tech Workshop
- `<video>` element with:
  - Native controls
  - Poster image
  - Responsive layout
- Styled as a highlighted multimedia preview section

### Files involved
- `index.html`
- `styles.css`

---

## 🗺 Interactive Map (Leaflet Integration)

Although not a required multimedia stage, the map significantly improves usability.

### Features
- Interactive Leaflet map using OpenStreetMap tiles
- Event markers with custom styling
- Popups include:
  - Event information
  - Image thumbnail
  - Audio playback controls
- User location features:
  - Search events by city name
  - Use browser geolocation
- Automatic zoom to show all event locations

### Files involved
- `scripts/map.js`

---

## 🧠 JavaScript Architecture

- Modular JavaScript files for clarity and maintainability
- Event-driven architecture
- Centralized audio management via `AudioController`
- Custom events (`user-location`) used for communication between modules

---

## 🚀 Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Canvas API
- Audio API
- Video API
- Leaflet.js
- OpenStreetMap
- Browser Geolocation API

---

## 👥 Authors

**Antonia & Cristian**  
Multimedia Web Project – 2025

---

## ✅ Conclusion

EventsHUB demonstrates a progressive multimedia web development workflow, starting from a static layout and evolving into a fully interactive, audio-visual application. Each development stage builds upon the previous one, resulting in a cohesive and engaging user experience.
