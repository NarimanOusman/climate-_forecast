import os
import sys
import django
from django.conf import settings

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crop_project.settings')
django.setup()

from prediction import views

print(f"Initial model state: {views.model}")
print(f"Initial encoder state: {views.encoder}")

if views.model is not None or views.encoder is not None:
    print("FAIL: Model or encoder loaded eagerly!")
    sys.exit(1)

print("Calling get_model_and_encoder()...")
model, encoder = views.get_model_and_encoder()

if model is None or encoder is None:
    print("FAIL: Model or encoder failed to load!")
    sys.exit(1)

print("SUCCESS: Model and encoder loaded lazily.")
