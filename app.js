// Selecciona los logos
const logos = document.querySelectorAll('.logo');
const container = document.querySelector('.banner');

// Crea la animación al hacer hover
container.addEventListener('mouseenter', () => {
  logos.forEach((logo) => {
    const randomX = Math.random() * 200 - 100; // Valores aleatorios
    const randomY = Math.random() * 200 - 100;
    gsap.to(logo, {
      x: randomX,
      y: randomY,
      rotation: Math.random() * 360,
      duration: 0.5,
    });
  });
});

// Vuelve a su posición original
container.addEventListener('mouseleave', () => {
  gsap.to(logos, {
    x: 0,
    y: 0,
    rotation: 0,
    duration: 0.5,
  });
});
