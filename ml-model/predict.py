"""
Inference script to use trained model for predictions
Can be called from Node.js backend
"""

import pickle
import json
import sys
import numpy as np

def load_model():
    """Load trained model and encoder"""
    try:
        with open('models/mood_predictor.pkl', 'rb') as f:
            model = pickle.load(f)
        with open('models/label_encoder.pkl', 'rb') as f:
            encoder = pickle.load(f)
        return model, encoder
    except FileNotFoundError:
        print("Error: Model files not found. Please train the model first.", file=sys.stderr)
        sys.exit(1)

def predict_mood(features_dict):
    """
    Predict mood based on input features
    
    Args:
        features_dict: Dictionary with keys:
            - mood_today, avg_mood_last_3_days, sleep_hours, sleep_quality,
            - exercise_minutes, stress_level, screen_time,
            - social_interaction_minutes, water_intake_liters,
            - productivity_level, anxiety_level
    
    Returns:
        Dictionary with prediction and probabilities
    """
    model, encoder = load_model()
    
    feature_order = [
        'mood_today', 'avg_mood_last_3_days', 'sleep_hours', 'sleep_quality',
        'exercise_minutes', 'stress_level', 'screen_time',
        'social_interaction_minutes', 'water_intake_liters',
        'productivity_level', 'anxiety_level'
    ]
    
    # Extract features in correct order
    features = np.array([[features_dict[f] for f in feature_order]])
    
    # Make prediction
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]
    
    # Decode prediction
    mood_label = encoder.inverse_transform([prediction])[0]
    
    # Create result
    result = {
        'predicted_mood': mood_label,
        'confidence': float(max(probabilities)),
        'probabilities': {
            label: float(prob)
            for label, prob in zip(encoder.classes_, probabilities)
        }
    }
    
    return result

if __name__ == '__main__':
    if len(sys.argv) > 1:
        try:
            features_json = sys.argv[1]
            features = json.loads(features_json)
            result = predict_mood(features)
            print(json.dumps(result))
        except Exception as e:
            print(json.dumps({'error': str(e)}), file=sys.stderr)
            sys.exit(1)
    else:
        print("Usage: python predict.py '<json_features>'")
        print("Example: python predict.py '{\"mood_today\": 7, ...}'")
