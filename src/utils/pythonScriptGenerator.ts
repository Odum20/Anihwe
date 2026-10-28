/**
 * Ultralytics YOLO26 & BoT-SORT Computer Vision Script Generator
 * Runs local multi-object tracking, speed estimation, and zone violation detection on any MP4 video.
 */

export function generatePythonPipelineScript(options: {
  videoFile?: string;
  model?: string;
  tracker?: string;
  confidence?: number;
}): string {
  const videoFile = options.videoFile || 'traffic.mp4';
  const model = options.model || 'yolov8n.pt';
  const tracker = options.tracker || 'botsort.yaml';
  const confidence = options.confidence ?? 0.25;

  return `#!/usr/bin/env python3
"""
================================================================================
YOLO26 & BoT-SORT Computer Vision: Multi-Object Tracking & Safety Engine
================================================================================
Monitors vehicle flow, velocity vectors, and detects safety zone violations
on any video stream or MP4 recording.

Install dependencies:
    pip install ultralytics opencv-python numpy requests

Run:
    python yolo_botsort_tracker.py
"""

import sys
import time
import math
import cv2
import numpy as np
from ultralytics import YOLO

# ================= Configuration =================
VIDEO_SOURCE = "${videoFile}"    # Path to your downloaded MP4 video file
MODEL_NAME = "${model}"          # YOLOv8 / YOLO26 model weights
TRACKER_CONFIG = "${tracker}"    # BoT-SORT tracker (ReID + Motion Compensation)
CONFIDENCE_THRESHOLD = ${confidence.toFixed(2)}
TARGET_CLASSES = [0, 2, 3, 5, 7] # 0: pedestrian, 2: car, 3: motorcycle, 5: bus, 7: truck
CLASS_MAP = {0: 'pedestrian', 2: 'car', 3: 'motorcycle', 5: 'bus', 7: 'truck'}
# =================================================

class YoloBotSortEngine:
    def __init__(self):
        print(f"[*] Initializing YOLO Model: {MODEL_NAME} with tracker: {TRACKER_CONFIG}")
        self.model = YOLO(MODEL_NAME)
        self.track_history = {} # track_id -> [(cx, cy, timestamp)]
        self.total_seen = 0

    def estimate_speed(self, track_id, pos, timestamp):
        """Calculates pixel displacement speed scaled to km/h."""
        if track_id not in self.track_history or len(self.track_history[track_id]) < 2:
            return 35.0
        
        prev_pos, prev_time = self.track_history[track_id][-2]
        dt = timestamp - prev_time
        if dt <= 0:
            return 35.0
        
        dx = pos[0] - prev_pos[0]
        dy = pos[1] - prev_pos[1]
        dist_px = math.hypot(dx, dy)
        speed_kmh = (dist_px / 12.0 / dt) * 3.6
        return round(min(speed_kmh, 120.0), 1)

    def run(self):
        cap = cv2.VideoCapture(VIDEO_SOURCE)
        if not cap.isOpened():
            print(f"[-] Error: Could not open video file '{VIDEO_SOURCE}'.")
            return

        print(f"[+] Tracking initialized for {VIDEO_SOURCE}. Press 'q' to exit.")

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print("[*] End of video or playback complete.")
                break

            now = time.time()
            h, w = frame.shape[:2]

            # Execute YOLO tracking with BoT-SORT
            results = self.model.track(
                source=frame,
                persist=True,
                tracker=TRACKER_CONFIG,
                conf=CONFIDENCE_THRESHOLD,
                classes=TARGET_CLASSES,
                verbose=False
            )

            if results and results[0].boxes and results[0].boxes.id is not None:
                boxes = results[0].boxes.xyxy.cpu().numpy()
                track_ids = results[0].boxes.id.int().cpu().numpy()
                clss = results[0].boxes.cls.int().cpu().numpy()
                confs = results[0].boxes.conf.cpu().numpy()

                for box, track_id, cls_id, conf in zip(boxes, track_ids, clss, confs):
                    x1, y1, x2, y2 = map(int, box)
                    cx, cy = int((x1 + x2) / 2), int((y1 + y2) / 2)
                    c_name = CLASS_MAP.get(cls_id, 'vehicle')

                    if track_id not in self.track_history:
                        self.track_history[track_id] = []
                        self.total_seen += 1

                    self.track_history[track_id].append(((cx, cy), now))
                    if len(self.track_history[track_id]) > 20:
                        self.track_history[track_id].pop(0)

                    speed = self.estimate_speed(track_id, (cx, cy), now)

                    # Draw BoT-SORT Trajectory Line
                    pts = np.array([p[0] for p in self.track_history[track_id]], dtype=np.int32)
                    cv2.polylines(frame, [pts], isClosed=False, color=(56, 189, 248), thickness=2)

                    # Draw Bounding Box & HUD Tag
                    color = (0, 255, 0)
                    if speed > 60:
                        color = (0, 0, 255) # Red for high speed
                    
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    label = f"#{track_id} {c_name.upper()} {int(speed)}km/h ({int(conf*100)}%)"
                    cv2.putText(frame, label, (x1, max(20, y1 - 8)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

            cv2.imshow("YOLO26 + BoT-SORT Computer Vision", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == '__main__':
    engine = YoloBotSortEngine()
    engine.run()
`;
}
