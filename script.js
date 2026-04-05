const PRODUCTS = [
  {
    id: "whey-gold-2lb",
    name: "Gold Whey 2LB",
    category: "proteina",
    price: 42999,
    badge: "Más vendido",
    flavor: "Vainilla",
    description:
      "Proteína whey concentrada para recuperación muscular, con buena disolución y perfil completo de aminoácidos.",
  },
  {
    id: "whey-iron-5lb",
    name: "IRON Whey 5LB",
    category: "proteina",
    price: 68990,
    badge: "Mayor tamaño",
    flavor: "Chocolate",
    description:
      "Formato grande para quienes entrenan fuerte y buscan rendimiento sostenido durante todo el mes.",
  },
  {
    id: "creatina-mono-300",
    name: "Creatina Monohidratada 300 g",
    category: "creatina",
    price: 24500,
    badge: "Potencia",
    flavor: "Sin sabor",
    description:
      "Apoyo clásico para fuerza, explosividad y recuperación entre series de alta intensidad.",
  },
  {
    id: "pre-nitro-30",
    name: "Pre Workout Nitro",
    category: "pre-entreno",
    price: 29900,
    badge: "Energía",
    flavor: "Frutos rojos",
    description:
      "Blend orientado a enfoque, activación y energía para entrenamientos más intensos.",
  },
  {
    id: "shaker-pro-700",
    name: "Shaker Pro 700ml",
    category: "accesorios",
    price: 8990,
    badge: "Accesorio",
    flavor: "Negro mate",
    description:
      "Shaker resistente, liviano y con mezcla uniforme para proteína, creatina o pre entreno.",
  },
  {
    id: "combo-stack-power",
    name: "Combo Stack Power",
    category: "accesorios",
    price: 73490,
    badge: "Combo",
    flavor: "Whey + creatina + shaker",
    description:
      "Pack recomendado para arrancar fuerte: proteína, creatina y shaker en una sola compra.",
  },
];

const CART_STORAGE_KEY = "iron-store-cart";

function formatPrice(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function findProduct(productId) {
  return PRODUCTS.find((product) => product.id === productId);
}

function getCartWithProducts() {
  return getCart()
    .map((item) => {
      const product = findProduct(item.id);

      if (!product) {
        return null;
      }

      return {
        ...item,
        product,
      };
    })
    .filter(Boolean);
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

function animateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach((element) => {
    element.classList.remove("bouncing");
    void element.offsetWidth;
    element.classList.add("bouncing");
    element.addEventListener(
      "animationend",
      () => element.classList.remove("bouncing"),
      { once: true },
    );
  });
}

function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach((element) => {
    element.textContent = String(count);
  });
  animateCartCount();
}

function showToast(productName) {
  let container = document.querySelector(".toast-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div class="toast-icon">+1</div>
    <div class="toast-text">
      <span class="toast-title">${productName}</span>
      <span class="toast-subtitle">Agregado al carrito</span>
    </div>
  `;

  container.appendChild(toast);

  const remove = () => {
    toast.classList.add("removing");
    toast.addEventListener("animationend", () => toast.remove(), {
      once: true,
    });
  };

  setTimeout(remove, 2800);
  toast.addEventListener("click", remove);
}

function addToCart(productId) {
  const product = findProduct(productId);

  if (!product) {
    return;
  }

  const cart = getCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
  showToast(product.name);
}

function setCartItemQuantity(productId, nextQuantity) {
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (!item) {
    return;
  }

  if (nextQuantity <= 0) {
    const filteredCart = cart.filter((cartItem) => cartItem.id !== productId);
    saveCart(filteredCart);
  } else {
    item.quantity = nextQuantity;
    saveCart(cart);
  }

  updateCartCount();
  renderCartPage();
}

let scrollObserver = null;

function observeReveal() {
  if (!scrollObserver) return;
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
    scrollObserver.observe(el);
  });
}

function initScrollReveal() {
  const staticSelectors = [
    ".product-card",
    ".benefit-card",
    ".stat-card",
    ".info-item",
    ".page-hero-grid > *",
    ".section-heading",
    ".promo-banner",
    ".cart-item",
    ".cart-summary",
    ".cart-empty",
  ];

  document.querySelectorAll(staticSelectors.join(", ")).forEach((el) => {
    el.classList.add("reveal");
  });

  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
  );

  observeReveal();
}

function renderProducts(filter = "todos") {
  const productsGrid = document.querySelector("#products-grid");

  if (!productsGrid) {
    return;
  }

  const filteredProducts =
    filter === "todos"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === filter);

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
				<article class="catalog-card card">
					<div class="catalog-card-top">
						<span class="product-chip">${product.badge}</span>
						<span class="catalog-category">${product.category.replace("-", " ")}</span>
					</div>
					<div class="catalog-visual ${product.category}">
						<span>${product.name.split(" ")[0]}</span>
					</div>
					<h3>${product.name}</h3>
					<p>${product.description}</p>
					<div class="catalog-meta">
						<span class="product-price">${formatPrice(product.price)}</span>
						<span class="product-note">${product.flavor}</span>
					</div>
					<div class="catalog-actions">
						<button class="btn btn-primary" type="button" data-add-to-cart data-product-id="${product.id}">
							Agregar al carrito
						</button>
					</div>
				</article>
			`,
    )
    .join("");

  productsGrid.querySelectorAll(".catalog-card").forEach((el) => {
    el.classList.add("reveal");
  });
  observeReveal();
}

