const products = [
    {
        id: 1,
        name: "Black Street Sneaker",
        price: 4500,
        image: "images/Men Shoe.jpg"
    },
    {
        id: 2,
        name: "White Classic",
        price: 1,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 3,
        name: "Sport Runner",
        price: 3900,
        image: "https://s.alicdn.com/@sc04/kf/Hf3b154dc24b046048f45b5d23f141471p.jpg?avif=close&webp=close"
    }
];

let cart = [];
let uploadedImage = null; // store uploaded image for new product

// ----------------- Load Products -----------------
function loadProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // clear before reloading

    products.forEach(product => {
        productList.innerHTML += `
            <div class="product">
                <img src="${product.image}" alt="${product.name}" style="max-width:150px;">
                <h3>${product.name}</h3>
                <p>KES ${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    });
}

// ----------------- Cart Functions -----------------
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const totalPrice = document.getElementById("total-price");

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartItems.innerHTML += `
            <li>
                ${item.name} - KES ${item.price}
                <button onclick="removeFromCart(${index})">X</button>
            </li>
        `;
    });

    cartCount.innerText = cart.length;
    totalPrice.innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("Checkout successful! (Please wait for payment confirmation)");
    cart = [];
    updateCart();
}

async function payWithMpesa() {
    if(cart.length === 0){
        alert("Your cart is empty!");
        return;
    }

    const phone = prompt("Enter your phone number (format 254795012504):");
    if(!phone) return;

    let total = cart.reduce((sum, item) => sum + item.price, 0);

    try {
        const res = await fetch("http://localhost:3000/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, amount: total })
        });

        const data = await res.json();
        console.log(data);
        alert("Check your phone for the M-Pesa payment prompt! (Sandbox)");
    } catch (err) {
        console.error(err);
        alert("Payment failed! Check console for details.");
    }
}

function goHome() {
    window.location.href = "index.html";
}

// ----------------- Add Product with Image Upload -----------------
const uploadInput = document.getElementById("image-upload");
const previewDiv = document.getElementById("image-preview");

uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImage = e.target.result;
        previewDiv.innerHTML = `<img src="${uploadedImage}" alt="Uploaded Image" style="max-width:150px;">`;
    }
    reader.readAsDataURL(file);
});

document.getElementById("add-product-btn").addEventListener("click", () => {
    const name = document.getElementById("new-product-name").value;
    const price = parseInt(document.getElementById("new-product-price").value);

    if (!name || !price || !uploadedImage) {
        alert("Please provide name, price, and image!");
        return;
    }

    const newProduct = {
        id: products.length + 1,
        name,
        price,
        image: uploadedImage
    };

    products.push(newProduct);

    // Clear inputs
    document.getElementById("new-product-name").value = "";
    document.getElementById("new-product-price").value = "";
    uploadedImage = null;
    previewDiv.innerHTML = "";

    loadProducts(); // reload products to show the new one
});

// ----------------- Initial Load -----------------
loadProducts();
