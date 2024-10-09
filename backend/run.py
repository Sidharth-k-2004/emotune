from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import requests
import numpy as np
import cv2
import base64
import json
from keras.models import model_from_json
import os
from pymongo import MongoClient
from bson.objectid import ObjectId  # Import ObjectId for MongoDB
from argon2 import PasswordHasher  # Import Argon2

from dotenv import load_dotenv
import os

load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
MONGO_URI = os.getenv('MONGO_URI')
print(SPOTIFY_CLIENT_ID)
print(SPOTIFY_CLIENT_SECRET)
print(MONGO_URI)
# Spotify API credentials
# SPOTIFY_CLIENT_ID = '4fae7b81aeba4167852828ec05725eb2'
# SPOTIFY_CLIENT_SECRET = 'de4a888c3e274901bd01bc204de7e263'
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Argon2 password hasher
ph = PasswordHasher()

# Connect to MongoDB
# client = MongoClient('mongodb+srv://sidharthkdinesan123:MuiiFKdawTLot40o@kcet-resukts.t7dnjbg.mongodb.net/?retryWrites=true&w=majority&appName=kcet-resukts')
client=MongoClient(MONGO_URI)
db = client['kcet_database']  # Specify your database name
users_collection = db['users']  # Collection for user data
new_user=None
# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    global new_user 
    username = request.json['username']
    password = request.json['password']

    # Check if the user already exists
    if users_collection.find_one({'username': username}):
        return jsonify({'error': 'Username already exists'}), 400

    # Hash the password using Argon2
    hashed_password = ph.hash(password)

    # Create a new user document
    new = {
        'username': username,
        'password': hashed_password
    }
    
    new_user=username
    result = users_collection.insert_one(new)

    # Return userId along with success message
    return jsonify({'message': 'User registered successfully', 'userId': str(result.inserted_id)}), 201

# Login route
new_user=None
@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    global new_user
    new_user=username
    user = users_collection.find_one({'username': username})

    if user:
        try:
            # Verify the password using Argon2
            ph.verify(user['password'], password)
            return jsonify({'message': 'Login successful'}), 200
        except:
            return jsonify({'error': 'Invalid credentials'}), 401
    else:
        return jsonify({'error': 'User not found'}), 404

# Store selections route

@app.route('/storeSelection', methods=['POST'])
def store_selection():
    try:
        data = request.json
        user_id = data['userId']
        selected_languages = data['selectedLanguages']
        selected_artists = data['selectedArtists']
        

        # Convert user_id to ObjectId if necessary
        if not ObjectId.is_valid(user_id):
            return jsonify({'error': 'Invalid user ID format'}), 400
        user_id = ObjectId(user_id)

        # Update the user with their selected languages and artists
        result = users_collection.update_one(
            {'_id': user_id},  # Find the user by their ID
            {'$set': {
                'selectedLanguages': selected_languages,
                'selectedArtists': selected_artists
            }}
        )

        if result.modified_count > 0:
            return jsonify({'message': 'Selections saved successfully!'}), 200
        else:
            return jsonify({'message': 'No changes made or user not found.'}), 404

    except Exception as error:
        print("Error occurred:", error)  # Log the full error
        return jsonify({'message': 'An error occurred while saving selections.', 'error': str(error)}), 500
# Function to get access token
def get_access_token():
    url = "https://accounts.spotify.com/api/token"
    payload = {
        'grant_type': 'client_credentials'
    }
    
    try:
        response = requests.post(url, data=payload, auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET))
        response.raise_for_status()  # Raise an error for bad responses
        return response.json()['access_token']
    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
        if response:
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"An error occurred: {e}")
    return None

# Function to map emotion to audio features
def get_audio_features_for_emotion(emotion):
    if emotion == "happy":
        return {"target_valence": 0.8, "target_energy": 0.7}
    elif emotion == "sad":
        return {"target_valence": 0.2, "target_energy": 0.3}
    elif emotion == "angry":
        return {"target_valence": 0.3, "target_energy": 0.9}
    elif emotion == "calm":
        return {"target_acousticness": 0.8, "target_energy": 0.3}
    elif emotion == "neutral":
        return {"target_valence": 0.5, "target_energy": 0.5}  # Balanced values for neutrality
    else:
        return {}
 
    

