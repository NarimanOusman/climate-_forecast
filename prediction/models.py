from django.db import models
from django.utils import timezone

# Create your models here.
class PredictionReport(models.Model):
    nitrogen = models.FloatField()
    phosphorus = models.FloatField()
    potassium = models.FloatField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    ph = models.FloatField()
    rainfall = models.FloatField()
    predicted_crop = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.predicted_crop} ({self.created_at.date()})"
