from flask import Flask, jsonify
import os
import socket

app = Flask(__name__)


@app.route("/")
def hola():
    return jsonify(
        mensaje="Hola desde el contenedor",
        host=socket.gethostname(),
        version=os.environ.get("APP_VERSION", "0.1.0"),
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
