

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });
  // Ajout de l'écouteur pour le formulaire de contact
  document.querySelector('.php-email-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire
  
    const form = event.target;
    const formData = new FormData(form);
  
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.ok) {
          // Affiche un message de confirmation sans rediriger
          document.querySelector('.sent-message').style.display = 'block';
          form.reset(); // Réinitialise le formulaire après envoi
          setTimeout(() => {
            document.querySelector('.sent-message').style.display = 'none'; // Cache le message après 5 secondes
          }, 5000);
        
        } else {
          document.querySelector('.error-message').textContent = "Une erreur est survenue lors de l'envoi du message.";
        }
      } else {
        document.querySelector('.error-message').textContent = "Une erreur est survenue lors de l'envoi du message.";
      }
    } catch (error) {
      document.querySelector('.error-message').textContent = "Une erreur s'est produite.";
    }
  });
  document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();  // Empêche l'action par défaut
      window.open(this.href, '_blank');  // Ouvre le lien dans un nouvel onglet
    });
  });


  // Fonction pour changer la langue
  async function changeLanguage(lang) {
   try {
        const response = await fetch(`lang/${lang}.json`);
        const translations = await response.json();

      document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      element.textContent = translations[key];
    });

    // Stocker la langue dans localStorage
      localStorage.setItem('lang', lang);
    } catch (error) {
      console.error('Error loading translation file:', error);
    }
 }

   // Ajouter des événements de clic pour les drapeaux
   document.getElementById('lang-en').addEventListener('click', () => {
       changeLanguage('en');
    });

   document.getElementById('lang-fr').addEventListener('click', () => {
       changeLanguage('fr');
    });

  // Charger la langue sauvegardée lors du chargement de la page
   document.addEventListener('DOMContentLoaded', () => {
      const savedLang = localStorage.getItem('lang') || 'fr'; // 'fr' est la langue par défaut
      changeLanguage(savedLang);
    });


  // code de jeu

  const canvas = document.getElementById("pong");
  const ctx = canvas.getContext("2d");
  
  const user = {
      x: 0,
      y: canvas.height / 2 - 50,
      width: 10,
      height: 100,
      color: "WHITE",
      score: 0
  };
  
  const com = {
      x: canvas.width - 10,
      y: canvas.height / 2 - 50,
      width: 10,
      height: 100,
      color: "WHITE",
      score: 0
  };
  
  const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 10,
      speed: 5,
      velocityX: 5,
      velocityY: 5,
      color: "WHITE"
  };
  
  canvas.addEventListener("mousemove", movePaddle);
  
  function movePaddle(evt){
      let rect = canvas.getBoundingClientRect();
      user.y = evt.clientY - rect.top - user.height / 2;
  }
  
  function drawRect(x, y, w, h, color){
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
  }
  
  function drawCircle(x, y, r, color){
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
  }
  
  function drawText(text, x, y, color){
      ctx.fillStyle = color;
      ctx.font = "35px Arial";
      ctx.fillText(text, x, y);
  }
  
  function collision(b, p){
      p.top = p.y;
      p.bottom = p.y + p.height;
      p.left = p.x;
      p.right = p.x + p.width;
  
      b.top = b.y - b.radius;
      b.bottom = b.y + b.radius;
      b.left = b.x - b.radius;
      b.right = b.x + b.radius;
  
      return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
  }
  
  function resetBall(){
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.speed = 5;
      ball.velocityX = -ball.velocityX;
  }
  
  function update(){
      ball.x += ball.velocityX;
      ball.y += ball.velocityY;
  
      if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
          ball.velocityY = -ball.velocityY;
      }
  
      let player = (ball.x < canvas.width / 2) ? user : com;
  
      if(collision(ball, player)){
          let collidePoint = ball.y - (player.y + player.height / 2);
          collidePoint = collidePoint / (player.height / 2);
  
          let angleRad = collidePoint * Math.PI / 4;
          let direction = (ball.x < canvas.width / 2) ? 1 : -1;
          ball.velocityX = direction * ball.speed * Math.cos(angleRad);
          ball.velocityY = ball.speed * Math.sin(angleRad);
          ball.speed += 0.5;
      }
  
      if(ball.x - ball.radius < 0){
          com.score++;
          resetBall();
      } else if(ball.x + ball.radius > canvas.width){
          user.score++;
          resetBall();
      }
  
      com.y += (ball.y - (com.y + com.height / 2)) * 0.1;
  }
  
  function render(){
      drawRect(0, 0, canvas.width, canvas.height, "#000");
      drawText(user.score, canvas.width/4, canvas.height/5, "WHITE");
      drawText(com.score, 3*canvas.width/4, canvas.height/5, "WHITE");
  
      drawRect(user.x, user.y, user.width, user.height, user.color);
      drawRect(com.x, com.y, com.width, com.height, com.color);
      drawCircle(ball.x, ball.y, ball.radius, ball.color);
  }
  
  function game(){
      update();
      render();
  }
  
  let framePerSecond = 60;
  setInterval(game, 1000 / framePerSecond);
  


  
  
  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();