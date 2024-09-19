

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

  const canvas = document.getElementById('pong');
  const context = canvas.getContext('2d');
  
  // Créer les raquettes et la balle
  const paddleWidth = 10, paddleHeight = 100;
  const ballRadius = 10;
  let playerScore = 0;
  let computerScore = 0;
  
  let player = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight };
  let computer = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight };
  let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: ballRadius, speed: 5, dx: 3, dy: 3 };
  
  // Contrôle du joueur avec la souris
  canvas.addEventListener('mousemove', (event) => {
    const canvasPosition = canvas.getBoundingClientRect();
    player.y = event.clientY - canvasPosition.top - paddleHeight / 2;
  
    // Limiter le joueur à l'intérieur du canvas
    if (player.y < 0) player.y = 0;
    if (player.y + paddleHeight > canvas.height) player.y = canvas.height - paddleHeight;
  });
  
  // Dessiner les objets
  function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  }
  
  function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }
  
  // Mettre à jour le score
  function updateScore() {
    document.getElementById('score').innerText = `Joueur: ${playerScore} | Ordinateur: ${computerScore}`;
  }
  
  // Détection de collision
  function collision(paddle, ball) {
    return ball.x < paddle.x + paddle.width && ball.x + ball.radius > paddle.x &&
           ball.y < paddle.y + paddle.height && ball.y + ball.radius > paddle.y;
  }
  
  // Mettre à jour la position des objets
  function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;
  
    // Collision avec le haut et le bas du canvas pour la balle
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.dy *= -1; // Inverse la direction verticale
    }
  
    // Collision avec les raquettes
    if (collision(player, ball)) {
      ball.dx *= -1; // Inverse la direction horizontale
    }
    if (collision(computer, ball)) {
      ball.dx *= -1; // Inverse la direction horizontale
    }
  
    // Déplacement de l'ordinateur (AI basique)
    computer.y = ball.y - paddleHeight / 2;
  
    // Si la balle sort du côté de l'ordinateur
    if (ball.x + ball.radius > canvas.width) {
      playerScore++;
      resetBall();
      updateScore();
    }
  
    // Si la balle sort du côté du joueur
    if (ball.x - ball.radius < 0) {
      computerScore++;
      resetBall();
      updateScore();
    }
  }
  
  // Réinitialiser la balle au centre
  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1; // Change la direction
  }
  
  // Dessiner tous les éléments
  function draw() {
    drawRect(0, 0, canvas.width, canvas.height, '#000'); // Fond noir
    drawRect(player.x, player.y, player.width, player.height, '#fff'); // Joueur
    drawRect(computer.x, computer.y, computer.width, computer.height, '#fff'); // Ordinateur
    drawCircle(ball.x, ball.y, ball.radius, '#fff'); // Balle
  }
  
  // Boucle du jeu
  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
  
  gameLoop(); // Démarrer le jeu
  


  
  
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