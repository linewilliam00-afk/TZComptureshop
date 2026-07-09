const addToCartButton = document.getElementById("add-to-cart");
const cartPopup = document.getElementById("cart-popup");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const checkoutButton = document.getElementById("checkout-button");
const checkoutModal = document.getElementById("checkout-modal");
const confirmCheckoutButton = document.getElementById("confirm-checkout");
const checkoutStatus = document.getElementById("checkout-status");
const loginButton = document.getElementById("login-button");
const loginSection = document.getElementById("login-section");
const welcomePopup = document.getElementById("welcome-popup");
const usernameInput = document.getElementById("username");
const welcomeMessage = document.getElementById("welcome-message");

if (loginButton && loginSection && welcomePopup) {
  loginButton.addEventListener("click", function () {
    if (typeof bootstrap === "undefined") {
      alert("Login is temporarily unavailable.");
      return;
    }

    const loginModal = bootstrap.Modal.getOrCreateInstance(loginSection);
    const welcomeModal = bootstrap.Modal.getOrCreateInstance(welcomePopup);

    if (usernameInput && welcomeMessage) {
      const username = usernameInput.value.trim();
      welcomeMessage.textContent = username
        ? `Welcome, ${username}! You have successfully logged in.`
        : "Welcome! You have successfully logged in.";
    }

    localStorage.setItem("isLoggedIn", "true");
    loginModal.hide();
    welcomeModal.show();
  });
}

if (addToCartButton && cartPopup) {
  addToCartButton.addEventListener("click", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      alert("Please log in before buying.");
      return;
    }

    const product = {
      name: "Laptop 1",
      price: 1000,
      image: "images/laptop1.jpg",
      quantity: 1,
    };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(function (item) {
      return item.name === product.name;
    });

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    cartPopup.classList.add("show");

    setTimeout(function () {
      cartPopup.classList.remove("show");
    }, 2000);
  });
}

if (checkoutButton && checkoutModal && confirmCheckoutButton) {
  const checkoutModalInstance =
    typeof bootstrap !== "undefined"
      ? bootstrap.Modal.getOrCreateInstance(checkoutModal)
      : null;

  checkoutButton.addEventListener("click", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      if (checkoutStatus) {
        checkoutStatus.textContent = "Your cart is empty.";
      }
      return;
    }

    if (checkoutModalInstance) {
      checkoutModalInstance.show();
    } else {
      if (checkoutStatus) {
        checkoutStatus.textContent = "Checkout is unavailable right now.";
      }
    }
  });

  confirmCheckoutButton.addEventListener("click", function () {
    localStorage.removeItem("cart");
    if (checkoutModalInstance) {
      checkoutModalInstance.hide();
    }

    if (checkoutStatus) {
      checkoutStatus.textContent =
        "Purchase complete! Your cart has been cleared.";
    }

    if (cartItems) {
      renderCart();
    }
  });
}

if (cartItems) {
  const cartTotal = document.getElementById("cart-total");

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartTotal(cart) {
    if (!cartTotal) {
      return;
    }

    const total = cart.reduce(function (sum, product) {
      return sum + product.price * product.quantity;
    }, 0);
    cartTotal.textContent = total.toFixed(2);
  }

  function renderCart() {
    const cart = getCart();
    cartItems.innerHTML = "";

    if (cart.length === 0 && cartEmpty) {
      cartEmpty.style.display = "block";
    } else if (cartEmpty) {
      cartEmpty.style.display = "none";
    }

    cart.forEach(function (product, index) {
      const item = document.createElement("div");
      item.className = "cart-item";

      item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="cart-details">
                <p class="cart-name">${product.name}</p>
                <p class="cart-price">$${product.price}</p>
                <div class="quantity-controls">
                    <button class="quantity-button decrease-quantity" data-index="${index}" aria-label="Decrease ${product.name} quantity">-</button>
                    <span class="cart-quantity">${product.quantity}</span>
                    <button class="quantity-button increase-quantity" data-index="${index}" aria-label="Increase ${product.name} quantity">+</button>
                </div>
            </div>
            <button class="remove-cart-item" data-index="${index}" aria-label="Remove ${product.name} from cart">&times;</button>
        `;

      cartItems.appendChild(item);
    });

    updateCartTotal(cart);
  }

  cartItems.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
      return;
    }

    const cart = getCart();
    const index = Number(button.dataset.index);

    if (!cart[index]) {
      return;
    }

    if (button.classList.contains("increase-quantity")) {
      cart[index].quantity += 1;
    }

    if (button.classList.contains("decrease-quantity")) {
      cart[index].quantity -= 1;

      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
    }

    if (button.classList.contains("remove-cart-item")) {
      cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
  });

  renderCart();
}
