from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Read content length for POST body
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'

        try:
            data = json.loads(post_data.decode('utf-8'))
        except Exception:
            data = {}

        history = data.get('history', [])

        # Calculate next difficulty
        next_difficulty = "easy"
        if history:
            last_item = history[-1]
            last_correct = last_item.get('correct', False)
            last_diff = last_item.get('difficulty', 'easy')

            if not last_correct:
                # Demotion
                if last_diff == 'hard':
                    next_difficulty = 'medium'
                else:
                    next_difficulty = 'easy'
            else:
                # Count consecutive correct answers of the same tier at the end of history
                suffix_count = 0
                for item in reversed(history):
                    if item.get('correct', False) and item.get('difficulty') == last_diff:
                        suffix_count += 1
                    else:
                        break

                if suffix_count >= 3:
                    # Promotion
                    if last_diff == 'easy':
                        next_difficulty = 'medium'
                    elif last_diff == 'medium':
                        next_difficulty = 'hard'
                    else: # hard
                        next_difficulty = 'hard'
                else:
                    next_difficulty = last_diff

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

        response_data = {
            "nextDifficulty": next_difficulty
        }

        self.wfile.write(json.dumps(response_data).encode('utf-8'))
        return

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return
