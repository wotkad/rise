import ScrollReveal from "scrollreveal";

export default function scrollReveal() {
  const options = {
    distance: "20%",
    origin: "bottom",
    opacity: 0,
    mobile: false,
  };
  ScrollReveal().reveal(".reveal", options);
}
scrollReveal();