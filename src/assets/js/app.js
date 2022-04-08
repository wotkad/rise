require("./preloader/index");
require("./linksChecker/isCurrentPage/index");
require("./linksChecker/checkInternalLinks/index");
require("./routing/index");
require("./scroll/smoothScroll/index");
require("./scroll/scrollReveal/index");

// import feather from "feather-icons";
// import lottie from "lottie-web";

// // feather icons init
// feather.replace();

// // lottie animation for feather icons
// function drawSvgByLottie() {
//   let container = document.querySelector(".animation");
//   let button = $(".test");

//   let animation = lottie.loadAnimation({
//     container: container,
//     renderer: "svg",
//     loop: false,
//     autoplay: false,
//     path: "assets/js/animations/activity.json",
//   });
//   animation.onComplete = function () {
//     animation.stop();
//   };
//   button.on("click", function () {
//     animation.play();
//   });
//   button.on("mouseover", function () {
//     animation.play();
//   });
//   button.on("mouseleave", function () {
//     animation.play();
//   });
// }
// drawSvgByLottie();