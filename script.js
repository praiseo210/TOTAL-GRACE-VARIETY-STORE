const products = [
  { id: 1, name: 'Classic Sneakers', price: 79.99, description: 'Comfortable everyday shoes.', image: 'https://images.unsplash.com/photo-1528701800489-20bf0fd2806d?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Travel Backpack', price: 49.99, description: 'Lightweight bag for work and weekend trips.', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'HEADPHONES', price: 5000, description: 'Noise-cancelling audio for any playlist.', image: 'https://images.unsplash.com/photo-1518449037387-47d5ec0e0c40?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Smart Watch', price: 199.99, description: 'Track fitness, messages, and sleep.', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Sunglasses', price: 34.99, description: 'Stylish protection for sunny days.', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: 'Coffee Percolator', price: 89.99, description: 'Fresh coffee at home in minutes.', image: 'https://images.unsplash.com/photo-1510626176961-4b67a09f7235?auto=format&fit=crop&w=800&q=80' }
];

const cart = new Map();
const productGrid = document.getElementById('productGrid');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartFooterTotal = document.getElementById('cartFooterTotal');
const cartPanel = document.getElementById('cartPanel');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const searchInput = document.getElementById('searchInput');
const checkoutButton = document.getElementById('checkoutButton');

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function renderProducts(items) {
  productGrid.innerHTML = '';
  if (!items.length) {
    productGrid.innerHTML = '<p>No products match your search.</p>';
    return;m
  }

  items.forEach(product => {
    const productCard = document.createElement('article');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-actions">
        <span>${formatMoney(product.price)}</span>
        <button data-id="${product.id}">Add</button>
      </div>
    `;

    productCard.querySelector('button').addEventListener('click', () => addToCart(product));
    productGrid.appendChild(productCard);
  });
}

function updateCartCounters() {
  let quantity = 0;
  let total = 0;
  cart.forEach(item => {
    quantity += item.quantity;
    total += item.quantity * item.price;
  });

  cartCount.textContent = quantity;
  cartTotal.textContent = formatMoney(total);
  cartFooterTotal.textContent = formatMoney(total);
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  if (!cart.size) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    return;
  }

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-details">
        <strong>${item.name}</strong>
        <small>${item.quantity} × ${formatMoney(item.price)}</small>
      </div>
      <div class="cart-item-actions">
        <button data-action="remove" data-id="${item.id}">Remove</button>
      </div>
    `;

    cartItem.querySelector('button').addEventListener('click', () => removeFromCart(item.id));
    cartItemsContainer.appendChild(cartItem);
  });
}

function addToCart(product) {
  if (cart.has(product.id)) {
    cart.get(product.id).quantity += 1;
  } else {
    cart.set(product.id, { ...product, quantity: 1 });
  }
  updateCartCounters();
  renderCart();
}

function removeFromCart(productId) {
  if (!cart.has(productId)) return;
  const item = cart.get(productId);
  item.quantity -= 1;
  if (item.quantity <= 0) {
    cart.delete(productId);
  }
  updateCartCounters();
  renderCart();
}

function filterProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query));
  renderProducts(filtered);
}

cartToggle.addEventListener('click', () => {
  cartPanel.classList.toggle('visible');
});

closeCart.addEventListener('click', () => {
  cartPanel.classList.remove('visible');
});

searchInput.addEventListener('input', filterProducts);
checkoutButton.addEventListener('click', () => {
  if (!cart.size) {
    alert('Add products to the cart before checkout.');
    return;
  }
  alert('Thanks for your order!');
  cart.clear();
  updateCartCounters();
  renderCart();
});

renderProducts(products);
renderCart();
updateCartCounters();
