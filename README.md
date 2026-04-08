# Eifron S9 FAQ Chatbot

Chatbot υποστήριξης για την αντλία S9 / EasyPatch / CGM αισθητήρα.  
68 ερωτοαπαντήσεις σε 3 κατηγορίες με guided navigation + free-text search.

## Αρχεία

| Αρχείο | Περιγραφή |
|--------|-----------|
| `chatbot.py` | Flask API — FAQ data, TF-IDF engine, navigation tree |
| `demo.html` | Chat UI — browse mode + search mode |
| `static/widget.js` | Embeddable widget (floating button) για ενσωμάτωση σε site |
| `embed_example.html` | Παράδειγμα χρήσης widget |
| `wsgi.py` | Production entry point (Gunicorn) |
| `Dockerfile` | Docker image για deployment |
| `Procfile` | Για Render / Railway / Heroku |
| `unanswered.log` | Αυτόματο log ερωτήσεων χωρίς απάντηση |

## Local Setup

```bash
pip install -r requirements.txt
python chatbot.py
```

Server: `http://localhost:5070`  
Demo: ανοίξτε `demo.html` στον browser

## Deployment (Production)

### Render.com (δωρεάν tier)
1. Push σε GitHub repo
2. Render → New Web Service → Connect repo
3. Build: `pip install -r requirements.txt`
4. Start: `gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 2`

### Docker
```bash
docker build -t eifron-chatbot .
docker run -p 8080:8080 eifron-chatbot
```

### Railway / Heroku
Το Procfile αναγνωρίζεται αυτόματα.

## Ενσωμάτωση στο eifron.com

Προσθέστε πριν το `</body>`:

```html
<script src="https://YOUR-SERVER.com/static/widget.js"></script>
```

Εμφανίζεται floating chat button κάτω δεξιά.

## API Endpoints

| Method | URL | Περιγραφή |
|--------|-----|-----------|
| `GET` | `/api/navigate` | Navigation tree (κατηγορίες → υποκατηγορίες → ερωτήσεις) |
| `POST` | `/api/chat` | Free-text search `{"message": "..."}` |
| `GET` | `/api/search?q=...` | Debug: top-5 matches with scores |
| `GET` | `/chat` | Σερβίρει το chat UI (για widget iframe) |
| `GET` | `/health` | Health check |

## Παραμετροποίηση

| Μεταβλητή | Default | Περιγραφή |
|-----------|---------|-----------|
| `PORT` | `5070` | Server port |
| `FLASK_DEBUG` | `0` | `1` = debug mode |
| `CONFIDENCE_THRESHOLD` | `0.28` | Αυξήστε = αυστηρότερο, μειώστε = πιο χαλαρό |

## Monitoring

Το `unanswered.log` καταγράφει κάθε ερώτηση που πήγε σε fallback:
```
2026-04-06 14:22:31 - [0.12] πόσο κοστίζει η αντλία;
2026-04-06 14:23:45 - [0.08] τι γίνεται αν βραχεί;
```
Ελέγχετε τακτικά και προσθέτετε νέα FAQ entries στη λίστα `FAQ` του `chatbot.py`.
