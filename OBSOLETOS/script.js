const siteHeader = document.querySelector('.site-header');
const progressBar = document.getElementById('progressBar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

function handleScroll() {
  siteHeader.classList.toggle('scrolled', window.scrollY > 20);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Animação dos elementos ao entrar na tela.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

// Abas do portfólio.
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.tab;

    tabButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });

    tabPanels.forEach(panel => {
      const active = panel.id === targetId;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  });
});

// Sliders automáticos: troca a cada 3 segundos.
document.querySelectorAll('[data-slider]').forEach(slider => {
  const slides = [...slider.querySelectorAll('.project-slide')];
  const prevButton = slider.querySelector('.prev');
  const nextButton = slider.querySelector('.next');
  const dotsContainer = slider.querySelector('.slider-dots');
  let currentIndex = 0;
  let timer;
  let touchStartX = 0;

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Mostrar projeto ${index + 1}`);
    dot.addEventListener('click', () => {
      showSlide(index);
      restartTimer();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = [...dotsContainer.querySelectorAll('button')];

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === currentIndex));
    dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === currentIndex));
  }

  function startTimer() {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(currentIndex + 1), 3000);
  }

  function stopTimer() {
    window.clearInterval(timer);
  }

  function restartTimer() {
    stopTimer();
    startTimer();
  }

  prevButton.addEventListener('click', () => {
    showSlide(currentIndex - 1);
    restartTimer();
  });

  nextButton.addEventListener('click', () => {
    showSlide(currentIndex + 1);
    restartTimer();
  });

  slider.addEventListener('mouseenter', stopTimer);
  slider.addEventListener('mouseleave', startTimer);
  slider.addEventListener('focusin', stopTimer);
  slider.addEventListener('focusout', startTimer);

  slider.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', event => {
    const difference = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(difference) > 45) {
      showSlide(currentIndex + (difference < 0 ? 1 : -1));
      restartTimer();
    }
  }, { passive: true });

  showSlide(0);
  startTimer();
});

// Janela de detalhes dos projetos.
const projectModal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalTools = document.getElementById('modalTools');
const modalClose = projectModal.querySelector('.modal-close');
const modalContact = document.getElementById('modalContact');

document.querySelectorAll('.open-project').forEach(button => {
  button.addEventListener('click', () => {
    const project = button.closest('.project-slide');
    modalTitle.textContent = project.dataset.title;
    modalDescription.textContent = project.dataset.description;
    modalTools.textContent = project.dataset.tools;
    projectModal.showModal();
    document.body.classList.add('modal-open');
  });
});

function closeModal() {
  projectModal.close();
  document.body.classList.remove('modal-open');
}

modalClose.addEventListener('click', closeModal);
modalContact.addEventListener('click', closeModal);
projectModal.addEventListener('click', event => {
  const rect = projectModal.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) closeModal();
});

// Formulário: substitua o número abaixo pelo WhatsApp real, apenas com dígitos.
const WHATSAPP_NUMBER = '5500000000000';
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', event => {
  event.preventDefault();

  const name = document.getElementById('contactName').value.trim();
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value.trim();

  const text = `Olá, Gabriel! Meu nome é ${name}.\n\nAssunto: ${subject}.\n\n${message}\n\nConheci seu trabalho pelo portfólio.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

document.getElementById('currentYear').textContent = new Date().getFullYear();
