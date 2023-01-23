import barba from "@barba/core";
import barbaPrefetch from "@barba/core";
import gsap from "gsap";
import routingFunctions from "js/routingFunctions/routingFunctions";

barba.use(barbaPrefetch);

// If the header is in barba-wrapper, then the script below is not needed.
barba.hooks.beforeLeave((data) => {
  const nextPath = data.next.url.path;
  const nextItem = $(`a[href="${nextPath}"]`);
  $(`.${"active"}`).removeClass("active");
  nextItem.addClass("active");
});

barba.init({
  preventRunning: true,
  requestError: (trigger, action, url, response) => {
    if (action === "click" && response.status && response.status === 404) {
      barba.go("/404");
    }
    return false;
  },
  transitions: [
    {
      name: "opacity-transition",
      leave(data) {
        return gsap.to(data.current.container, .3, {
          opacity: 0,
        });
      },
      afterLeave(data) {
        $('body,html').animate({scrollTop: 0}, 200);
        return gsap.to(data.current.container, 0, {
          display: 'none',
        });
      },
      enter(data) {
        routingFunctions();
        return gsap.from(data.next.container, .3, {
          opacity: 0
        });
      },
    },
  ],
});
