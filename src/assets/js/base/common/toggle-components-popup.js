export default function toggleComponentsPopup() {
  const previews = document.querySelectorAll('.preview');
  const modal = document.querySelector('.image-modal');
  const modalImg = document.querySelector('.image-modal__img');

  // если нет картинок или модалки — просто выходим
  if (!previews.length || !modal || !modalImg) {
    return;
  }

  previews.forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modal.classList.add('active');
    });
  });

  modal.addEventListener('click', () => {
    modal.classList.remove('active');
  });
}
toggleComponentsPopup();