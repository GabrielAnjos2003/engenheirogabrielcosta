const siteHeader = document.querySelector('.site-header');
const scrollProgress = document.getElementById('scrollProgress');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

function updatePageState() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

  siteHeader.classList.toggle('scrolled', window.scrollY > 24);
  scrollProgress.style.width = `${progress}%`;
}

window.addEventListener('scroll', updatePageState, { passive: true });
updatePageState();

function setMenuOpen(isOpen) {
  navLinks.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(!navLinks.classList.contains('open'));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navLinks.classList.contains('open')) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
}

const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.tab;

    tabButtons.forEach(item => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    tabPanels.forEach(panel => {
      const isActive = panel.id === targetId;
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;
    });
  });
});

tabButtons.forEach((button, index) => {
  button.addEventListener('keydown', event => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabButtons.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabButtons.length - 1;
    else return;
    event.preventDefault();
    tabButtons[nextIndex].focus();
    tabButtons[nextIndex].click();
  });
});

document.querySelectorAll('[data-slider]').forEach(slider => {
  const slides = [...slider.querySelectorAll('.project-slide')];
  if (!slides.length) return;

  const dotsContainer = slider.querySelector('.slider-dots');
  const previousButton = slider.querySelector('.prev');
  const nextButton = slider.querySelector('.next');
  const category = slider.closest('.tab-panel')?.querySelector('.stage-label')?.textContent.trim();
  const positionLabel = document.createElement('span');
  positionLabel.className = 'slider-position';
  positionLabel.setAttribute('role', 'status');
  positionLabel.setAttribute('aria-live', 'polite');
  positionLabel.setAttribute('aria-atomic', 'true');
  slider.querySelector('.slider-controls').prepend(positionLabel);

  slider.tabIndex = 0;
  slider.setAttribute('role', 'region');
  slider.setAttribute('aria-label', category ? `Galeria: ${category}` : 'Galeria de registros');
  previousButton.setAttribute('aria-label', 'Registro anterior');
  nextButton.setAttribute('aria-label', 'Próximo registro');
  dotsContainer.setAttribute('aria-label', 'Indicadores dos registros');

  let currentIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-label', `Registro ${index + 1} de ${slides.length}`);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Mostrar registro ${index + 1} de ${slides.length}`);
    dot.addEventListener('click', () => showSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = [...dotsContainer.querySelectorAll('button')];

  function showSlide(index) {
    const nextIndex = (index + slides.length) % slides.length;
    const shouldMoveFocus = nextIndex !== currentIndex && slides[currentIndex].contains(document.activeElement);
    currentIndex = nextIndex;

    if (shouldMoveFocus) slider.focus({ preventScroll: true });

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.inert = !isActive;
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle('active', isActive);
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    positionLabel.textContent = String(currentIndex + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    positionLabel.setAttribute('aria-label', `Registro ${currentIndex + 1} de ${slides.length}`);
  }

  previousButton.addEventListener('click', () => showSlide(currentIndex - 1));
  nextButton.addEventListener('click', () => showSlide(currentIndex + 1));

  slider.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showSlide(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
  });

  slider.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  }, { passive: true });

  slider.addEventListener('touchend', event => {
    const movementX = event.changedTouches[0].clientX - touchStartX;
    const movementY = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(movementX) > 45 && Math.abs(movementX) > Math.abs(movementY)) {
      showSlide(currentIndex + (movementX < 0 ? 1 : -1));
    }
  }, { passive: true });

  showSlide(0);
});

document.getElementById('currentYear').textContent = new Date().getFullYear();
