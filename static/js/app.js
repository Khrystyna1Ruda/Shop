// ================================
// Контейнеры для категорий
// ================================
const iphoneContainer = document.getElementById("iphone-products");
const macContainer = document.getElementById("mac-products");
const audioContainer = document.getElementById("audio-products");


// ================================
// Картинки товаров (id → image)
// ================================
const productImages = {
    1: "/static/images/iphoneX.png",
    2: "/static/images/iphone13.png",
    3: "/static/images/iphone15.png",

    4: "/static/images/macbook_air_m2.png",
    5: "/static/images/macbook_pro_14.png",
    6: "/static/images/imac_24.png",

    7: "/static/images/airpods_pro.png",
    8: "/static/images/airpods_max.png",
    9: "/static/images/airpods.png"
};


// ================================
// Загружаем товары
// ================================
fetch("/products")
    .then(response => response.json())
    .then(products => {
        products.forEach(product => {

            // если товара нет в наличии — не показываем
            if (product.stock <= 0) {
                return;
            }

            // создаём карточку
            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = `
                <img 
                    src="${productImages[product.id] || '/static/images/default.png'}"
                    alt="${product.name}"
                    class="product-image"
                >

                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">$${product.price}</div>
                <p>In stock: ${product.stock}</p>

                <div class="product-actions">
                    <input 
                        type="number"
                        min="1"
                        max="${product.stock}"
                        value="1"
                        id="qty-${product.id}"
                    >
                    <button onclick="addToCart(${product.id})">
                        Add to cart
                    </button>
                </div>
            `;

            // ================================
            // Раскладываем по категориям
            // ================================
            let container;

            if (product.category === "iPhone") {
                container = iphoneContainer;
            } else if (product.category === "Mac") {
                container = macContainer;
            } else if (product.category === "Audio") {
                container = audioContainer;
            } else {
                return;
            }

            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Error loading products:", error);
    });


// ================================
// Добавление в корзину
// ================================
function addToCart(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);

    if (quantity <= 0) {
        alert("Quantity must be at least 1");
        return;
    }

    fetch("/products")
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (!product) {
                alert("Product not found");
                return;
            }

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
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
        })
        .catch(error => {
            console.error("Error adding to cart:", error);
        });
}
