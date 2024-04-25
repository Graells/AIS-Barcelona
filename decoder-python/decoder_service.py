from flask import Flask, jsonify
import json
import pathlib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/get-decoded-2448', methods=['GET'])
def get_decoded_2448():
    """Endpoint to retrieve processed vessel data."""
    base_path = pathlib.Path(__file__).parent
    output_path = base_path / 'output' / 'combined_decoded_2448.json'

    try:
        with open(output_path, 'r') as json_file:
            decoded_data = json.load(json_file)
        return jsonify(decoded_data)
    except FileNotFoundError:
        return jsonify({"error": "Requested file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
