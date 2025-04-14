from flask import Flask, jsonify, request
from PIL import Image
from torchvision import transforms
from neural_networks import NumbersNetwork, EmotionsNetwork
import torch
import cv2
import numpy as np

app = Flask(__name__) # creo la aplicacion web, siempre se usa '__name__'. 'Este es el archivo principal que corre la app'

model_number = NumbersNetwork()
model_number.load_state_dict(torch.load('model_number.pth', map_location=torch.device('cpu')))
model_number.eval()

model_emotions = EmotionsNetwork()
model_emotions.load_state_dict(torch.load('model_emotions.pth', map_location=torch.device('cpu')))
model_emotions.eval()

emotion_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.Resize((48, 48)),
    transforms.ToTensor()
])

@app.route("/detect_number", methods=["POST"]) # decorador, cuando alguien entra a la ruta '/' ejecuta la funcion de abajo.
def detect_number():
    file = request.files.get("image")
    
    if not file:
        return jsonify({"error": "No image uploaded"}), 400
    
    image = Image.open(file.stream)
    image_transformed = transforms.ToTensor()(image).unsqueeze(0)
    with torch.no_grad():
        logits = model_number(image_transformed)
        detected_number = logits.argmax(1).item()
    
    return jsonify({"prediction": detected_number})

@app.route("/detect_emotion", methods=["POST"])
def detect_emotion():
    file = request.files.get("image")
    
    if not file:
        return jsonify({"error": "No image uploaded"}), 400
    
    image = Image.open(file.stream).convert("RGB")
    image_np = np.array(image) # convertir en formato compatible con OpenCV
    image_cv2 = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(image_cv2, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    
    if len(faces) == 0:
        return jsonify({"error": "No face detected"}), 400
    
    (x, y, w, h) = faces[0]
    face_roi = image.crop((x, y, x+w, y+h))
    image_transformed = emotion_transform(face_roi).unsqueeze(0)
    
    #image_transformed = emotion_transform(image).unsqueeze(0)
    with torch.no_grad():
        logits = model_emotions(image_transformed)
        detected_emotion = logits.argmax(1).item()
    
    emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
    detected_emotion_label = emotion_labels[detected_emotion]
    
    return jsonify({"prediction": detected_emotion_label})

if __name__ == "__main__": # solo corre este bloque si estoy ejecutando directamente este archivo.
    app.run(debug=True) # muestra errores detallados, y recarga automáticamente cuando guardo cambios