import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const ExpressionTracker = () => {
  const webcamRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [expression, setExpression] = useState("Neutral");

  // Load the MediaPipe Face Landmarker model
  useEffect(() => {
    const initializeFaceLandmarker = async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU", // Use GPU for better real-time performance
        },
        outputFaceBlendshapes: true, // MUST be true to get expressions
        runningMode: "VIDEO", // Process a continuous video stream
        numFaces: 1,
      });

      setFaceLandmarker(landmarker);
    };

    initializeFaceLandmarker();
  }, []);

  // Process the video frames for expressions
  useEffect(() => {
    let animationFrameId;

    const detectExpression = async () => {  
      
      if (
        faceLandmarker &&
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4 // Video is ready
      ) {
        const video = webcamRef.current.video;
        const startTimeMs = performance.now();

        // Get predictions from MediaPipe
        const results = faceLandmarker.detectForVideo(video, startTimeMs);

        if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
          const blendshapes = results.faceBlendshapes[0].categories;
          
          // Helper to find a specific muscle movement's score (0.0 to 1.0)
          const getScore = (name) => 
            blendshapes.find((shape) => shape.categoryName === name)?.score || 0;

          const smileScore = (getScore("mouthSmileLeft") + getScore("mouthSmileRight")) / 2;
          const jawOpenScore = getScore("jawOpen");
          const blinkScore = (getScore("eyeBlinkLeft") + getScore("eyeBlinkRight")) / 2;

          // Simple logic to map scores to strings
          if (smileScore > 0.5) {
            setExpression("Smiling 😄");
          } else if (jawOpenScore > 0.4) {
            setExpression("Surprised / Mouth Open 😲");
          } else if (blinkScore > 0.4) {
            setExpression("Blinking 😑");
          }
          else {
            setExpression("Neutral 😐");
          }
        }
      }
      
      // Loop the detection tied to browser frame rate
      animationFrameId = requestAnimationFrame(detectExpression);
    };

    detectExpression();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [faceLandmarker]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>Current Expression: {expression}</h2>
      
      {!faceLandmarker ? (
        <p>Loading AI Model...</p>
      ) : (
        <Webcam
          ref={webcamRef}
          audio={false}
          width={640}
          height={480}
          style={{ borderRadius: "8px", border: "2px solid #ccc" }}
        />
      )}
    </div>
  );
};

export default ExpressionTracker;