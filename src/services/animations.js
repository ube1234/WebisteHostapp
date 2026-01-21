export function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in'); // Or any other animation class
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
  });

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}
