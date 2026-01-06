import torch
from transformers import pipeline

class ImageDeepfakeModel:
    def __init__(self):
        device = 0 if torch.cuda.is_available() else -1

        self.detector = pipeline(
            task="image-classification",
            model="prithivMLmods/Deep-Fake-Detector-v2-Model",
            device=device
        )

    def predict(self, image_path: str):
        results = self.detector(image_path)

        top = results[0]
        label = top["label"].lower()
        confidence = float(top["score"])

        return label, confidence
