/**
 * Honey Harvest — Cinematic Parallax Engine & Interactive Web Application
 * Vanilla JS (ES6+) — Lightweight, ultra-smooth RAF animation engine
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Mathematical Helper Functions
     ========================================================================== */

  /** Linear Interpolation */
  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  /** Clamp number between min and max */
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  /** Smoothstep interpolation (0 to 1) */
  function smoothstep(min, max, value) {
    const x = clamp((value - min) / (max - min), 0, 1);
    return x * x * (3 - 2 * x);
  }

  /** Segment progress helper: returns normalized [0, 1] value for a scroll sub-range */
  function segmentProgress(scroll, start, end) {
    if (scroll <= start) return 0;
    if (scroll >= end) return 1;
    return (scroll - start) / (end - start);
  }

  /** Segment In/Out progress helper: fades in then fades out over specified ranges */
  function segmentInOut(scroll, fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd) {
    if (scroll < fadeInStart) return 0;
    if (scroll <= fadeInEnd) return smoothstep(fadeInStart, fadeInEnd, scroll);
    if (scroll < fadeOutStart) return 1;
    if (scroll <= fadeOutEnd) return 1 - smoothstep(fadeOutStart, fadeOutEnd, scroll);
    return 0;
  }

  /* ==========================================================================
     2. Internationalization Dictionaries (EN / ES)
     ========================================================================== */
  const i18n = {
    en: {
      nav_home: "Home",
      nav_beehives: "Beehives",
      nav_harvest: "Process",
      nav_shop: "Shop",
      hero_subtitle: "From wildflower fields to your table. Raw, unfiltered, and crafted by nature's smallest architects.",
      tag_raw: "Raw & Unfiltered",
      tag_natural: "100% Natural",
      tag_artisan: "Artisan Sourced",
      scroll_explore: "Scroll to Explore",
      panel1_kicker: "OUR APIARY",
      panel1_title: "The hive is where it begins.",
      panel1_desc: "Thousands of bees working in concert, collecting nectar from wildflower fields across the countryside. Each colony is a carefully balanced ecosystem we nurture with respect from spring to harvest.",
      fact1_label: "Bees per healthy hive",
      fact2_label: "Active foraging season",
      panel2_kicker: "PURE EXTRACTION",
      panel2_title: "Every drop tells a story.",
      panel2_desc: "We harvest only when the honey is perfectly mature, sealed by bees in wax. No high heating, no micro-filtering beyond what nature requires. This is real honey—rich with pollen, enzymes, and the unique terroir of seasonal blooms.",
      panel2_cta: "↗ Explore our collection",
      card1_kicker: "Seasonal Harvest",
      card1_title: "Raw Spring Honey",
      card1_desc: "First nectar of the season. Light, delicate floral notes from early wildflower blooms.",
      card2_kicker: "Field Selection",
      card2_title: "Wildflower Gold",
      card2_desc: "Complex, deep amber. Our signature blend harvested from rich, diverse summer pastures.",
      card3_kicker: "Artisan Texture",
      card3_title: "Honey Butter Cream",
      card3_desc: "Slow-whipped pure honey crystallized into a velvety, spreadable dream. Melts effortlessly.",
      card4_kicker: "Natural Remedy",
      card4_title: "Bee's Shield Propolis",
      card4_desc: "Raw propolis extract tincture. Used by bees to protect the hive; packed with natural antioxidants.",
      card5_kicker: "Traditional",
      card5_title: "Pure Cut Honeycomb",
      card5_desc: "Raw honey sealed in virgin beeswax. 100% edible comb cut directly from hive frames.",
      add_to_cart: "Add to Cart",
      cart_title: "Your Honey Basket",
      empty_cart: "Your basket is currently empty.",
      subtotal: "Subtotal",
      checkout: "Proceed to Checkout",
      footer_motto: "Sustainably collected, ethically crafted, 100% pure artisan honey.",
      footer_col1_title: "Explore",
      footer_col2_title: "Philosophy",
      footer_p1: "Zero Chemical Sprays",
      footer_p2: "Cold Extracted",
      footer_p3: "Bee Welfare First",
      added_toast: "added to your basket!",
      shop_kicker: "ARTISAN SELECTION",
      shop_main_title: "Pure Honey & Apiary Collection",
      shop_main_subtitle: "Harvested in small batches with total respect for the bees and nature."
    },
    es: {
      nav_home: "Inicio",
      nav_beehives: "Colmenas",
      nav_harvest: "Proceso",
      nav_shop: "Tienda",
      hero_subtitle: "De campos de flores silvestres a tu mesa. Pura, sin filtrar y elaborada por los arquitectos más pequeños de la naturaleza.",
      tag_raw: "Cruda y Sin Filtrar",
      tag_natural: "100% Natural",
      tag_artisan: "Origen Artesanal",
      scroll_explore: "Desliza para Explorar",
      panel1_kicker: "NUESTRO APICULTURA",
      panel1_title: "En la colmena comienza todo.",
      panel1_desc: "Miles de abejas trabajando en armonía, recolectando néctar de flores silvestres. Cada colonia es un ecosistema cuidadosamente nutrido con respeto desde la primavera hasta la cosecha.",
      fact1_label: "Abejas por colmena sana",
      fact2_label: "Meses de temporada activa",
      panel2_kicker: "EXTRACCIÓN PURA",
      panel2_title: "Cada gota cuenta una historia.",
      panel2_desc: "Cosechamos solo cuando la miel está perfectamente madura y sellada en cera por las abejas. Sin pasteurizar y sin microfiltrar. Miel auténtica, rica en polen, enzimas y terpenos naturales.",
      panel2_cta: "↗ Explorar nuestra colección",
      card1_kicker: "Cosecha de Temporada",
      card1_title: "Miel Cruda de Primavera",
      card1_desc: "Primer néctar de la estación. Notas florales suaves y delicadas de las primeras floraciones.",
      card2_kicker: "Selección de Campo",
      card2_title: "Oro de Flores Silvestres",
      card2_desc: "Ámbar profundo y complejo. Nuestra mezcla emblemática recolectada en prados de verano.",
      card3_kicker: "Textura Artesanal",
      card3_title: "Crema de Miel y Manteca",
      card3_desc: "Miel pura batida lentamente hasta lograr una textura suave y untable que se derrite al paladar.",
      card4_kicker: "Remedio Natural",
      card4_title: "Propóleo Escudo de Abeja",
      card4_desc: "Tintura de extracto puro de propóleo. Utilizado por las abejas para proteger la colmena; lleno de antioxidantes.",
      card5_kicker: "Tradicional",
      card5_title: "Panal de Miel Puro",
      card5_desc: "Miel cruda sellada en cera virgen de abejas. Panal 100% comestible cortado directo de los marcos.",
      add_to_cart: "Añadir al Carrito",
      cart_title: "Tu Cesta de Miel",
      empty_cart: "Tu cesta está vacía actualmente.",
      subtotal: "Subtotal",
      checkout: "Proceder al Pago",
      footer_motto: "Recolectada de forma sostenible, elaborada éticamente, miel 100% artesanal y pura.",
      footer_col1_title: "Explorar",
      footer_col2_title: "Filosofía",
      footer_p1: "Sin Químicos ni Pesticidas",
      footer_p2: "Extracción en Frío",
      footer_p3: "Bienestar Apícola Primero",
      added_toast: "¡añadido a tu cesta!",
      shop_kicker: "SELECCIÓN ARTESANAL",
      shop_main_title: "Colección de Miel Pura y Apicultura",
      shop_main_subtitle: "Cosechada en lotes pequeños con total respeto por las abejas y la naturaleza."
    }
  };

  let currentLang = 'en';

  function updateLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang][key]) {
        el.textContent = i18n[lang][key];
      }
    });

    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('lang-es').classList.toggle('active', lang === 'es');
  }

  /* ==========================================================================
     3. State Management & DOM Elements
     ========================================================================== */
  const root = document.documentElement;
  const cinemaScroll = document.getElementById('cinema');
  const sliderTrack = document.getElementById('slider-track');
  const sliderDots = document.getElementById('slider-dots');
  const exploreShopBtn = document.getElementById('explore-shop-btn');

  // Interactive Target Values vs Lerped Values
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
    sliderIndex: 0,
    cart: []
  };

  /* ==========================================================================
     4. Choreography Engine (Scroll Parallax Physics Loop)
     ========================================================================== */

  function updateScrollChoreography(scroll) {
    // Total scroll distance for cinematic stage is ~1500px (fast, responsive)

    // --- ACT 1: Hero & Intro Title (0px - 350px) ---
    const titleProgress = segmentProgress(scroll, 0, 320);
    const titleY = titleProgress * -220; // Title ascends
    const titleScale = 1 + titleProgress * 0.25;
    const titleOpacity = 1 - smoothstep(120, 320, scroll);

    const introProgress = segmentProgress(scroll, 0, 280);
    const introCopyY = introProgress * 140; // Intro copy sinks
    const introCopyOpacity = 1 - smoothstep(80, 260, scroll);

    // --- ACT 2 Panel 1: Beehives & Extraction ---
    const splitOpen = smoothstep(240, 500, scroll);
    const splitLeftX = (1 - splitOpen) * -100;
    const splitRightX = (1 - splitOpen) * 100;

    // --- FLYING BEE SCROLL FLIGHT PATH & MULTI-POSE CHOREOGRAPHY ---
    let beeX, beeY, beeScale, beeRotate, bridgeOpacity;

    // Interactive mouse displacement for living creature effect
    const mouseShiftX = state.mouseXCurrent * 22; // vw offset
    const mouseShiftY = state.mouseYCurrent * 35; // px offset

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

    // Dynamic Multi-Pose Continuous Morphing according to scroll stage
    const pose1El = document.getElementById('bee-pose-1');
    const pose2El = document.getElementById('bee-pose-2');
    const pose3El = document.getElementById('bee-pose-3');

    // Continuous smooth opacity transitions across scroll
    const p1Opacity = 1 - smoothstep(180, 440, scroll);
    const p2Opacity = segmentInOut(scroll, 240, 480, 680, 880);
    const p3Opacity = smoothstep(680, 880, scroll);

    if (pose1El) pose1El.style.opacity = p1Opacity.toFixed(3);
    if (pose2El) pose2El.style.opacity = p2Opacity.toFixed(3);
    if (pose3El) pose3El.style.opacity = p3Opacity.toFixed(3);

    // Flowing honey / frame two drip opacity
    const frame2Opacity = segmentInOut(scroll, 400, 600, 850, 1050);

    // Story Panel 1 Visibility ("En la colmena comienza todo")
    const panel2Opacity = segmentInOut(scroll, 260, 480, 680, 840);
    const panel2Y = lerp(40, 0, smoothstep(260, 480, scroll)) + (scroll > 680 ? (scroll - 680) * -0.15 : 0);

    // Story Panel 2 Visibility ("Cada gota cuenta una historia")
    const panel3Opacity = segmentInOut(scroll, 680, 880, 1180, 1400);
    const panel3Y = lerp(40, 0, smoothstep(680, 880, scroll)) + (scroll > 1180 ? (scroll - 1180) * -0.15 : 0);

    // Wildflower field saturation boost
    const bazaarSat = lerp(0.8, 1.4, segmentInOut(scroll, 680, 900, 1180, 1400));
    const bazaarBright = lerp(0.9, 1.15, segmentInOut(scroll, 680, 900, 1180, 1400));

    // Apply values to CSS Custom Properties `:root`
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
    const shopEl = document.getElementById('shop');
    navLinks.forEach(link => link.classList.remove('active'));

    const shopOffset = shopEl ? shopEl.offsetTop - 180 : 1500;

    if (scroll >= shopOffset) {
      document.querySelector('.nav-link[href="#shop"]')?.classList.add('active');
    } else if (scroll < 260) {
      document.querySelector('.nav-link[href="#cinema"]')?.classList.add('active');
    } else if (scroll < 680) {
      document.querySelector('.nav-link[href="#beehives"]')?.classList.add('active');
    } else {
      document.querySelector('.nav-link[href="#harvest"]')?.classList.add('active');
    }
  }

  const isMobileDevice = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* Main Animation Loop */
  function renderLoop() {
    state.scrollTarget = window.scrollY || window.pageYOffset;

    if (isMobileDevice) {
      // Direct 1:1 scroll for mobile (zero input lag, native touch momentum)
      state.scrollCurrent = state.scrollTarget;
      updateScrollChoreography(state.scrollCurrent);
    } else {
      // Fast desktop lerp tracking
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

  // Spotlight Mask Tracking (Mouse & Touch Events)
  function updateSpotlightCoordinates(clientX, clientY) {
    if (isMobileDevice) return; // Skip spotlight calculation overhead on mobile GPUs
    const x = clamp((clientX / window.innerWidth) * 100, 0, 100);
    const y = clamp((clientY / window.innerHeight) * 100, 0, 100);

    state.spotlightTargetX = x;
    state.spotlightTargetY = y;
  }

  const cursorRing = document.getElementById('cursor-ring');
  const siteHeaderEl = document.querySelector('.site-header');
  let lastRecordedScrollY = window.scrollY || 0;

  // Auto-hide header when scrolling down, reveal when scrolling up
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY || 0;
    if (currentY > 140 && currentY > lastRecordedScrollY + 8) {
      siteHeaderEl?.classList.add('header-hidden');
    } else if (currentY < lastRecordedScrollY - 8 || currentY <= 80) {
      siteHeaderEl?.classList.remove('header-hidden');
    }
    lastRecordedScrollY = currentY;
  }, { passive: true });

  // Mouse Move & Touch tracking with interactive target ring scaling
  window.addEventListener('mousemove', e => {
    state.mouseXTarget = (e.clientX / window.innerWidth - 0.5) * 2;
    state.mouseYTarget = (e.clientY / window.innerHeight - 0.5) * 2;
    updateSpotlightCoordinates(e.clientX, e.clientY);

    // Auto-reveal header when cursor approaches top 90px
    if (e.clientY < 90) {
      siteHeaderEl?.classList.remove('header-hidden');
    }

    if (cursorRing) {
      const isHoverable = e.target.closest('a, button, .sight-card, .tag-badge, .nav-link, .cart-trigger, .site-header');
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

  window.addEventListener('touchmove', e => {
    if (e.touches && e.touches[0]) {
      updateSpotlightCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  /* ==========================================================================
     5. Product Slider Controls & Touch Swipe
     ========================================================================== */
  const cardCount = 5;

  function updateSliderPosition() {
    const cardEl = document.querySelector('.sight-card');
    const cardWidth = cardEl ? cardEl.offsetWidth + 28 : (window.innerWidth <= 900 ? 308 : 348);
    const shift = -state.sliderIndex * cardWidth;
    root.style.setProperty('--sights-shift', `${shift}px`);

    if (sliderDots) {
      const dots = sliderDots.querySelectorAll('.dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === state.sliderIndex);
      });
    }
  }

  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.sliderIndex = (state.sliderIndex - 1 + cardCount) % cardCount;
      updateSliderPosition();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.sliderIndex = (state.sliderIndex + 1) % cardCount;
      updateSliderPosition();
    });
  }

  if (sliderDots) {
    sliderDots.addEventListener('click', e => {
      if (e.target.classList.contains('dot')) {
        e.preventDefault();
        state.sliderIndex = parseInt(e.target.dataset.index, 10);
        updateSliderPosition();
      }
    });
  }

  // Touch Swipe & Mouse Drag Support for Product Slider
  const sliderEl = document.querySelector('.sights-slider');
  if (sliderEl) {
    let startX = 0;
    let isDragging = false;

    sliderEl.addEventListener('touchstart', e => {
      if (e.touches && e.touches[0]) {
        startX = e.touches[0].clientX;
        isDragging = true;
      }
    }, { passive: true });

    sliderEl.addEventListener('touchend', e => {
      if (!isDragging || !e.changedTouches || !e.changedTouches[0]) return;
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          state.sliderIndex = (state.sliderIndex + 1) % cardCount;
        } else {
          state.sliderIndex = (state.sliderIndex - 1 + cardCount) % cardCount;
        }
        updateSliderPosition();
      }
      isDragging = false;
    }, { passive: true });
  }

  // Smooth Scroll Navigation for all anchor links & buttons
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      let targetScroll = 0;

      if (targetId === '#cinema' || targetId === '#home') {
        targetScroll = 0;
      } else if (targetId === '#beehives') {
        targetScroll = 590;
      } else if (targetId === '#harvest' || targetId === '#process') {
        targetScroll = 880;
      } else if (targetId === '#shop') {
        const shopEl = document.getElementById('shop');
        targetScroll = shopEl ? shopEl.offsetTop - 70 : 1600;
      }

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  });

  // Smooth Scroll CTA button
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
     6. Shopping Cart & Drawer Logic
     ========================================================================== */
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartBtn = document.getElementById('cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemList = document.getElementById('cart-item-list');
  const emptyCartMsg = document.getElementById('empty-cart-msg');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartCountEl = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');

  function openCart() {
    cartDrawerOverlay.classList.add('open');
  }

  function closeCart() {
    cartDrawerOverlay.classList.remove('open');
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', e => {
      if (e.target === cartDrawerOverlay) closeCart();
    });
  }

  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  function renderCart() {
    if (!cartItemList) return;
    cartItemList.innerHTML = '';
    let total = 0;
    let count = 0;

    if (state.cart.length === 0) {
      if (emptyCartMsg) emptyCartMsg.style.display = 'block';
    } else {
      if (emptyCartMsg) emptyCartMsg.style.display = 'none';
      state.cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        count += item.quantity;

        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
          <div class="cart-item-info">
            <span class="cart-item-title">${item.name}</span>
            <span class="cart-item-price">$${item.price.toFixed(2)} c/u</span>
          </div>
          <div class="cart-item-controls">
            <div class="qty-controls">
              <button class="qty-btn dec-btn" data-id="${item.id}">-</button>
              <span class="qty-num">${item.quantity}</span>
              <button class="qty-btn inc-btn" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item-btn" data-id="${item.id}" aria-label="Eliminar item">&times;</button>
          </div>
        `;
        cartItemList.appendChild(li);
      });
    }

    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${total.toFixed(2)}`;
    if (cartCountEl) cartCountEl.textContent = count;
  }

  function addToCart(id, name, price) {
    const existing = state.cart.find(i => i.id === id);
    if (existing) {
      existing.quantity++;
    } else {
      state.cart.push({ id, name, price: parseFloat(price), quantity: 1 });
    }
    renderCart();
    showToast(`${name} ${currentLang === 'es' ? 'agregado a tu cesta' : 'added to basket'}`);
  }

  document.addEventListener('click', e => {
    if (e.target.classList.contains('add-cart-btn')) {
      const btn = e.target;
      addToCart(btn.dataset.id, btn.dataset.name, btn.dataset.price);
    } else if (e.target.classList.contains('inc-btn')) {
      const item = state.cart.find(i => i.id === e.target.dataset.id);
      if (item) { item.quantity++; renderCart(); }
    } else if (e.target.classList.contains('dec-btn')) {
      const item = state.cart.find(i => i.id === e.target.dataset.id);
      if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
          state.cart = state.cart.filter(i => i.id !== e.target.dataset.id);
        }
        renderCart();
      }
    } else if (e.target.classList.contains('remove-item-btn')) {
      state.cart = state.cart.filter(i => i.id !== e.target.dataset.id);
      renderCart();
    }
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (state.cart.length === 0) {
        alert(currentLang === 'es' ? 'Tu cesta está vacía.' : 'Your basket is empty.');
        return;
      }
      showToast(currentLang === 'es' ? '¡Gracias por tu pedido artesanal!' : 'Thank you for your artisan order!');
      state.cart = [];
      renderCart();
      closeCart();
    });
  }

  // Language Switcher Event
  const langBtn = document.getElementById('lang-switcher');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      updateLanguage(currentLang === 'en' ? 'es' : 'en');
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

  /* Initialize Application */
  document.addEventListener('DOMContentLoaded', () => {
    initAmbientBees();
    updateSliderPosition();
    renderLoop();
  });

})();
