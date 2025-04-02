from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Sample database of questions
questions_db = {
    "react": [
        {
            "id": 1,
            "question": "What is React?",
            "options": [
                "A JavaScript library for building user interfaces",
                "A programming language",
                "A database management system",
                "An operating system"
            ],
            "answer": "A JavaScript library for building user interfaces"
        },
        {
            "id": 2,
            "question": "What is JSX?",
            "options": [
                "A JavaScript extension for XML",
                "A Java XML parser",
                "A JSON formatter",
                "A JavaScript testing framework"
            ],
            "answer": "A JavaScript extension for XML"
        }
    ],
    "python": [
        {
            "id": 1,
            "question": "What is the primary use of Python?",
            "options": [
                "Game development",
                "Data science and web development",
                "Mobile application development",
                "Cybersecurity only"
            ],
            "answer": "Data science and web development"
        }
    ]
}

@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():
    data = request.get_json()
    topic = data.get("topic", "").lower()

    if topic in questions_db:
        return jsonify({"questions": questions_db[topic]})
    else:
        return jsonify({"error": "No questions available for this topic"}), 404

@app.route("/get-topics", methods=["GET"])
def get_topics():
    topics = list(questions_db.keys())
    return jsonify({"topics": topics})

if __name__ == "__main__":
    app.run(debug=True)
