import os
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
jtw =  JWTManager(app)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            os.getenv("URL_FRONT", "https://proyectoppvi.onrender.com")
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.route("/")
def index():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(debug=True) 