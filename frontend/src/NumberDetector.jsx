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
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  

  const getCanvasImage = () => {
    const canvas = canvasRef.current;
  
    // canvas temporal para invertir colores y escalar
    const tempCanvas = document.createElement("canvas");
    const size = 28;
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext("2d");
  
    // copiamos el contenido del canvas original en el canva temporal
    tempCtx.drawImage(canvas, 0, 0, size, size);
  
    // los píxeles del mini canvas (28x28) se guardan en una estructura tipo array que se llama ImageData
    const imageData = tempCtx.getImageData(0, 0, size, size);

    // edité todos los píxeles y estan guardados en imageData, los pego de nuevo en el canvas
    tempCtx.putImageData(imageData, 0, 0);
  
    // Lo exportamos como imagen PNG en base64
    return tempCanvas.toDataURL("image/png");
  };
  
  const sendImageToBackend = async (imageDataUrl) => {
    const blob = await (await fetch(imageDataUrl)).blob(); // convertimos el base64 en blob
  
    const formData = new FormData();
    formData.append("image", blob, "drawing.png");
  
    try {
      const response = await fetch("http://localhost:5000/detect_number", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      setPrediction(data.prediction);
      console.log("Predicción:", data.prediction);
    } catch (error) {
      console.error("Error al enviar imagen al backend:", error);
    }
  };
  

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
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <button className="clear-btn" onClick={clearCanvas}>Clear</button>
        <button onClick={() => {
          const image = getCanvasImage();
          console.log(image); // para ver si funciona
          sendImageToBackend(image);
        }}>Obtener imagen</button>
      </div>

      <div className="github-note">
        <p>🔗 Curious about how it works?</p>
        <p>👉 Check out the code on <a href="https://github.com/brengodoy" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </div>
    </section>
  );
}

export default NumberDetector;