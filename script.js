document.addEventListener("DOMContentLoaded", function () {

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount");
const cartBtn = document.getElementById("cartBtn");

const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

/* =========================
   CART COUNT UPDATE
========================= */

function updateCart() {

    if (cartCount) {

        let totalQty = 0;

        cart.forEach(item => {
            totalQty += item.qty;
        });

        cartCount.innerText = totalQty;
    }
}

updateCart();

/* =========================
   ADD TO CART
========================= */

document.querySelectorAll(".add-to-cart").forEach(btn => {

    btn.addEventListener("click", function () {

        const card = this.closest(".product-card");

        if (!card) return;

        const name = card.querySelector("h3")?.innerText || "Product";
        const priceText = card.querySelector(".price")?.innerText || "0";

        let price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;

        let existing = cart.find(item => item.name === name);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                qty: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCart();
        renderCart();

        alert("Added to Cart ✔");

    });
});

/* =========================
   BUY NOW WHATSAPP
========================= */

document.querySelectorAll(".buy-now").forEach(btn => {

    btn.addEventListener("click", function () {

        const card = this.closest(".product-card");

        const name = card.querySelector("h3")?.innerText || "";
        const price = card.querySelector(".price")?.innerText || "";

        const msg = `Order:\n${name}\nPrice: ${price}`;

        window.open(
            `https://wa.me/923362759713?text=${encodeURIComponent(msg)}`,
            "_blank"
        );

    });
});

/* =========================
   RENDER CART
========================= */

function renderCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;
    let totalQty = 0;

    cart.forEach((item, index) => {

        let itemTotal = item.price * item.qty;

        total += itemTotal;
        totalQty += item.qty;

        cartItems.innerHTML += `
        
        <div class="cart-item">

            <h4>${item.name}</h4>

            <p>Rs ${item.price} × ${item.qty} = <b>Rs ${itemTotal}</b></p>

            <div class="qty-controls">

                <button onclick="decreaseQty(${index})">-</button>

                <span>${item.qty}</span>

                <button onclick="increaseQty(${index})">+</button>

            </div>

            <button class="remove-btn" onclick="removeItem(${index})">
                Remove
            </button>

        </div>
        `;
    });

    /* DELIVERY LOGIC */
    let delivery = totalQty >= 12 ? 0 : 100;
    let grandTotal = total + delivery;

    if (cartTotal) {
        cartTotal.innerHTML = `
            Subtotal: Rs ${total} <br>
            Delivery: Rs ${delivery} <br>
            <b>Grand Total: Rs ${grandTotal}</b>
        `;
    }
}

/* =========================
   REMOVE ITEM
========================= */

window.removeItem = function (index) {

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart();
    renderCart();
};

/* =========================
   INCREASE QTY
========================= */

window.increaseQty = function (index) {

    cart[index].qty += 1;

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart();
    renderCart();
};

/* =========================
   DECREASE QTY
========================= */

window.decreaseQty = function (index) {

    if (cart[index].qty > 1) {
        cart[index].qty -= 1;
    } else {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart();
    renderCart();
};

/* =========================
   OPEN CART
========================= */

if (cartBtn) {

    cartBtn.addEventListener("click", function () {

        cartSidebar.classList.add("active");

        renderCart();

    });
}

/* =========================
   CLOSE CART
========================= */

if (closeCart) {

    closeCart.addEventListener("click", function () {

        cartSidebar.classList.remove("active");

    });
}

/* =========================
   CHECKOUT WHATSAPP
========================= */

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", function () {

        if (cart.length === 0) {
            alert("Cart Empty!");
            return;
        }

        let msg = "🛒 JaiGeet Order Details:\n\n";

        let total = 0;
        let totalQty = 0;

        cart.forEach((item, i) => {

            let itemTotal = item.price * item.qty;

            msg += `${i + 1}. ${item.name} × ${item.qty} = Rs ${itemTotal}\n`;

            total += itemTotal;
            totalQty += item.qty;
        });

        let delivery = totalQty >= 12 ? 0 : 100;
        let grandTotal = total + delivery;

        msg += `\nSubtotal: Rs ${total}`;
        msg += `\nDelivery: Rs ${delivery}`;
        msg += `\nGrand Total: Rs ${grandTotal}`;

        msg += `\n\n💳 Payment: Advance (EasyPaisa / JazzCash)`;
        msg += `\n📦 Order confirmed after payment`;

        window.open(
            `https://wa.me/923362759713?text=${encodeURIComponent(msg)}`,
            "_blank"
        );

    });
}

/* =========================
   SEARCH
========================= */

const search = document.getElementById("searchInput");

if (search) {

    search.addEventListener("keyup", function () {

        let val = this.value.toLowerCase();

        document.querySelectorAll(".product-card").forEach(card => {

            let title = card.querySelector("h3").innerText.toLowerCase();

            card.style.display = title.includes(val) ? "block" : "none";

        });

    });
}

});