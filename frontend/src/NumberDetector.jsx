import './App.css';
import React, { useRef, useEffect, useState } from 'react';

function NumberDetector() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <section className="number-detector">
      <h2>Try My Number Detector!</h2>
      <p>
        This tool was built using a neural network trained on handwritten digits. Just draw a number from 0 to 9 in the box below, and the model will try to guess what it is! <br />
        🧼 You can clear the canvas anytime and try as many times as you like.
      </p>

      <div className="canvas-container">
        <p className="prediction-title">Model predicts:</p>
        <hr className="divider" />
        <canvas
          ref={canvasRef}
          className="drawing-canvas"
          width={280}
          height={280}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
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
