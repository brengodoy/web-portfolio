import './App.css';

function NumberDetector() {
  return (
    <section className="number-detector">
      <h2>Try My Number Detector!</h2>
      <p>
        This tool was built using a neural network trained on handwritten digits. Just draw a number from 0 to 9 in the box below, and the model will try to guess what it is! <br />
        🧼 You can clear the canvas anytime and try as many times as you like.
      </p>

      <div className="canvas-wrapper">
        <p className="prediction-title">Model predicts:</p>
        <hr />
        <canvas id="drawing-canvas" width="280" height="280"></canvas>
        <button className="clear-button">Clear</button>
      </div>

      <div className="github-note">
        <p>🔗 Curious about how it works?</p>
        <p>👉 Check out the code on <a href="https://github.com/brengodoy" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </div>
    </section>
  );
}

export default NumberDetector;
