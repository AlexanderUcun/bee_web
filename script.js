/**
 * Honey Harvest — Cinematic Parallax Engine & WhatsApp Order Builder
 * Vanilla JS (ES6+) — Lightweight, ultra-smooth RAF animation engine
 */

/* Easy-to-edit WhatsApp Target Number */
const WHATSAPP_NUMBER = "573000000000";

(function () {
  'use strict';

  /* ==========================================================================
     1. Data Catalog (Artisan Honey Products & Variants)
     ========================================================================== */
  const PRODUCTS = [
    {
      id: "miel-pura",
      name: "Miel Pura de Abeja",
      kicker: "Directo de la Colmena",
      description: "Miel líquida natural, decantada en frío, sin aditivos ni pasteurización.",
      image: "assets/product_miel_pura.webp",
      badge: "Más Solicitado",
      stock: 15,
      variants: [
        { label: "250g", price: 14000 },
        { label: "500g", price: 26000, default: true },
        { label: "1000g", price: 48000 }
      ]
    },
    {
      id: "panal-miel",
      name: "Panal de Miel",
      kicker: "Cera Virgen & Miel Cruda",
      description: "Trozo de panal natural con miel dentro, tal como sale del cuadro, sin extraer.",
      image: "assets/product_panal_miel.webp",
      badge: "Edición Limitada",
      stock: 8,
      variants: [
        { label: "Pieza Mediana", price: 18000, default: true },
        { label: "Pieza Grande", price: 32000 }
      ]
    },
    {
      id: "polen-apicola",
      name: "Polen Apícola",
      kicker: "Superalimento Natural",
      description: "Gránulos de polen recolectados en trampa con secado artesanal suave.",
      image: "assets/product_polen_apicola.webp",
      badge: "Fresco de Cosecha",
      stock: 12,
      variants: [
        { label: "250g", price: 17000, default: true },
        { label: "500g", price: 30000 }
      ]
    },
    {
      id: "cera-abeja",
      name: "Cera de Abeja en Bloque",
      kicker: "100% Cera Pura",
      description: "Cera pura fundida y colada a mano, subproducto natural del desopercule.",
      image: "assets/product_cera_abeja.webp",
      badge: "Artesanal Pura",
      stock: 20,
      variants: [
        { label: "Bloque 100g", price: 12000, default: true },
        { label: "Bloque 200g", price: 20000 }
      ]
    }
  ];

  /* Price Currency Formatter ($14.000 COP) */
  function formatCOP(num) {
    return '$' + num.toLocaleString('es-CO');
  }

  /* ==========================================================================
     2. Mathematical Helper Functions
     ========================================================================== */
  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function smoothstep(min, max, value) {
    const x = clamp((value - min) / (max - min), 0, 1);
    return x * x * (3 - 2 * x);
  }

  function segmentProgress(scroll, start, end) {
    if (scroll <= start) return 0;
    if (scroll >= end) return 1;
    return (scroll - start) / (end - start);
  }

  function segmentInOut(scroll, fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd) {
    if (scroll < fadeInStart) return 0;
    if (scroll <= fadeInEnd) return smoothstep(fadeInStart, fadeInEnd, scroll);
    if (scroll < fadeOutStart) return 1;
    if (scroll <= fadeOutEnd) return 1 - smoothstep(fadeOutStart, fadeOutEnd, scroll);
    return 0;
  }

  /* ==========================================================================
     3. Application State & DOM Elements
     ========================================================================== */
  const root = document.documentElement;

  const state = {
    scrollCurrent: 0,
    scrollTarget: 0,
    mouseXCurrent: 0,
    mouseYCurrent: 0,
    mouseXTarget: 0,
    mouseYTarget: 0,
    spotlightCurrentX: 50,
    spotlightCurrentY: 50,
    spotlightTargetX: 50,
    spotlightTargetY: 50,
    order: [] // In-memory session order array: { id, name, variantLabel, price, quantity }
  };

  /* ==========================================================================
     4. Parallax Choreography Engine
     ========================================================================== */
  function updateScrollChoreography(scroll) {
    const titleProgress = segmentProgress(scroll, 0, 320);
    const titleY = titleProgress * -220;
    const titleScale = 1 + titleProgress * 0.25;
    const titleOpacity = 1 - smoothstep(120, 320, scroll);

    const introProgress = segmentProgress(scroll, 0, 280);
    const introCopyY = introProgress * 140;
    const introCopyOpacity = 1 - smoothstep(80, 260, scroll);

    const splitOpen = smoothstep(240, 500, scroll);
    const splitLeftX = (1 - splitOpen) * -100;
    const splitRightX = (1 - splitOpen) * 100;

    let beeX, beeY, beeScale, beeRotate, bridgeOpacity;
    const mouseShiftX = state.mouseXCurrent * 22;
    const mouseShiftY = state.mouseYCurrent * 35;

    if (scroll < 350) {
      const p = segmentProgress(scroll, 0, 350);
      beeX = lerp(20, 8, p) + (mouseShiftX * 0.15);
      beeY = lerp(-30, 20, p) + (mouseShiftY * 0.4);
      beeScale = lerp(1.05, 1.3, p);
      beeRotate = lerp(-10, 8, p) + (state.mouseXCurrent * 5);
      bridgeOpacity = 1;
    } else if (scroll < 950) {
      const p = segmentProgress(scroll, 350, 950);
      beeX = lerp(8, -24, smoothstep(350, 650, scroll)) + (mouseShiftX * 0.2);
      beeY = lerp(20, 60, p) + (mouseShiftY * 0.5);
      beeScale = lerp(1.3, 1.45, smoothstep(350, 650, scroll));
      beeRotate = lerp(8, 28, smoothstep(350, 650, scroll)) + (state.mouseXCurrent * 8);
      bridgeOpacity = 1;
    } else {
      const p = segmentProgress(scroll, 950, 1500);
      beeX = lerp(-24, 26, smoothstep(950, 1250, scroll)) + (mouseShiftX * 0.2);
      beeY = lerp(60, -15, p) + (mouseShiftY * 0.5);
      beeScale = lerp(1.45, 1.15, p);
      beeRotate = lerp(28, -16, smoothstep(950, 1250, scroll)) + (state.mouseXCurrent * 6);
      bridgeOpacity = 1 - smoothstep(1300, 1500, scroll);
    }

    const pose1El = document.getElementById('bee-pose-1');
    const pose2El = document.getElementById('bee-pose-2');
    const pose3El = document.getElementById('bee-pose-3');

    const p1Opacity = 1 - smoothstep(180, 440, scroll);
    const p2Opacity = segmentInOut(scroll, 240, 480, 680, 880);
    const p3Opacity = smoothstep(680, 880, scroll);

    if (pose1El) pose1El.style.opacity = p1Opacity.toFixed(3);
    if (pose2El) pose2El.style.opacity = p2Opacity.toFixed(3);
    if (pose3El) pose3El.style.opacity = p3Opacity.toFixed(3);

    const frame2Opacity = segmentInOut(scroll, 400, 600, 850, 1050);

    const panel2Opacity = segmentInOut(scroll, 260, 480, 680, 840);
    const panel2Y = lerp(40, 0, smoothstep(260, 480, scroll)) + (scroll > 680 ? (scroll - 680) * -0.15 : 0);

    const panel3Opacity = segmentInOut(scroll, 680, 880, 1180, 1400);
    const panel3Y = lerp(40, 0, smoothstep(680, 880, scroll)) + (scroll > 1180 ? (scroll - 1180) * -0.15 : 0);

    const bazaarSat = lerp(0.8, 1.4, segmentInOut(scroll, 680, 900, 1180, 1400));
    const bazaarBright = lerp(0.9, 1.15, segmentInOut(scroll, 680, 900, 1180, 1400));

    root.style.setProperty('--title-y', `${titleY}px`);
    root.style.setProperty('--title-scale', titleScale);
    root.style.setProperty('--title-opacity', titleOpacity);

    root.style.setProperty('--intro-copy-y', `${introCopyY}px`);
    root.style.setProperty('--intro-copy-opacity', introCopyOpacity);

    root.style.setProperty('--split-left-x', `${splitLeftX}%`);
    root.style.setProperty('--split-right-x', `${splitRightX}%`);

    root.style.setProperty('--bridge-x', `calc(-50% + ${beeX}vw)`);
    root.style.setProperty('--bridge-scale', beeScale);
    root.style.setProperty('--bridge-y', `${beeY}px`);
    root.style.setProperty('--bridge-opacity', bridgeOpacity);
    root.style.setProperty('--bee-rotate', `${beeRotate}deg`);

    root.style.setProperty('--frame2-opacity', frame2Opacity);

    root.style.setProperty('--panel2-opacity', panel2Opacity);
    root.style.setProperty('--panel2-y', `${panel2Y}px`);

    root.style.setProperty('--panel3-opacity', panel3Opacity);
    root.style.setProperty('--panel3-y', `${panel3Y}px`);

    root.style.setProperty('--bazaar-saturation', bazaarSat);
    root.style.setProperty('--bazaar-brightness', bazaarBright);

    updateActiveNav(scroll);
  }

  function updateActiveNav(scroll) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    const shopEl = document.getElementById('shop');
    const nosotrosEl = document.getElementById('nosotros');
    const comprarEl = document.getElementById('comprar');

    const shopTop = shopEl ? shopEl.offsetTop - 140 : 1500;
    const nosotrosTop = nosotrosEl ? nosotrosEl.offsetTop - 140 : 2200;
    const comprarTop = comprarEl ? comprarEl.offsetTop - 140 : 2800;

    if (scroll >= comprarTop) {
      document.querySelector('.nav-link[href="#comprar"]')?.classList.add('active');
    } else if (scroll >= nosotrosTop) {
      document.querySelector('.nav-link[href="#nosotros"]')?.classList.add('active');
    } else if (scroll >= shopTop) {
      document.querySelector('.nav-link[href="#shop"]')?.classList.add('active');
    } else {
      document.querySelector('.nav-link[href="#cinema"]')?.classList.add('active');
    }
  }

  const isMobileDevice = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function renderLoop() {
    state.scrollTarget = window.scrollY || window.pageYOffset;

    if (isMobileDevice) {
      state.scrollCurrent = state.scrollTarget;
      updateScrollChoreography(state.scrollCurrent);
    } else {
      state.scrollCurrent = lerp(state.scrollCurrent, state.scrollTarget, 0.55);
      state.mouseXCurrent = lerp(state.mouseXCurrent, state.mouseXTarget, 0.08);
      state.mouseYCurrent = lerp(state.mouseYCurrent, state.mouseYTarget, 0.08);

      state.spotlightCurrentX = lerp(state.spotlightCurrentX, state.spotlightTargetX, 0.15);
      state.spotlightCurrentY = lerp(state.spotlightCurrentY, state.spotlightTargetY, 0.15);

      root.style.setProperty('--mx', state.mouseXCurrent);
      root.style.setProperty('--my', state.mouseYCurrent);
      root.style.setProperty('--spotlight-x', `${state.spotlightCurrentX.toFixed(2)}%`);
      root.style.setProperty('--spotlight-y', `${state.spotlightCurrentY.toFixed(2)}%`);

      updateScrollChoreography(state.scrollCurrent);
    }

    requestAnimationFrame(renderLoop);
  }

  function updateSpotlightCoordinates(clientX, clientY) {
    if (isMobileDevice) return;
    const x = clamp((clientX / window.innerWidth) * 100, 0, 100);
    const y = clamp((clientY / window.innerHeight) * 100, 0, 100);
    state.spotlightTargetX = x;
    state.spotlightTargetY = y;
  }

  const cursorRing = document.getElementById('cursor-ring');
  const siteHeaderEl = document.querySelector('.site-header');
  let lastRecordedScrollY = window.scrollY || 0;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY || 0;
    if (currentY > 140 && currentY > lastRecordedScrollY + 8) {
      siteHeaderEl?.classList.add('header-hidden');
    } else if (currentY < lastRecordedScrollY - 8 || currentY <= 80) {
      siteHeaderEl?.classList.remove('header-hidden');
    }
    lastRecordedScrollY = currentY;
  }, { passive: true });

  window.addEventListener('mousemove', e => {
    state.mouseXTarget = (e.clientX / window.innerWidth - 0.5) * 2;
    state.mouseYTarget = (e.clientY / window.innerHeight - 0.5) * 2;
    updateSpotlightCoordinates(e.clientX, e.clientY);

    if (e.clientY < 90) {
      siteHeaderEl?.classList.remove('header-hidden');
    }

    if (cursorRing) {
      const isHoverable = e.target.closest('a, button, .product-card, .tag-badge, .nav-link, .header-wa-btn');
      if (isHoverable) {
        cursorRing.style.width = '130px';
        cursorRing.style.height = '130px';
        cursorRing.style.borderColor = '#fef08a';
      } else {
        cursorRing.style.width = '96px';
        cursorRing.style.height = '96px';
        cursorRing.style.borderColor = 'rgba(254, 240, 138, 0.85)';
      }
    }
  });

  /* ==========================================================================
     5. Render Products & Variant Switcher Logic
     ========================================================================== */
  function renderProducts() {
    const container = document.getElementById('products-grid-container');
    if (!container) return;

    container.innerHTML = PRODUCTS.map(product => {
      const defaultVarIndex = product.variants.findIndex(v => v.default) !== -1
        ? product.variants.findIndex(v => v.default)
        : 0;
      const currentVariant = product.variants[defaultVarIndex];

      return `
        <article class="product-card" data-id="${product.id}" data-selected-variant="${defaultVarIndex}">
          <div class="product-card-inner">
            <div class="product-image-container">
              <span class="product-stock-badge">Lote limitado &bull; Quedan ${product.stock} un.</span>
              <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" decoding="async">
              <span class="product-tag-badge">${product.badge}</span>
            </div>
            <div class="product-card-body">
              <span class="product-kicker">${product.kicker}</span>
              <h3 class="product-title">${product.name}</h3>
              <p class="product-desc">${product.description}</p>

              <div class="variant-selector-group">
                <span class="variant-label-title">Presentación / Tamaño:</span>
                <div class="variant-pills">
                  ${product.variants.map((v, idx) => `
                    <button type="button" class="variant-pill ${idx === defaultVarIndex ? 'active' : ''}" 
                      data-variant-index="${idx}">
                      ${v.label}
                    </button>
                  `).join('')}
                </div>
              </div>

              <div class="product-card-footer">
                <div class="price-display">
                  <span class="price-label">Precio:</span>
                  <span class="price-amount" id="price-${product.id}">${formatCOP(currentVariant.price)}</span>
                </div>

                <div class="action-buttons-group">
                  <button type="button" class="add-to-order-btn" data-id="${product.id}">
                    <span>+ Añadir al pedido</span>
                  </button>
                  <button type="button" class="buy-now-wa-btn" data-id="${product.id}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.477 1.33 4.988l-1.416 5.172 5.291-1.388a9.948 9.948 0 0 0 4.782 1.218h.004c5.504 0 9.985-4.478 9.986-9.985 0-2.668-1.038-5.176-2.924-7.062a9.92 9.92 0 0 0-7.063-2.929zm5.952 14.154c-.252.71-1.246 1.306-1.722 1.368-.456.059-1.042.102-3.361-.856-2.668-1.103-4.385-3.83-4.519-4.009-.133-.178-1.082-1.439-1.082-2.744 0-1.305.684-1.947.928-2.207.244-.261.533-.326.711-.326.177 0 .355.002.511.01.167.008.391-.063.611.465.222.533.755 1.84.822 1.974.066.133.111.289.022.466-.089.178-.133.289-.266.445-.133.156-.28.349-.4.469-.133.133-.272.277-.117.543.156.266.692 1.144 1.488 1.853 1.023.913 1.887 1.196 2.153 1.329.266.133.422.111.577-.066.155-.178.666-.777.844-1.044.178-.266.355-.222.599-.133.244.089 1.555.733 1.822.866.266.133.444.2.511.311.066.111.066.644-.186 1.354z"/>
                    </svg>
                    <span>Comprar por WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Variant switching event delegation
  document.addEventListener('click', e => {
    const pill = e.target.closest('.variant-pill');
    if (pill) {
      const card = pill.closest('.product-card');
      const productId = card.dataset.id;
      const variantIndex = parseInt(pill.dataset.variantIndex, 10);
      const product = PRODUCTS.find(p => p.id === productId);

      if (!product) return;

      // Update active pill styling inside card
      card.querySelectorAll('.variant-pill').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === variantIndex);
      });

      // Store selected variant index in card data attribute
      card.dataset.selectedVariant = variantIndex;

      // Update card price display
      const priceEl = document.getElementById(`price-${productId}`);
      if (priceEl) {
        priceEl.textContent = formatCOP(product.variants[variantIndex].price);
      }
    }
  });

  /* ==========================================================================
     6. WhatsApp Order Builder & Dynamic Message Generator
     ========================================================================== */
  const waFloatBtn = document.getElementById('whatsapp-order-float');
  const waBadgeCount = document.getElementById('wa-badge-count');
  const waFloatTotal = document.getElementById('wa-float-total');
  const modalOverlay = document.getElementById('whatsapp-modal-overlay');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const orderItemsList = document.getElementById('order-items-list');
  const orderTotalPriceEl = document.getElementById('order-total-price');
  const sendOrderWaBtn = document.getElementById('send-order-wa-btn');

  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  function addToOrder(productId) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (!card) return;

    const variantIndex = parseInt(card.dataset.selectedVariant || "0", 10);
    const product = PRODUCTS.find(p => p.id === productId);
    const variant = product.variants[variantIndex];

    const existing = state.order.find(item => item.id === productId && item.variantLabel === variant.label);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.order.push({
        id: productId,
        name: product.name,
        variantLabel: variant.label,
        price: variant.price,
        quantity: 1
      });
    }

    updateOrderUI();
    showToast(`✓ Agregado: <strong>${product.name} (${variant.label})</strong>`);
  }

  function updateOrderUI() {
    let totalItems = 0;
    let totalPrice = 0;

    state.order.forEach(item => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    });

    if (waBadgeCount) waBadgeCount.textContent = totalItems;
    if (waFloatTotal) waFloatTotal.textContent = formatCOP(totalPrice);

    if (totalItems > 0) {
      waFloatBtn?.classList.remove('hidden');
    } else {
      waFloatBtn?.classList.add('hidden');
      closeModal();
    }

    renderModalItems();
  }

  function renderModalItems() {
    if (!orderItemsList) return;
    orderItemsList.innerHTML = '';
    let total = 0;

    if (state.order.length === 0) {
      orderItemsList.innerHTML = '<p class="empty-order-msg">Tu pedido está vacío actualmente.</p>';
    } else {
      state.order.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('div');
        row.className = 'order-item-row';
        row.innerHTML = `
          <div class="order-item-info">
            <span class="order-item-title">${item.name}</span>
            <span class="order-item-meta">${item.variantLabel} &bull; ${formatCOP(item.price)} c/u</span>
          </div>
          <div class="order-item-controls">
            <button type="button" class="qty-btn dec-qty" data-index="${index}">-</button>
            <span class="qty-num">${item.quantity}</span>
            <button type="button" class="qty-btn inc-qty" data-index="${index}">+</button>
            <button type="button" class="remove-item-btn" data-index="${index}" aria-label="Quitar item">&times;</button>
          </div>
        `;
        orderItemsList.appendChild(row);
      });
    }

    if (orderTotalPriceEl) orderTotalPriceEl.textContent = formatCOP(total);
    updateWhatsAppUrl();
  }

  function updateWhatsAppUrl() {
    if (!sendOrderWaBtn) return;
    if (state.order.length === 0) {
      sendOrderWaBtn.href = "#";
      return;
    }

    let lines = ["Hola! Quiero hacer este pedido:"];
    let total = 0;

    state.order.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      lines.push(`- ${item.name} (${item.variantLabel}) x${item.quantity} = ${formatCOP(itemTotal)}`);
    });

    lines.push(`Total estimado: ${formatCOP(total)}`);
    lines.push("¿Me confirman disponibilidad y forma de entrega?");

    const fullMessage = lines.join("\n");
    sendOrderWaBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;
  }

  function buySingleViaWhatsApp(productId) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (!card) return;
    const variantIndex = parseInt(card.dataset.selectedVariant || "0", 10);
    const product = PRODUCTS.find(p => p.id === productId);
    const variant = product.variants[variantIndex];

    const message = `Hola! Quiero hacer este pedido:\n- ${product.name} (${variant.label}) x1 = ${formatCOP(variant.price)}\nTotal estimado: ${formatCOP(variant.price)}\n¿Me confirman disponibilidad y forma de entrega?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  function openModal() {
    if (state.order.length === 0) return;
    renderModalItems();
    modalOverlay?.classList.add('open');
    modalOverlay?.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modalOverlay?.classList.remove('open');
    modalOverlay?.setAttribute('aria-hidden', 'true');
  }

  // Event Listeners for Order Actions
  document.addEventListener('click', e => {
    // Add to order button
    const addBtn = e.target.closest('.add-to-order-btn');
    if (addBtn) {
      addToOrder(addBtn.dataset.id);
      return;
    }

    // Direct Buy Now WhatsApp button
    const buyWaBtn = e.target.closest('.buy-now-wa-btn');
    if (buyWaBtn) {
      buySingleViaWhatsApp(buyWaBtn.dataset.id);
      return;
    }

    // Header WhatsApp CTA button
    const headerWaBtn = e.target.closest('#header-wa-btn');
    if (headerWaBtn) {
      if (state.order.length > 0) {
        openModal();
      } else {
        const text = "Hola! Quisiera información sobre su cosecha de miel artesanal en Tocancipá.";
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
      }
      return;
    }

    // Floating Order Button
    if (e.target.closest('#whatsapp-order-float')) {
      openModal();
      return;
    }

    // Close Modal Button
    if (e.target.closest('#close-modal-btn') || e.target === modalOverlay) {
      closeModal();
      return;
    }

    // Modal Qty controls & item removal
    const incBtn = e.target.closest('.inc-qty');
    if (incBtn) {
      const idx = parseInt(incBtn.dataset.index, 10);
      if (state.order[idx]) {
        state.order[idx].quantity += 1;
        updateOrderUI();
      }
      return;
    }

    const decBtn = e.target.closest('.dec-qty');
    if (decBtn) {
      const idx = parseInt(decBtn.dataset.index, 10);
      if (state.order[idx]) {
        state.order[idx].quantity -= 1;
        if (state.order[idx].quantity <= 0) {
          state.order.splice(idx, 1);
        }
        updateOrderUI();
      }
      return;
    }

    const removeBtn = e.target.closest('.remove-item-btn');
    if (removeBtn) {
      const idx = parseInt(removeBtn.dataset.index, 10);
      state.order.splice(idx, 1);
      updateOrderUI();
      return;
    }
  });

  // Esc Key to close modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) {
      closeModal();
    }
  });

  // Smooth Scroll Anchor Navigation
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor && anchor.getAttribute('href') !== '#') {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      e.preventDefault();
      let targetScroll = 0;

      if (targetId === '#cinema' || targetId === '#home') {
        targetScroll = 0;
      } else if (targetId === '#shop') {
        const shopEl = document.getElementById('shop');
        targetScroll = shopEl ? shopEl.offsetTop - 70 : 1500;
      } else if (targetId === '#nosotros') {
        const nosEl = document.getElementById('nosotros');
        targetScroll = nosEl ? nosEl.offsetTop - 70 : 2200;
      } else if (targetId === '#comprar') {
        const compEl = document.getElementById('comprar');
        targetScroll = compEl ? compEl.offsetTop - 70 : 2800;
      }

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  });

  const exploreShopBtn = document.getElementById('explore-shop-btn');
  if (exploreShopBtn) {
    exploreShopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const shopEl = document.getElementById('shop');
      window.scrollTo({
        top: shopEl ? shopEl.offsetTop - 70 : 1500,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     7. Ambient Floating Bees Particle Canvas
     ========================================================================== */
  function initAmbientBees() {
    const canvas = document.getElementById('ambient-bees-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particleCount = window.innerWidth <= 768 ? 10 : 24;
    const bees = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: 2 + Math.random() * 2,
      pulse: Math.random() * Math.PI * 2
    }));

    function drawBees() {
      ctx.clearRect(0, 0, width, height);

      bees.forEach(b => {
        b.pulse += 0.05;
        b.x += b.vx + Math.sin(b.pulse) * 0.5;
        b.y += b.vy + Math.cos(b.pulse) * 0.5;

        if (b.x < 0) b.x = width;
        if (b.x > width) b.x = 0;
        if (b.y < 0) b.y = height;
        if (b.y > height) b.y = 0;

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius + Math.sin(b.pulse) * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f59e0b';
        ctx.fill();
      });

      requestAnimationFrame(drawBees);
    }

    drawBees();
  }

  /* Initialization */
  document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initAmbientBees();
    renderLoop();
  });

})();