@app.route('/search', methods=['POST'])  # Changed to POST
def search_sad_songs():
    # Get the search query from the request JSON
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({"error": "No search query provided"}), 400
    
    search_query = data['query']  # Extract the query from the JSON
    access_token = get_access_token()
    if access_token is None:
        return jsonify({"error": "Could not get access token"}), 401

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    url = f"https://api.spotify.com/v1/search?q={search_query}&type=track&limit=10"

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        tracks = response.json()['tracks']['items']
        sad_songs = []
        for track in tracks:
            song_info = {
                'id': track['id'],  # Include track ID
                'name': track['name'],
                'artist': track['artists'][0]['name'],
                'preview_url': track['preview_url'],
                'external_url': track['external_urls']['spotify']
            }
            sad_songs.append(song_info)
            print(sad_songs)
        return jsonify(sad_songs)
    else:
        return jsonify({"error": "Could not search for songs"}), 500


json_file_path = r"D:\projects\CodeFusion\codefusion\frontend\my-app\emotiondetector.json"

try:
    with open(json_file_path, "r") as json_file:
        model_json = json_file.read()
    model = model_from_json(model_json)
    model.load_weights(r"D:\projects\CodeFusion\codefusion\frontend\my-app\emotiondetector.h5")
except FileNotFoundError as e:
    print(f"FileNotFoundError: {e}. Make sure the file path is correct.")
    exit(1)
except Exception as e:
    print(f"An error occurred while loading the model: {e}")
    exit(1)

# Load Haarcascade face detection model
haar_file = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(haar_file)
emotions='happy'
# Check if the haarcascade loaded properly
if face_cascade.empty():
    print("Error loading Haarcascade file.")

# Function to extract features from the face image
def extract_features(image):
    feature = np.array(image)
    feature = feature.reshape(1, 48, 48, 1)
    return feature / 255.0  # Normalize the image
# Adjusting the emotion flow
@app.route('/imageprocessing', methods=['POST'])
def detect_emotion():
    data = request.json
    print(new_user)
    user_data = users_collection.find_one({"username": new_user})

    if user_data:
        selected_languages = user_data.get('selectedLanguages', [])
        selected_artists = user_data.get('selectedArtists', [])
    
        print("Selected Languages:", selected_languages)
        print("Selected Artists:", selected_artists)
    else:
        print("User not found.")

    if 'image' not in data:
        return jsonify({"error": "No image provided"}), 400

    base64_image = data["image"]
    image_data = base64.b64decode(base64_image)
    image_array = np.frombuffer(image_data, np.uint8)
    im = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    
    if im is None:
        return jsonify({"error": "Error loading image"}), 400

    gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    labels = {0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happy', 4: 'neutral', 5: 'sad', 6: 'surprise'}

    if len(faces) == 0:
        return jsonify({"error": "No faces detected"}), 400

    detected_emotions = []
    for (p, q, r, s) in faces:
        face_img = gray[q:q+s, p:p+r]
        face_img = cv2.resize(face_img, (48, 48))
        img_features = extract_features(face_img)
        pred = model.predict(img_features)
        detected_emotion = labels[pred.argmax()]
        detected_emotions.append(detected_emotion)
    
    # Use the first detected emotion to fetch songs
    if detected_emotions:
        return get_songs(selected_artists,emotion=detected_emotions[0])
    else:
        return jsonify({"error": "Emotion detection failed"}), 500

# Adjusting get_songs to accept the emotion parameter
def get_songs(artist_selected,emotion):
    print(emotion)
    access_token = get_access_token()
    if access_token is None:
        return jsonify({"error": "Could not get access token"}), 401

    headers = {'Authorization': f'Bearer {access_token}'}
    audio_features = get_audio_features_for_emotion(emotion)

    artist_ids = []
    for artist in artist_selected:
        search_url = f"https://api.spotify.com/v1/search?q={artist}&type=artist&limit=1"
        search_response = requests.get(search_url, headers=headers)
        if search_response.status_code == 200:
            artist_data = search_response.json().get('artists', {}).get('items', [])
            if artist_data:
                artist_ids.append(artist_data[0]['id'])
        else:
            return jsonify({"error": f"Could not find artist {artist}"}), 404

    params = {"limit": 10, "seed_artists": ','.join(artist_ids) if artist_ids else None, **audio_features}
    rec_url = "https://api.spotify.com/v1/recommendations"
    response = requests.get(rec_url, headers=headers, params=params)

    if response.status_code == 200:
        tracks = response.json()['tracks']
        song_recommendations = [
            {
                'id': track['id'],
                'name': track['name'],
                'artist': track['artists'][0]['name'],
                'preview_url': track['preview_url'],
                'external_url': track['external_urls']['spotify'],
            }
            for track in tracks
        ]
        return jsonify(song_recommendations)
    else:
        return jsonify({"error": "Could not get song recommendations"}), 500


if __name__ == "__main__":
    # app.run(port=5000, debug=True, host='0.0.0.0')
    app.run(port=5000, host='0.0.0.0')
