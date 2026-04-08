"""WSGI entry point for production deployment."""
from chatbot import app

if __name__ == "__main__":
    app.run()
