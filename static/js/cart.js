const cartItemsDiv = document.getElementById("cart-items");

function loadCart() {
    cartItemsDiv.innerHTML = "";

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.quantity * parseFloat(item.price);
        total += itemTotal;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: $${item.price}</p>

            <div class="qty-controls">
                <button onclick="changeQty(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>

            <p>Subtotal: $${itemTotal.toFixed(2)}</p>

            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                Remove
            </button>
        `;

        cartItemsDiv.appendChild(div);
    });

    const totalDiv = document.createElement("div");
    totalDiv.className = "cart-total";
    totalDiv.innerHTML = `<h2>Total: $${total.toFixed(2)}</h2>`;
    cartItemsDiv.appendChild(totalDiv);

    const buyBtn = document.createElement("button");
    buyBtn.className = "buy-btn";
    buyBtn.innerText = "Buy";
    buyBtn.onclick = buy;
    cartItemsDiv.appendChild(buyBtn);
}

function changeQty(productId, delta) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.map(item => {
        if (item.id === productId) {
            item.quantity += delta;
            if (item.quantity < 1) item.quantity = 1;
        }
        return item;
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function buy() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    fetch("/purchase", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cart: cart })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        localStorage.removeItem("cart");
        loadCart();
    })
    .catch(err => {
        console.error(err);
        alert("Something went wrong");
    });
}

loadCart();
