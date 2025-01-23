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