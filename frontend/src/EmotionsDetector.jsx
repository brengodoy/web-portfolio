import './App.css';
import { useEffect, useRef, useState } from 'react';

function EmotionsDetector() {
	const videoRef = useRef(null);
	const streamRef = useRef(null); // ✨ Agregado para guardar el stream
	const [cameraActive, setCameraActive] = useState(false);
  
	useEffect(() => {
	  if (cameraActive) {
		navigator.mediaDevices.getUserMedia({ video: true })
		  .then((stream) => {
			streamRef.current = stream; // ✨ Guardamos el stream
			if (videoRef.current) {
			  videoRef.current.srcObject = stream;
			  videoRef.current.play();
			}
		  })
		  .catch((err) => {
			console.error("Error accessing camera:", err);
		  });
	  } else {
		// ✨ Apagamos todos los tracks del stream para liberar la cámara
		if (streamRef.current) {
		  streamRef.current.getTracks().forEach(track => track.stop());
		  streamRef.current = null;
		}
  
		if (videoRef.current) {
		  videoRef.current.srcObject = null;
		}
	  }
	}, [cameraActive]);
	

  return (
    <section className="emotion-detector">
      <h2>What are you feeling?🧠❤️</h2>
      <p>
	  This model analyzes facial expressions to predict the emotion behind them.
	  (Upload a photo or) use your webcam, and the model will tell you what emotion it detects.<br />
	  😄 Trained on a dataset with 7 emotions: angry, disgust, fear, happy, sad, surprise, and neutral.</p>
	  
	  <div className="camera-container">
        <button onClick={() => setCameraActive(!cameraActive)}>
          {cameraActive ? "Turn Off Camera" : "Activate Camera"}
        </button>
        {cameraActive && (
          <video ref={videoRef} width="100%" autoPlay muted playsInline />
        )}
      </div>

      <div className="github-note">
        <p>🔗 Curious about how it works?</p>
        <p>👉 Check out the code on <a href="https://github.com/brengodoy" target="_blank" rel="noopener noreferrer">GitHub</a></p>
		<p>⚠️ This tool is for educational purposes only and may not always be accurate.</p>
	  </div>
    </section>
  );
}

export default EmotionsDetector;