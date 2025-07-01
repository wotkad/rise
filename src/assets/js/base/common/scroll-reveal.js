import ScrollReveal from "scrollreveal";

let scrollRevealInstance = null;

export default function scrollInit() {
  if (scrollRevealInstance) {
    scrollRevealInstance.sync();
    return;
  }
  
  const options = {
    opacity: 0,
    mobile: false,
    delay: 150,
    reset: false
  };
  
  scrollRevealInstance = ScrollReveal();
  scrollRevealInstance.reveal(".reveal", options);
}
scrollInit();