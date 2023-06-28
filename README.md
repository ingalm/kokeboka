# Welcome to IngvildNet

This is a personal site with apps I have made because I wanted to make them.

### Run with docker and nginx

cd backend

python3 -m venv venv

On Linux: source venv/bin/activate
On Windows: venv\Scripts\activate

pip install -r requirements.txt

deactivate

cd ..

docker-compose build

docker-compose up

### Run in development mode without nginx

cd backend

python3 -m venv venv

On Linux: source venv/bin/activate
On Windows: venv\Scripts\activate

pip install -r requirements.txt

python3 manage.py runserver

cd ..

cd frontend/ingvild-net

npm start
