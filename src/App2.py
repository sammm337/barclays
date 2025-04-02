from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend access

# Dynamic topics list (You can fetch these from a database in a real app)
topics = [
    "Python", "Machine Learning", "Web Development",
    "Data Science", "Cloud Computing", "Cybersecurity",
    "Blockchain", "React.js", "Node.js", "DevOps"
]

@app.route('/get-topics', methods=['GET'])
def get_topics():
    return jsonify({"topics": topics})

if __name__ == '__main__':
    app.run(debug=True)
