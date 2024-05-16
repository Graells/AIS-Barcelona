python3 -m venv venv

venv\Scripts\activate

source venv/bin/activate

pip install -r requirements.txt

python3 decoder_handler.py

export FLASK_APP=decoder_service.py

flask run

(pip freeze > requirements.txt)