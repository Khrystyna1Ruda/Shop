const productsContainer = document.getElementById("products");

fetch("/products")
    .then(response => response.json())
    .then(products => {
        products.forEach(product => {
            if (product.stock <= 0) {
                return; // не показываем товар
            }
            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = `
                <div class="product-image"></div>
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">$${product.price}</div>
                <p>In stock: ${product.stock}</p>


                <div class="product-actions">
                    <input type="number" min="1" value="1" id="qty-${product.id}">
                    <button onclick="addToCart(${product.id})">
                        Add to cart
                    </button>
                </div>
            `;

            productsContainer.appendChild(card);
        });
    });

function addToCart(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);

    fetch("/products")
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const existing = cart.find(item => item.id === productId);

            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Product added to cart 🛒");
        });
}
