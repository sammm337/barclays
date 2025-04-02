from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
from openai import OpenAI
import json

app = Flask(__name__)
CORS(app, origins="https://barclays-efxp.vercel.app/")  # Enable CORS to allow frontend access

# Sample database of quiz questions
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

# Sample career progress data (Ideally, this should come from an LLM or database)
career_goals_db = {
    "amdocs": {
        "goal": "Land a tech job at Amdocs",
        "current_progress": 65,  # % completion
        "skills": ["React.js", "Node.js", "SQL", "System Design"],
        "next_steps": ["Improve DSA", "Build projects", "Practice system design"],
    },
    "google": {
        "goal": "Software Engineer at Google",
        "current_progress": 40,
        "skills": ["Algorithms", "Data Structures", "Machine Learning"],
        "next_steps": ["Solve Leetcode daily", "Contribute to open source"],
    },
    "amazon": {
        "goal": "Software Engineer at Amazon",
        "current_progress": 50,
        "skills": ["Java", "AWS", "Distributed Systems"],
        "next_steps": ["Learn System Design", "Solve Medium/Hard Leetcode"],
    },
    "microsoft": {
        "goal": "Software Engineer at Microsoft",
        "current_progress": 55,
        "skills": ["C#", ".NET", "Azure", "OOP"],
        "next_steps": ["Build Azure projects", "Prepare for behavioral interviews"],
    }
}

# @app.route("/generate-quiz", methods=["POST"])
# def generate_quiz():
#     data = request.get_json()
#     topic = data.get("topic", "").lower()

#     if topic in questions_db:
#         return jsonify({"questions": questions_db[topic]})
#     else:
#         return jsonify({"error": "No questions available for this topic"}), 404




client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="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"
)

@app.route("/generate-quiz", methods=["POST"])
def gernerate_questions_from_llm():
    data = request.get_json()
    topic = data.get("topic", "").lower()
    """Generate quiz questions dynamically using NVIDIA API."""
    prompt = f"""
    Generate exactly 3 multiple-choice questions for a quiz on {topic}.
    Return only a valid JSON array, without explanations or formatting.
    Each question should have:
    - "id" (integer)
    - "question" (string)
    - "options" (list of 4 strings)
    - "answer" (string, must match one of the options)
    
    Example output:
    [
      {{
        "id": 1,
        "question": "What is AI?",
        "options": ["Option1", "Option2", "Option3", "Option4"],
        "answer": "Option1"
      }}
    ]
    """

    completion = client.chat.completions.create(
        model="meta/llama3-70b-instruct",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        top_p=1,
        max_tokens=512
    )

    response_text = completion.choices[0].message.content.strip()

    try:
        # Remove Markdown formatting (if present)
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1].strip()
            response_text = response_text.replace("json", "").strip()

        # First attempt to parse JSON
        parsed_response = json.loads(response_text)

        # If `questions` key exists but is a string, decode it again
        if isinstance(parsed_response, dict) and "questions" in parsed_response:
            if isinstance(parsed_response["questions"], str):
                parsed_response["questions"] = json.loads(parsed_response["questions"])

        return jsonify({"questions":parsed_response})
    
    except json.JSONDecodeError as e:
        return jsonify({"error": "Failed to parse LLM response", "details": str(e), "raw_response": response_text}), 500

@app.route("/get-topics", methods=["GET"])
def get_topics():
    # Merge static topic list with database keys dynamically
    combined_topics = list(set(["Python", "React.js", "C++", "Data Science"] + list(questions_db.keys())))
    return jsonify({"topics": combined_topics})

@app.route("/get-intro", methods=["POST"])
def get_intro():
    data = request.get_json()
    topic = data.get("topic", "").lower()

    if topic in career_goals_db:
        return jsonify({"topic": topic, "intro": career_goals_db[topic]})
    else:
        return jsonify({"error": "No introduction available for this topic"}), 404

@app.route("/get-career-goal", methods=["POST"])
def get_career_goal():
    data = request.get_json()
    company_name = data.get("company", "").strip().lower()

    if company_name in career_goals_db:
        return jsonify(career_goals_db[company_name])
    else:
        return jsonify({"error": "Career goal data not found"}), 404

@app.route("/get-required-skills", methods=["POST"])
def get_required_skills():
    data = request.get_json()
    company_name = data.get("company", "").strip().lower()

    # Mock required skills for companies (Replace with LLM API in the future)
    company_skills = {
        "google": ["Algorithms", "System Design", "Python", "Machine Learning"],
        "amazon": ["Java", "AWS", "Distributed Systems", "Data Structures"],
        "microsoft": ["C#", ".NET", "Azure", "OOP"],
        "amdocs": ["Java", "Spring Boot", "Microservices", "SQL", "Cloud"],
    }

    if company_name in company_skills:
        return jsonify({"skills": company_skills[company_name]})
    else:
        return jsonify({"error": "Skills not found for this company"}), 404
    


@app.route('/extract-pdf', methods=['POST'])
def upload_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file provided'}), 400
        
        file = request.files['pdf']
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        # Read and parse PDF
        with pdfplumber.open(file) as pdf:
            text = '\n'.join([page.extract_text() for page in pdf.pages if page.extract_text()])
        
        return jsonify({'text': text})
    except Exception as e:
        print('Error processing PDF:', e)
        return jsonify({'error': 'Error processing PDF file'}), 500

if __name__ == "__main__":
    app.run(debug=True)
