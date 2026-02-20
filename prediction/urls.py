from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing_page, name='landing_page'),
    path('predict/', views.predict_crop, name='predict_crop'),
    path('reports/', views.report_list, name='report_list'),
]
