from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

GEMINI_API_KEY = 'TU_API_KEY_AQUI'  # Reemplaza por tu API Key
GEMINI_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}'

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    prompt = data.get('prompt', '')
    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
    payload = {
        'contents': [{
            'parts': [{
                'text': prompt
            }]
        }]
    }
    try:
        response = requests.post(GEMINI_URL, json=payload, headers={'Content-Type': 'application/json'})
        response.raise_for_status()
        result = response.json()
        text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
        return jsonify({'response': text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
