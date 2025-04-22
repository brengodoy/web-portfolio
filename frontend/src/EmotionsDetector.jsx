import './App.css';
import { useEffect, useRef, useState } from 'react';
import axios from "axios";

function EmotionsDetector() {
	const videoRef = useRef(null);
	const streamRef = useRef(null);
	const [cameraActive, setCameraActive] = useState(false);
	const canvasRef = useRef(null);
	const [detecting, setDetecting] = useState(false);
	const [error, setError] = useState(null);
  
	useEffect(() => {
	  if (cameraActive) {
		navigator.mediaDevices.getUserMedia({ video: true })
		  .then((stream) => {
			streamRef.current = stream;
			if (videoRef.current) {
			  videoRef.current.srcObject = stream;
			  videoRef.current.play();
			}
		  })
		  .catch((err) => {
			console.error("Error accessing camera:", err);
		  });
	  } else {
		if (streamRef.current) {
		  streamRef.current.getTracks().forEach(track => track.stop());
		  streamRef.current = null;
		}
  
		if (videoRef.current) {
		  videoRef.current.srcObject = null;
		}
	  }
	}, [cameraActive]);
	
	useEffect(() => {
		let interval;
	  
		if (detecting) {
		  interval = setInterval(() => {
			captureFrameAndDetect();
		  }, 1000); // cada 1 segundo
		}
	  
		return () => clearInterval(interval);
	  }, [detecting]);

	const captureFrameAndDetect = async () => {
	if (!videoRef.current || !canvasRef.current) return;

	const canvas = document.createElement("canvas");
	canvas.width = videoRef.current.videoWidth;
	canvas.height = videoRef.current.videoHeight;

	const ctx = canvas.getContext("2d");
	ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

	const blob = await new Promise((resolve) =>
		canvas.toBlob(resolve, "image/jpeg")
	);
	if (!blob) {
		return;
	}

	const formData = new FormData();
	formData.append("image", blob, "frame.jpg");

	try {
		const response = await axios.post("http://localhost:5000/detect_emotion", formData);
		const emotion = response.data.prediction;

		drawOnCanvas(emotion);
		setError(null);
	} catch (err) {
		console.error("Error en la request ❌", err);
		setError("😕 No face detected");
		clearCanvas();
	}
	};
	
	const drawOnCanvas = (emotion) => {
	const canvas = canvasRef.current;
	const ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const boxWidth = 200;
	const boxHeight = 200;
	const x = canvas.width / 2 - boxWidth / 2;
	const y = canvas.height / 2 - boxHeight / 2;

	// Recuadro
	ctx.strokeStyle = "#00FF00";
	ctx.lineWidth = 3;
	ctx.strokeRect(x, y, boxWidth, boxHeight);

	// Texto
	ctx.font = "20px Arial";
	ctx.fillStyle = "#00FF00";
	ctx.fillText(emotion, x, y - 10);
	};
	
	const clearCanvas = () => {
	const canvas = canvasRef.current;
	if (!canvas) return;
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

  return (
    <section className="emotion-detector">
      <h2>What are you feeling?🧠❤️</h2>
      <p>
	  This model analyzes facial expressions to predict the emotion behind them.
	  (Upload a photo or) use your webcam, and the model will tell you what emotion it detects.
	  <br />
	  😄 Trained on a dataset with 7 emotions: angry, disgust, fear, happy, sad, surprise, and neutral.
	  </p>
	  
	  <div className="camera-container">
	  <button
          onClick={() => {
            setCameraActive(!cameraActive);
            setDetecting(!cameraActive); // empieza a detectar al activar cámara
            clearCanvas();
          }}
        >
          {cameraActive ? "Turn Off Camera" : "Activate Camera"}
        </button>

        {cameraActive && (
			<div className="relative w-fit">
          <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              width={640}
              height={480}
              className="rounded-xl"
            />
		  <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 pointer-events-none"
              width={640}
              height={480}
            />
      	</div>
		)}
	  </div>

	  {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <div className="github-note">
        <p>🔗 Curious about how it works?</p>
        <p>👉 Check out the code on <a href="https://github.com/brengodoy" target="_blank" rel="noopener noreferrer">GitHub</a></p>
		<p>⚠️ This tool is for educational purposes only and may not always be accurate.</p>
	  </div>
    </section>
  );
}

export default EmotionsDetector;