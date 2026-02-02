"""
ML Model Training Script for Mood Prediction
Trains a Random Forest classifier on wellness data
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import pickle
import json
import os

# Load data
data_path = 'data/wellness_data.csv'
df = pd.read_csv(data_path)

print("=" * 50)
print("MOOD PREDICTION MODEL TRAINING")
print("=" * 50)
print(f"\nDataset shape: {df.shape}")
print(f"\nColumns: {df.columns.tolist()}")

# Features and target
feature_columns = [
    'mood_today', 'avg_mood_last_3_days', 'sleep_hours', 'sleep_quality',
    'exercise_minutes', 'stress_level', 'screen_time', 
    'social_interaction_minutes', 'water_intake_liters', 
    'productivity_level', 'anxiety_level'
]

X = df[feature_columns]
y = df['mood_tomorrow_label']

print(f"\nFeatures: {feature_columns}")
print(f"\nTarget variable distribution:")
print(y.value_counts())

# Encode target variable
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

print(f"\nClass mapping: {dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"\nTraining set size: {X_train.shape[0]}")
print(f"Test set size: {X_test.shape[0]}")

# Train Random Forest model
print("\n" + "-" * 50)
print("Training Random Forest Classifier...")
print("-" * 50)

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# Evaluate
y_pred_train = model.predict(X_train)
y_pred_test = model.predict(X_test)

train_accuracy = accuracy_score(y_train, y_pred_train)
test_accuracy = accuracy_score(y_test, y_pred_test)

print(f"\nTraining Accuracy: {train_accuracy:.4f}")
print(f"Test Accuracy: {test_accuracy:.4f}")

print("\n" + "-" * 50)
print("Classification Report (Test Set):")
print("-" * 50)
print(classification_report(y_test, y_pred_test, target_names=label_encoder.classes_))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred_test))

# Feature importance
feature_importance = pd.DataFrame({
    'feature': feature_columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n" + "-" * 50)
print("Feature Importance:")
print("-" * 50)
print(feature_importance.to_string())

# Save model
os.makedirs('models', exist_ok=True)

# Save as pickle
model_path = 'models/mood_predictor.pkl'
with open(model_path, 'wb') as f:
    pickle.dump(model, f)
print(f"\n✓ Model saved to {model_path}")

# Save label encoder
encoder_path = 'models/label_encoder.pkl'
with open(encoder_path, 'wb') as f:
    pickle.dump(label_encoder, f)
print(f"✓ Label encoder saved to {encoder_path}")

# Save model info as JSON
model_info = {
    'model_type': 'RandomForestClassifier',
    'n_estimators': 100,
    'max_depth': 15,
    'train_accuracy': float(train_accuracy),
    'test_accuracy': float(test_accuracy),
    'classes': label_encoder.classes_.tolist(),
    'features': feature_columns,
    'feature_importance': feature_importance.to_dict('records')
}

info_path = 'models/mood_predictor.json'
with open(info_path, 'w') as f:
    json.dump(model_info, f, indent=2)
print(f"✓ Model info saved to {info_path}")

print("\n" + "=" * 50)
print("MODEL TRAINING COMPLETED SUCCESSFULLY!")
print("=" * 50)