function renderCartPage() {
  const cartItemsContainer = document.querySelector("#cart-items");
  const summaryItems = document.querySelector("[data-summary-items]");
  const summarySubtotal = document.querySelector("[data-summary-subtotal]");
  const summaryTotal = document.querySelector("[data-summary-total]");

  if (
    !cartItemsContainer ||
    !summaryItems ||
    !summarySubtotal ||
    !summaryTotal
  ) {
    return;
  }

  const cartItems = getCartWithProducts();
  const quantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  if (!cartItems.length) {
    cartItemsContainer.innerHTML = `
			<article class="cart-empty card">
				<p class="product-chip">Carrito vacío</p>
				<h2>Tu selección todavía está esperando</h2>
				<p>
					Sumá proteína, creatina o accesorios para activar la experiencia completa de la tienda.
				</p>
				<a href="productos.html" class="btn btn-primary">Explorar productos</a>
			</article>
		`;
  } else {
    cartItemsContainer.innerHTML = cartItems
      .map(
        (item) => `
					<article class="cart-item card">
						<div class="cart-item-visual ${item.product.category}">
							<span>${item.product.name.split(" ")[0]}</span>
						</div>
						<div class="cart-item-content">
							<div>
								<span class="product-chip">${item.product.badge}</span>
								<h3>${item.product.name}</h3>
								<p>${item.product.description}</p>
							</div>
							<div class="cart-item-footer">
								<div class="qty-control">
									<button type="button" aria-label="Restar cantidad" data-qty-action="decrease" data-product-id="${item.product.id}">-</button>
									<span>${item.quantity}</span>
									<button type="button" aria-label="Sumar cantidad" data-qty-action="increase" data-product-id="${item.product.id}">+</button>
								</div>
								<strong class="cart-item-price">${formatPrice(item.product.price * item.quantity)}</strong>
							</div>
							<button class="cart-remove" type="button" data-remove-item data-product-id="${item.product.id}">
								Quitar producto
							</button>
						</div>
					</article>
				`,
      )
      .join("");
  }

  summaryItems.textContent = String(quantity);
  summarySubtotal.textContent = formatPrice(subtotal);
  summaryTotal.textContent = formatPrice(subtotal);
}

function handleFilterClick(event) {
  const filterButton = event.target.closest("[data-filter]");

  if (!filterButton) {
    return;
  }

  const filter = filterButton.dataset.filter || "todos";

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("is-active", button === filterButton);
  });

  renderProducts(filter);
}

function handleDocumentClick(event) {
  const addButton = event.target.closest("[data-add-to-cart]");

  if (addButton) {
    addToCart(addButton.dataset.productId);
    return;
  }

  const quantityButton = event.target.closest("[data-qty-action]");

  if (quantityButton) {
    const productId = quantityButton.dataset.productId;
    const action = quantityButton.dataset.qtyAction;
    const currentItem = getCart().find((item) => item.id === productId);

    if (!currentItem) {
      return;
    }

    const nextQuantity =
      action === "increase"
        ? currentItem.quantity + 1
        : currentItem.quantity - 1;
    setCartItemQuantity(productId, nextQuantity);
    return;
  }

  const removeButton = event.target.closest("[data-remove-item]");

  if (removeButton) {
    setCartItemQuantity(removeButton.dataset.productId, 0);
  }
}

function runCounters() {
  document.querySelectorAll("[data-count-to]").forEach((el) => {
    const target = parseInt(el.dataset.countTo, 10);
    const prefix = el.dataset.countPrefix || "";
    const suffix = el.dataset.countSuffix || "";
    const duration = 1200;
    const startTime = performance.now();

    function step(now) {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;

      if (elapsed < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  });
}

function initPage() {
  updateCartCount();

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!prefersReduced) {
    setTimeout(runCounters, 600);
  } else {
    document.querySelectorAll("[data-count-to]").forEach((el) => {
      el.textContent =
        (el.dataset.countPrefix || "") +
        el.dataset.countTo +
        (el.dataset.countSuffix || "");
    });
  }

  const filterControls = document.querySelector("[data-filter-controls]");

  if (filterControls) {
    renderProducts();
    filterControls.addEventListener("click", handleFilterClick);
  }

  if (document.body.dataset.page === "carrito") {
    renderCartPage();
  }

  document.addEventListener("click", handleDocumentClick);
  initScrollReveal();
}

document.addEventListener("DOMContentLoaded", initPage);
