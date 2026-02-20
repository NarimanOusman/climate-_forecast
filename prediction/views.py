import joblib
import pandas as pd
from django.shortcuts import render, redirect
from .forms import PredictionForm
from .models import PredictionReport
import os
from django.conf import settings

# Lazy loading variables
model = None
encoder = None

def get_model_and_encoder():
    """Lazily load the model and encoder."""
    global model, encoder
    
    if model is None:
        try:
            MODEL_PATH = os.path.join(settings.BASE_DIR, 'crop_recommendation_pipeline.pkl')
            model = joblib.load(MODEL_PATH, mmap_mode='r')
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
            model = None

    if encoder is None:
        try:
            ENCODER_PATH = os.path.join(settings.BASE_DIR, 'crop_label_encoder.pkl')
            encoder = joblib.load(ENCODER_PATH, mmap_mode='r')
            print("Encoder loaded successfully.")
        except Exception as e:
            print(f"Error loading encoder: {e}")
            encoder = None
            
    return model, encoder

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
            
            # Ensure model is loaded
            model, encoder = get_model_and_encoder()
            
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

def landing_page(request):
    return render(request, 'prediction/index.html')
