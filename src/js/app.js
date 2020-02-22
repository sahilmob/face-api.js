import {
  nets,
  createCanvasFromMedia,
  matchDimensions,
  detectAllFaces,
  TinyFaceDetectorOptions,
  resizeResults,
  draw
} from "face-api.js";

import "../css/styles.css";

const video = document.getElementById("video");
const loading = document.getElementById("loading");

video.addEventListener("playing", videoPlayingHandler);

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    loading.classList.add("hidden");
    video.classList.remove("hidden");
  } catch (error) {
    console.log(error);
  }
}

function videoPlayingHandler() {
  const displaySize = { width: video.width, height: video.height };
  const canvas = createCanvasFromMedia(video);

  document.body.append(canvas);

  matchDimensions(canvas, displaySize);

  setInterval(async function() {
    try {
      const detections = await detectAllFaces(
        video,
        new TinyFaceDetectorOptions()
      )
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = resizeResults(detections, displaySize);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      draw.drawDetections(canvas, resizedDetections);
      draw.drawFaceLandmarks(canvas, resizedDetections);
      draw.drawFaceExpressions(canvas, resizedDetections);
    } catch (error) {
      console.log(error);
    }
  }, 100);
}

(async function mian() {
  try {
    await Promise.all([
      nets.tinyFaceDetector.loadFromUri("../models"),
      nets.faceLandmark68Net.loadFromUri("../models"),
      nets.faceRecognitionNet.loadFromUri("../models"),
      nets.faceExpressionNet.loadFromUri("../models"),
      nets.ageGenderNet.loadFromUri("../models")
    ]);
    startVideo();
  } catch (error) {
    console.log(error);
  }
})();
