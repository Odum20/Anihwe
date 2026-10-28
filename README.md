# Vizzy – Computer Vision Intelligence Platform

![Vizzy Logo](https://res.cloudinary.com/dukipuswv/image/upload/f_webp,q_auto,w_240/v1793198289/vizzy_tqgjgz.png)

> **Vizzy** is a state-of-the-art Computer Vision & Safety Analytics platform powered by **YOLO26** deep object detection, **BoT-SORT** multi-object tracking, and **OpenRouter LLM/Vision** intelligence bridges. Designed for real-time traffic monitoring, spatial hazard telemetry, and interactive computer vision prompts.

---

## 🌟 Key Features

- **Video Detection HUD**: Real-time MP4 video pixel stream analyzer with automated vehicle detection, class breakdown, sub-integer velocity vectors (km/h), and safety zone infraction telemetry.
- **Dynamic Safety Zones**: Configure polygon and bounding safety zones visually on video frames with real-time breach detection.
- **Universal Vision Playground**: Prompt-driven computer vision directives bridged via OpenRouter API. Upload video media alongside custom prompts (*e.g., "count my cattle", "detect people in the aisle"*) with real-time cognitive reasoning and dynamic input validation.
- **OpenRouter Live Infrastructure Bridge**: Integrated live infrastructure log stream with optional OpenRouter key fallback for vision-to-text telemetry.
- **Python Script Hub**: Export production-ready Python tracking scripts (`yolo_botsort_tracker.py`) utilizing `ultralytics`, `opencv-python`, and `numpy`.
- **Skeuomorphic & Light/Dark Theme Switcher**: Modern slate white interface with golden-yellow accents and seamless dark charcoal slate mode toggle.
- **Responsive Mobile Side Panel**: Seamless poking-chevron mobile drawer for fluid navigation across mobile and desktop displays.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/vizzy-vision-intelligence.git
   cd vizzy-vision-intelligence
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

---

## 💻 Standalone Python Tracker (`yolo_botsort_tracker.py`)

Run vision analytics on any local MP4 or camera stream using Python:

```bash
# Install Python dependencies
pip install ultralytics opencv-python numpy requests

# Execute tracker
python yolo_botsort_tracker.py --source traffic_feed.mp4
```

---

## 👨‍💻 Founder & Author

Created and developed by **Odum Kwesi Atopi**, Final Year Environmental Science Student at Kwame Nkrumah University of Science and Technology (**KNUST**), alumnus of Ghana Secondary Technical School (GSTS).

- 🌐 **Portfolio & Catalog**: [https://www.odum.dev](https://www.odum.dev)
- 💼 **LinkedIn**: [Kwesi Atopi Odum](https://www.linkedin.com/in/kwesi-atopi-odum-a70a21366)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
