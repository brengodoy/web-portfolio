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

	  return () => {
		if (streamRef.current) {
		  streamRef.current.getTracks().forEach(track => track.stop());
		}
	  };

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
		const { prediction: emotion, face } = response.data;
		drawOnCanvas(emotion, face);
		setError(null);
	} catch (err) {
		console.error("Error en la request ❌", err);
		setError("😕 No face detected");
		clearCanvas();
	}
	};
	
	const drawOnCanvas = (emotion, face) => {
		const canvas = canvasRef.current;
		const ctx = canvasRef.current.getContext("2d");
		const video = videoRef.current;
		canvas.width = video.offsetWidth;
		canvas.height = video.offsetHeight;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	  
		if (!face) return;
	  
		const { x, y, w, h } = face;
	  
		const scaleX = canvas.width / video.videoWidth;
  		const scaleY = canvas.height / video.videoHeight;
		const adjustedX = x * scaleX;
		const adjustedY = y * scaleY;
		const adjustedW = w * scaleX;
		const adjustedH = h * scaleY;

		// Dibujo del rectángulo
		ctx.strokeStyle = "#00FF00";
		ctx.lineWidth = 3;
		ctx.strokeRect(adjustedX, adjustedY, adjustedW, adjustedH);
		//ctx.strokeRect(x, y, w, h);
	  
		// Texto de la emoción
		ctx.font = "16px Arial"; // 👈 Esto primero
		const textWidth = ctx.measureText(emotion).width;

		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		ctx.fillRect(adjustedX, adjustedY - 30, textWidth + 20, 25); // +20 es el padding horizontal

		ctx.fillStyle = "#fff";
		ctx.fillText(emotion, adjustedX + 10, adjustedY - 12); // +10 para centrar el texto dentro del rectángulo
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
	  Use your webcam, and the model will tell you what emotion it detects.
	  <br />
	  😄 Trained on a dataset with 7 emotions: angry, disgust, fear, happy, sad, surprise, and neutral.
	  </p>
	  
	  <div className="camera-container">
	  <button
          onClick={() => {
            setCameraActive(!cameraActive);
            setDetecting(!cameraActive); // empieza a detectar al activar cámara
            clearCanvas();
			setError("");
          }}
        >
          {cameraActive ? "Turn Off Camera" : "Activate Camera"}
        </button>

        {cameraActive && (
			<div className="video-wrapper">
          <div className="video-container">
          <video
			ref={videoRef}
			autoPlay
			muted
			playsInline
			className="video-feed"
		  />
		  <canvas
			ref={canvasRef}
			className="emotion-overlay"
		  />
      	</div>
		</div>
		)}
	  </div>

	  {error && <p className="error-message">{error}</p>}


      <div className="github-note">
        <p>🔗 Curious about how it works?</p>
        <p>👉 Check out the code on <a href="https://github.com/brengodoy" target="_blank" rel="noopener noreferrer">GitHub</a></p>
		<p>⚠️ This tool is for educational purposes only and may not always be accurate.</p>
	  </div>
    </section>
  );
}

export default EmotionsDetector;