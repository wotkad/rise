import gsap from "gsap";

function renderPage() {
  const render = $(".render");
  if (!render.length) return;

  gsap.to(render, {
    opacity: 0,
    duration: 0.5,
    delay: 0.2,
    onComplete: () => render.remove(),
  });
}

$(window).on("load", () => {
  renderPage();
});
