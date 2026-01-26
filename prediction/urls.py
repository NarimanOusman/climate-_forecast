from django.urls import path
from . import views

urlpatterns = [
    path('', views.predict_crop, name='predict_crop'),
    path('reports/', views.report_list, name='report_list'),
]
