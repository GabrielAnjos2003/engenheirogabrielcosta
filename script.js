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

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

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
  const dotsContainer = slider.querySelector('.slider-dots');
  const previousButton = slider.querySelector('.prev');
  const nextButton = slider.querySelector('.next');
  const positionLabel = document.createElement('span');
  positionLabel.className = 'slider-position';
  slider.querySelector('.slider-controls').prepend(positionLabel);

  let currentIndex = 0;
  let timerId;
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
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
    positionLabel.textContent = String(currentIndex + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    positionLabel.setAttribute('aria-label', 'Projeto ' + (currentIndex + 1) + ' de ' + slides.length);
  }

  function startTimer() {
    window.clearInterval(timerId);
    timerId = window.setInterval(() => showSlide(currentIndex + 1), 3000);
  }

  function stopTimer() {
    window.clearInterval(timerId);
  }

  function restartTimer() {
    stopTimer();
    startTimer();
  }

  previousButton.addEventListener('click', () => {
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
    const movement = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(movement) > 45) {
      showSlide(currentIndex + (movement < 0 ? 1 : -1));
      restartTimer();
    }
  }, { passive: true });

  showSlide(0);
  startTimer();
});

document.getElementById('currentYear').textContent = new Date().getFullYear();
