import streamlit as st
import joblib
import numpy as np

# Load model and encoder
@st.cache_resource
def load_model():
    model = joblib.load('crop_recommendation_model.pkl')
    encoder = joblib.load('crop_label_encoder.pkl')
    return model, encoder

model, le = load_model()

# App title and description
st.set_page_config(page_title="🌾 Crop Recommender", layout="centered")
st.title("🌾 Smart Crop Recommendation System")
st.write("Enter soil and climate details to get the best crop recommendation!")

# Input fields (using sliders for better UX)
N = st.slider("Nitrogen (N)", 0, 150, 50)
P = st.slider("Phosphorus (P)", 0, 150, 50)
K = st.slider("Potassium (K)", 0, 200, 50)
temperature = st.slider("Temperature (°C)", 0.0, 50.0, 25.0)
humidity = st.slider("Humidity (%)", 0.0, 100.0, 60.0)
ph = st.slider("Soil pH", 3.5, 10.0, 6.5)
rainfall = st.slider("Rainfall (mm)", 0.0, 300.0, 100.0)

# Prediction button
if st.button("🌱 Recommend Crop"):
    # Prepare input
    features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    
    # Predict
    prediction = model.predict(features)
    crop_name = le.inverse_transform(prediction)[0]
    
    # Display result
    st.success(f"✅ Recommended Crop: **{crop_name}**")
    st.balloons()  # Fun animation!