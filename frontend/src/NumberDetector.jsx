import './App.css';
import React, { useRef, useState, useEffect } from 'react';

function NumberDetector() { //Todo lo que está dentro de esta función es lo que se va a ver y lo que va a pasar cuando se use.
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false); // saber si la persona esta dibujando o no
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  let timeoutId;

  const handleMouseMove = (e) => {
    if (!drawing) return;
    draw(e);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      sendImageToBackend(canvasRef.current);
    }, 100); // Delay para no saturar
  };

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
    ctx.lineWidth = 10;
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
    setPrediction(null);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        //console.log("Predicción:", data.prediction);
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
          onMouseMove={handleMouseMove}
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