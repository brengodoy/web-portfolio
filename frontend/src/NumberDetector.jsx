import './App.css';
import React, { useRef, useState, useEffect } from 'react';

function NumberDetector() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  let timeoutId;

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      };
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleMove = (e) => {
    draw(e);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      sendImageToBackend(canvasRef.current);
    }, 100);
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setPrediction(null);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setDrawing(false);
  };

  function sendImageToBackend(canvas) {
    const dataURL = canvas.toDataURL("image/png");
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });

    const formData = new FormData();
    formData.append("image", blob, "drawing.png");

    fetch("http://localhost:5000/detect_number", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setPrediction(data.prediction);
      })
      .catch((error) => {
        console.error("Error al enviar imagen al backend:", error);
      });
  }

  return (
    <section className="number-detector">
      <h2>Try My Number Detector!</h2>
      <p>
        This tool was built using a neural network trained on handwritten digits. Just draw a number from 0 to 9 in the box below, and the model will try to guess what it is! <br />
        🧼 You can clear the canvas anytime and try as many times as you like.
      </p>

      <div className="canvas-container">
        <p className="prediction-title">Model predicts: {prediction !== null ? prediction : ""}</p>
        <hr className="divider" />
        <canvas
          ref={canvasRef}
          className="drawing-canvas"
          width={280}
          height={280}
          onMouseDown={startDrawing}
          onMouseMove={handleMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={handleMove}
          onTouchEnd={() => {
            stopDrawing();
            sendImageToBackend(canvasRef.current);
          }}
          style={{ touchAction: "none" }}
        />
        <button className="clear-btn" onClick={clearCanvas}>Clear</button>
      </div>

      <div className="github-note">
        <p>🔗 Curious about how it works?</p>
        <p>👉 Check out the code on <a href="https://github.com/brengodoy" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </div>
    </section>
  );
}

export default NumberDetector;