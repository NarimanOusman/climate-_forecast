from django import forms
from .models import PredictionReport

class PredictionForm(forms.ModelForm):
    class Meta:
        model = PredictionReport
        fields = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall', 'created_at']
        widgets = {
            'nitrogen': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Nitrogen (N)'}),
            'phosphorus': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Phosphorus (P)'}),
            'potassium': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Potassium (K)'}),
            'temperature': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Temperature (°C)'}),
            'humidity': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Humidity (%)'}),
            'ph': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Soil pH'}),
            'rainfall': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Rainfall (mm)'}),
            'created_at': forms.DateTimeInput(
                attrs={'class': 'form-control', 'type': 'datetime-local'},
                format='%Y-%m-%dT%H:%M'
            ),
        }
        labels = {
            'created_at': 'Prediction Date'
        }
