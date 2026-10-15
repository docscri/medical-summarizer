"""Run the throwaway record-brief UI locally with one command."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


if __name__ == "__main__":
    folder = Path(__file__).resolve().parent
    server = ThreadingHTTPServer(
        ("127.0.0.1", 8765), partial(SimpleHTTPRequestHandler, directory=str(folder))
    )
    print("Record Brief UI prototype: http://127.0.0.1:8765/?variant=timeline")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
