import joblib
import pandas as pd
from django.shortcuts import render, redirect
from .forms import PredictionForm
from .models import PredictionReport
import os
from django.conf import settings

# Load model and encoder (global scope to load once)
MODEL_PATH = os.path.join(settings.BASE_DIR, 'crop_recommendation_pipeline.pkl')
ENCODER_PATH = os.path.join(settings.BASE_DIR, 'crop_label_encoder.pkl')

try:
    model = joblib.load(MODEL_PATH)
    # Check if encoded needs to be loaded separately or if pipeline handles it.
    # Based on app.py, label encoder was used to inverse transform.
    # But pipeline usually includes preprocessing. 
    # Let's assume we need the encoder for the target label if the model outputs numbers.
    # app.py: crop_name = le.inverse_transform(prediction)[0]
    encoder = joblib.load(ENCODER_PATH)
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    encoder = None

def predict_crop(request):
    prediction = None
    if request.method == 'POST':
        form = PredictionForm(request.POST)
        if form.is_valid():
            # Get data
            data = form.cleaned_data
            input_features = [[
                data['nitrogen'],
                data['phosphorus'],
                data['potassium'],
                data['temperature'],
                data['humidity'],
                data['ph'],
                data['rainfall']
            ]]
            
            if model and encoder:
                # Predict
                pred = model.predict(input_features)
                predicted_crop_name = encoder.inverse_transform(pred)[0]
                
                # Save report
                report = form.save(commit=False)
                report.predicted_crop = predicted_crop_name
                report.save()
                
                prediction = predicted_crop_name
    else:
        form = PredictionForm()

    return render(request, 'prediction/predict.html', {'form': form, 'prediction': prediction})

def report_list(request):
    reports = PredictionReport.objects.order_by('-created_at')
    return render(request, 'prediction/reports.html', {'reports': reports})
