// SWIPER JS

const swiper = new Swiper('.swiper', {
  loop: true, // Permite un bucle infinito
  autoplay: {
    delay: 1500, // Cambia de diapositiva cada 3 segundos
    disableOnInteraction: false, // Continúa el autoplay incluso si el usuario interactúa
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// ESCONDER FOOTER EN MOBILE VERSION

const hero = document.querySelector('.hero');
const footer = document.querySelector('.footer');

// Usar getComputedStyle para verificar si el footer está oculto
if (window.getComputedStyle(footer).display === "none") {
  footer.style.minHeight = "80dvh"; // Usa minHeight en lugar de min-height
}
