from flask import Flask, jsonify
import os
import psycopg2
import redis

app = Flask(__name__)

DB_HOST = os.environ.get("DB_HOST", "db")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "ejemplo")
DB_NAME = os.environ.get("DB_NAME", "demo")

cache = redis.Redis(host="cache", port=6379, decode_responses=True)


@app.route("/")
def raiz():
    visitas = cache.incr("visitas")
    with psycopg2.connect(
        host=DB_HOST, user=DB_USER, password=DB_PASSWORD, dbname=DB_NAME
    ) as conn, conn.cursor() as cur:
        cur.execute("SELECT 1;")
        ok = cur.fetchone()[0]
    return jsonify(visitas=visitas, db_ok=ok == 1)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
