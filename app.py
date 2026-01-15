from flask import Flask, jsonify, render_template, request
import sqlite3

app = Flask(__name__)

def get_connection():
    conn = sqlite3.connect("apple_shop.db")
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/")
def home():
    return "Apple Shop API is running"

@app.route("/shop")
def shop():
    return render_template("index.html")

@app.route("/cart")
def cart():
    return render_template("cart.html")

@app.route("/purchase", methods=["POST"])
def purchase():
    data = request.get_json()
    cart = data.get("cart", [])

    if not cart:
        return jsonify({
            "status": "error",
            "message": "Cart is empty"
        }), 400

    conn = get_connection()
    cursor = conn.cursor()

    # 1. Проверка наличия
    # первый комит
    for item in cart:
        cursor.execute(
            "SELECT stock FROM products WHERE id = ?",
            (item["id"],)
        )
        row = cursor.fetchone()

        if row is None:
            conn.close()
            return jsonify({
                "status": "error",
                "message": "Product not found"
            }), 404

        if row["stock"] < item["quantity"]:
            conn.close()
            return jsonify({
                "status": "error",
                "message": f"Not enough stock for {item['name']}"
            }), 400

    # 2. Списание товара
    for item in cart:
        cursor.execute(
            "UPDATE products SET stock = stock - ? WHERE id = ?",
            (item["quantity"], item["id"])
        )

    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Purchase completed successfully"
    })


@app.route("/products")
def get_products():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall()


    products = []
    for row in rows:
        products.append({
            "id": row["id"],
            "name": row["name"],
            "price": row["price"],
            "category": row["category"],
            "stock": row["stock"]
        })

    conn.close()
    return jsonify(products)
