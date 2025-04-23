import React from "react";
import "./App.css"; // o el archivo donde pegues el CSS

const LetsConnect = () => {
  return (
    <div className="connect-section">
      <h2>Let's Connect! 🤝</h2>
      <p>
        Wanna say hi, collaborate on something cool, or just vibe over tech & creativity? ✨💬
      </p>
      <p>
        Find me on{" "}
        <a
          href="https://www.linkedin.com/in/brendagodoy-/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn 💼
        </a>{" "}
        — I'd love to connect!
      </p>
	  <img
		src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXB4ZmsxanRnNjYzNTJxczg4Zjg0cW53ODhmenQ4ZGlna2c3azR3MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/SwImQhtiNA7io/giphy.gif"
		alt="Let's connect meme"
		style={{ marginTop: "30px", maxWidth: "300px", borderRadius: "16px" }}
	  />
    </div>
  );
};

export default LetsConnect;
