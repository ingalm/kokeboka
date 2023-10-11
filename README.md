# Welcome to Kokeboka

## Build

This app is built with a React frontend, and Django backend.
The frontend is served through React, and the backend is served through nginx.
The application is built with the intention of using a Raspberry Pi as host for the internet.
The Raspberry Pi will be set up with Jenkins to automatically pull from this repository when an update is pushed, and subsequently to rebuild and run the app with Docker.

The web-hosting is not yet set up.
Jenkins is not yet set up.
Raspberry pi is not yet set up.
The frontend is not yet finished.
The backend is not yet finished.

### Run with docker and nginx

- cd backend

- python3 -m venv venv

- On Linux: source venv/bin/activate
- On Windows: venv\Scripts\activate

- pip3 install -r requirements.txt

- deactivate

- cd ..

- docker-compose build

- docker-compose up

### Run in development mode without nginx

- cd backend

- python3 -m venv venv

- On Linux: source venv/bin/activate
- On Windows: venv\Scripts\activate

- pip3 install -r requirements.txt

- python3 manage.py runserver

- cd ..

- cd frontend/ingvild-net

- npm start
