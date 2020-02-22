import { nets, createCanvasFromMedia } from "face-api.js";

import "../css/styles.css";

const video = document.getElementById("video");
const loading = document.getElementById("loading");

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
