import {
  nets,
  createCanvasFromMedia,
  matchDimensions,
  detectAllFaces,
  TinyFaceDetectorOptions,
  resizeResults,
  draw,
  utils
} from "face-api.js";

import "../css/styles.css";

const video = document.getElementById("video");
const loading = document.getElementById("loading");
let predictedAges = [];

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

function interpolateAgePredictions(age) {
  predictedAges = [age].concat(predictedAges).slice(0, 30);
  const avgPredictedAge = predictedAges.reduce(
    (avg, age) => (avg + age) / predictedAges.length
  );
  return avgPredictedAge;
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
        .withFaceExpressions()
        .withAgeAndGender();
      const resizedDetections = resizeResults(detections, displaySize);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      draw.drawDetections(canvas, resizedDetections);
      draw.drawFaceLandmarks(canvas, resizedDetections);
      draw.drawFaceExpressions(canvas, resizedDetections);

      if (resizedDetections[0]) {
        const age = resizedDetections[0].age;
        const interpolatedAge = interpolateAgePredictions(age);
        const bottomRight = {
          x: resizedDetections[0].detection.box.bottomRight.x,
          y: resizedDetections[0].detection.box.bottomRight.y
        };

        new draw.DrawTextField(
          [`${utils.round(interpolatedAge, 0)} years`],
          bottomRight
        ).draw(canvas);
      }
    } catch (error) {
      console.log(error);
    }
  }, 100);
}

(async function() {
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
