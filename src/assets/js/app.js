import $ from "jquery";

// import gsap from "gsap";
// import feather from "feather-icons";
// import lottie from "lottie-web";

// //mobile menu
// function toggleMobileMenu() {
// 	let button = $('.selector'); // button selector
// 	let menu = $('.selector'); // menu selector
// 	let close = $('.selector'); // button close selector
// 	let items = $('.selector'); // items selector
// 	function hideMenu() {
// 		(function() {
// 			scrollLock.enablePageScroll();
// 		})();
// 		menu.removeClass('active-class'); // remove active class
// 	}
// 	button.on('click', function(e) {
// 		e.preventDefault();
// 		scrollLock.disablePageScroll();
// 		menu.toggleClass('active-class'); // toggle active class
// 	});
// 	close.on('click', function(e) {
// 		e.preventDefault();
// 		hideMenu();
// 	});
// 	Array.from(items).forEach(function(element) {
// 		$(element).on('click', function(e) {
// 			e.preventDefault();
// 			hideMenu();
// 		});
// 	});
// }
// toggleMobileMenu();

// function slider() {
// 	new Swiper('.swiper-container', {
// 		slidesPerView: 2,
// 		loop: true,
// 		navigation: {
// 			nextEl: '.swiper-button-next',
// 			prevEl: '.swiper-button-prev',
// 		},
// 		pagination: {
// 			el: '.swiper-pagination',
// 			type: 'bullets',
// 			clickable: true,
// 		},
// 		breakpoints: {
// 			640: {
// 				slidesPerView: 1,
// 				allowTouchMove: true,
// 			},
// 			991: {
// 				slidesPerView: 2,
// 				allowTouchMove: true,
// 			}
// 		},
// 	});
// }
// slider();

// //send mail handler
// let sendMail = function sendMail(selector) {
// 	return fetch('/mail.php', {
// 		method: 'POST',
// 		body: new FormData($(selector).get(0))
// 	});
// };

// // form for sendmail method with yandex counter
// function sendForm() {
// 	let form = $('.selector');
// 	if (form) {
// 		form.submit(function(e) {
// 			e.preventDefault();
// 			sendMail(form).then(function() {
// 				return successMessage() /*,
// 				yaCounter********.reachGoal('****', function() {})*/,
// 				form.get(0).reset();
// 			});
// 		});
// 	}
// }
// sendForm();

// function successMessage() {
// 	let container = $('.selector'); // block selector
// 	container.addClass('active-class'); // add active class
// 	setTimeout(function() {
// 		container.removeClass('active-class'); // remove active class
// 	}, 2000);
// }

// // mask for "tel" input
// function inputMask() {
// 	let input =  $('input[type="tel"]');
// 	Array.from(input).forEach(function(element) {
// 		let mask = new Inputmask('+7 (999) 999-99-99');
// 		mask.mask(element);
// 	});
// }
// inputMask();

// //only numbers in the fields
// $('selector').on('keydown', function(e) { // input selector
// 	if(e.key.length == 1 && e.key.match(/[^0-9'".]/)){
// 		return false;
// 	}
// });

// //close popup by "esc" button
// function hideByClickEscButton() {
// 	let selector = $('.selector'); // block selector
// 	$(window).on('keydown', function(e) {
// 		if ( e.keyCode == 27 ) {
// 			selector.removeClass('active-class'); // remove active class
// 			scrollLock.enablePageScroll();
// 		}
// 	});
// }
// hideByClickEscButton();

// //play video
// const stopVideo = function() {
// 	let stopButton = $('.selector'); // button selector
// 	let video = $('.selector'); // block selector video
// 	if (stopButton) {
// 		stopButton.on('click', function(e) {
// 			e.preventDefault();
// 			if (video.paused) { // video selector
// 				video.play(); // video selector
// 			} else {
// 				video.pause(); // video selector
// 			}
// 		});
// 	}
// };
// stopVideo();

// //stop video when scroll (work only if width > 767px)
// function showToggledVideo() {
// 	let video = $('.selector'); // block selector video
// 	let scroll = $(this).scrollTop();
// 	if (video) {
// 		$(window).scroll(function() {
// 			if($(window).width() > 767) {
// 				if (scroll > 0) { // video selector
// 					video.play(); // video selector
// 				} else {
// 					video.pause(); // video selector
// 				}
// 			}
// 		});
// 	}
// }
// showToggledVideo();

// //yandex maps script
// function yaMaps() {
// 	// script for yandex maps
// 	let spinner = $('.ymap-container').children('.loader'); // block selector and loader
// 	let check_if_load = false;
// 	function init() {
// 		let myMapTemp = new ymaps.Map('map-yandex', {
// 			center: [55.722882, 37.626717], // coordinates
// 			zoom: 17, // zoom
// 			controls: ['zoomControl', 'fullscreenControl']
// 		});
// 		let myPlacemarkTemp = new ymaps.GeoObject({
// 			geometry: {
// 				type: 'Point',
// 				coordinates: [55.722882, 37.626717] // coordinates
// 			}
// 		});
// 		myMapTemp.geoObjects.add(myPlacemarkTemp);
// 		let layer = myMapTemp.layers.get(0).get(0);
// 		waitForTilesLoad(layer).then(function() {
// 			spinner.removeClass('is-active');
// 		});
// 		myMapTemp.behaviors.disable('scrollZoom');
// 	}
// 	function waitForTilesLoad(layer) {
// 		return new ymaps.vow.Promise(function(resolve) {
// 			let tc = getTileContainer(layer), readyAll = true;
// 			// eslint-disable-next-line no-unused-vars
// 			tc.tiles.each(function(tile, number) {
// 				if (!tile.isReady()) {
// 					readyAll = false;
// 				}
// 			});
// 			if (readyAll) {
// 				resolve();
// 			} else {
// 				tc.events.once('ready', function() {
// 					resolve();
// 				});
// 			}
// 		});
// 	}
// 	function getTileContainer(layer) {
// 		for (var k in layer) {
// 			if (layer.hasOwnProperty(k)) {
// 				if (
// 					layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer
// 					|| layer[k] instanceof ymaps.layer.tileContainer.DomContainer
// 				) {
// 					return layer[k];
// 				}
// 			}
// 		}
// 		return null;
// 	}
// 	function loadScript(url, callback){
// 		let script = document.createElement('script');
// 		if (script.readyState){
// 			script.onreadystatechange = function() {
// 				if (script.readyState == 'loaded' ||
// 					script.readyState == 'complete'){
// 					script.onreadystatechange = null;
// 					callback();
// 				}
// 			};
// 		} else {
// 			script.onload = function() {
// 				callback();
// 			};
// 		}
// 		script.src = url;
// 		document.getElementsByTagName('head')[0].appendChild(script);
// 	}
// 	let ymap = function() {
// 		$('.ymap-container').mouseenter(function() {
// 			if (!check_if_load) {
// 				check_if_load = true;
// 				spinner.addClass('is-active');
// 				loadScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;loadByRequire=1', function() {
// 					ymaps.load(init);
// 				});
// 			}
// 		}
// 		);
// 	};
// 	$(function() {
// 		ymap();
// 	});
// }
// yaMaps();

// // close popup or smth when click out of popup
// $('.selector').click(function(e) { // selector button
// 	let $search = $('.selector'); // selector block
// 	if ($search.css('display') !== 'block') {
// 		$search.addClass('active-class'); // add active class
// 		let firstClick = true;
// 		$(document).bind('click.customEvent', function(e) {
// 			if (!firstClick && $(e.target).closest('.selector').length == 0) { // selector block
// 				$search.removeClass('active-class'); // remove active class
// 				$(document).unbind('click.customEvent');
// 			}
// 			firstClick = false;
// 		});
// 	}
// 	e.preventDefault();
// });

// //init counter when block in viewport
// function counterInViewPort() {
// 	let win = $(window);
// 	let counter = $('.selector'); // selector block
// 	let id = 0;
// 	win.scroll(function() {
// 		if(id == 0 && win.scrollTop() + win.height() > counter.offset().top) {
// 			let ccc = 0;
// 			id = setInterval(function() {
// 				ccc += 10000;
// 				counter.html(ccc + ' руб.');
// 				if (ccc == 280000) {
// 					clearInterval(id);
// 				}
// 			}, 50);
// 		}
// 	});
// }
// counterInViewPort();

// //init event when it in viewport
// function viewportInit() {
// 	let win = $(window);
// 	let block = $('.selector'); // selector block
// 	win.scroll(function() {
// 		if(win.scrollTop() + win.height() > block.offset().top) {
// 			block.addClass('active-class'); // add active class or add some other animations here
// 		}
// 	});
// }
// viewportInit();

// function tiltAnimation() {
// 	$('.index__content').tilt({
// 		reset: true,
// 		perspective: 500,
// 		maxTilt: 4,
// 		speed: 20000,
// 		transition: false
// 	});
// }
// tiltAnimation();

// // dynamic data with cache
// function dynamicData() {
// 	const data = {
// 		'title1': {
// 			text: 'text1',
// 		},
// 		'title2': {
// 			text: 'text2',
// 		},
// 	};

// 	void function() {
// 		const select = document.querySelector('.selector'); // selectors blocks
// 		const options = [...document.querySelectorAll('.selector')]; // selectors blocks
// 		const titleblock = document.querySelector('.selector'); // selector titleblock
// 		options.forEach(option => option.onclick = function(e){
// 			titleblock.textContent = e.target.textContent;
// 			select.dispatchEvent(new CustomEvent('change', {detail: { value: e.target.textContent }}));
// 		});
// 		select.addEventListener('change', function(e) {
// 			titleblock.textContent = data[e.detail.value].text;
// 		});
// 	}();
// }
// dynamicData();

// // init select2
// function selectInput() {
// 	$('.selector').select2(); // selector block
// }
// selectInput();

// // resize handler for some actions only on specific width
// function resizeHandler() {
// 	$('.selector').click(function() { // for example this click will work only if width < 991px
// 		if($(window).width() < 991) {
// 			// some logic
// 		}
// 	});
// }
// resizeHandler();
// $(window).resize(resizeHandler);

// //progress bar for article
// $(function() {
// 	$(window).on('scroll resize', function() {
// 		let progress = $('progress')[0];  // progress block (you need to set bgc of your "progress::-moz-progress-bar" property in styles)
// 		if (progress !== undefined) {
// 			let width = $(window).scrollTop() / ($(document).height() - $(window).height());
// 			progress.value = width;
// 		}
// 	});
// });

// // skewing some blocks with underscore lib functions
// function skewBlocks() {
// 	let MAX = 50;
// 	let checkScrollSpeed = (function(settings) {
// 		settings = settings || {};

// 		let lastPos, newPos, timer, delta,
// 			delay = settings.delay || 50; // in "ms" (higher means lower fidelity )

// 		function clear() {
// 			lastPos = null;
// 			delta = 0;
// 		}
// 		clear();

// 		return function() {
// 			newPos = window.scrollY;
// 			if ( lastPos !== null ){ // && newPos < maxScroll
// 				delta = newPos -  lastPos;
// 			}
// 			lastPos = newPos;
// 			clearTimeout(timer);
// 			timer = setTimeout(clear, delay);
// 			return delta;
// 		};
// 	})();

// 	// underscore method throttle
// 	let setSkew = _.throttle(function(skew) {
// 		$('selector').css('transform','skewY('+ skew +'deg)'); // select your block to skew
// 	}, 16);

// 	// underscore method debounce
// 	let setBack = _.debounce(function() {
// 		$('selector').css('transform','skewY(0deg)'); // select your block to skew
// 	}, 140);

// 	$(window).on('scroll', function() {
// 		let speed = checkScrollSpeed();
// 		if(speed > MAX) speed = MAX;
// 		if(speed <- MAX) speed = -MAX;
// 		setSkew(speed/10);
// 		setBack();
// 	});
// }
// skewBlocks();

// // toggle tweenmax animation fot many items with delay for each 0.05
// function toggleTweenAnimation() {
// 	const tl = new TimelineLite()
// 		.staggerTo('.selector', 0.5, {opacity: 1}, 0.05) // selector block
// 		.reverse();
// 	$('.selector').click(function() { // selector button
// 		tl.reversed(!tl.reversed());
// 	});
// }
// toggleTweenAnimation();

// // paralax effect for block with rellax lib
// function rellax() {
// 	new Rellax('.selector'); // selector block
// }
// rellax();

// function checkNavInit() {
// 	let header = $('.selector'); //menu selector
// 	if (window.pageYOffset !== 0) {
// 		header.addClass('active-class'); // add active class when top offset more than 0
// 	} else {
// 		header.removeClass('active-class'); // remove active class when top offset more than 0
// 	}
// }
// checkNavInit();

// // handler for add active class to menu if you enter with offset from top (onscroll)
// function scrollCheckNav() {
// 	$(window).on('scroll', function() {
// 		checkNavInit();
// 	});
// }
// scrollCheckNav();

// // current time
// function currentTime() {
// 	const time = $('.selector'); // selector block
// 	setInterval(function() {
// 		time.innerHTML = moment().format('hh:mm:ss');
// 	}, 1000);
// }
// currentTime();

// // dynamic bg that reaction on mousemove
// function dynamicBg() {
// 	const el = $('.selector'); // selector block with image
// 	el.addEventListener('mousemove', function(e) {
// 		el.style.backgroundPositionX = -e.offsetX + 'px';
// 		el.style.backgroundPositionY = -e.offsetY + 'px';
// 	});
// }
// dynamicBg();

// // custom cursor
// function mouse() {
// 	$(window).mousemove(function(e) {
// 		$('.selector, .selector').css({'transform': 'translate(' + (e.pageX-12) + 'px, ' + (e.pageY-12-$(window).scrollTop()) + 'px)'}); // selector cursor and pulse block
// 	});
// }
// mouse();

// function moveBlockByMouse() {
// 	let $layer_2 = $('selector'), // selector block

// 		$container = $('selector'), // container block
// 		container_w = $container.width(),
// 		container_h = $container.height();

// 	$(window).on('mousemove.parallax', function(event) {
// 		let pos_x = event.pageX,
// 			pos_y = event.pageY,
// 			left  = 0,
// 			top   = 0;

// 		left = container_w / 2 - pos_x;
// 		top  = container_h / 2 - pos_y;

// 		TweenMax.to($layer_2, 1, {
// 			css: {
// 				transform: 'translateX(' + left / 32 + 'px) translateY(' + top / 32 + 'px)'
// 			},
// 			ease:Expo.easeOut,
// 			overwrite: 'all'
// 		});
// 	});
// }
// moveBlockByMouse();

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

// Вызов в барбе.
// 	 barba.Dispatcher.on('newPageReady', function() {
// 	 	shift();
// 	 });

// 	<div class="content--canvas-g" data-base-hue="346" data-h="346" data-s="100%" data-a="60%">
// function shift() {
// 	const circleCount = 30;
// 	const circlePropCount = 8;
// 	const circlePropsLength = circleCount * circlePropCount;
// 	const baseSpeed = 2.5;
// 	const rangeSpeed = 2.5;
// 	const baseTTL = 150;
// 	const rangeTTL = 200;
// 	const baseRadius = 100;
// 	const rangeRadius = 200;
// 	const rangeHue = 30;
// 	const xOff = 0.0015;
// 	const yOff = 0.0015;
// 	const zOff = 0.0015;
// 	let h = $('#barba-wrapper .barba-container:last-child .content--canvas-g').attr('data-h');
// 	let s = $('#barba-wrapper .barba-container:last-child .content--canvas-g').attr('data-s');
// 	let a = $('#barba-wrapper .barba-container:last-child .content--canvas-g').attr('data-a');
// 	const backgroundColor = 'hsla('+h+''+','+s+','+a+',1)';
// 	let baseHue = parseInt($('#barba-wrapper .barba-container:last-child .content--canvas-g').attr('data-base-hue'));
// 	let container;
// 	let canvas;
// 	let ctx;
// 	let circleProps;
// 	let simplex;
// 	function initCircles() {
// 		circleProps = new Float32Array(circlePropsLength);
// 		simplex = new SimplexNoise();
// 		let i;
// 		for (i = 0; i < circlePropsLength; i += circlePropCount) {
// 			initCircle(i);
// 		}
// 	}
// 	function initCircle(i) {
// 		let x, y, t, speed, vx, vy, life, ttl, radius, hue;
// 		x = rand(canvas.a.width);
// 		y = rand(canvas.a.height);
// 		n = simplex.noise3D(x * xOff, y * yOff, baseHue * zOff);
// 		t = rand(TAU);
// 		speed = baseSpeed + rand(rangeSpeed);
// 		vx = speed * cos(t);
// 		vy = speed * sin(t);
// 		life = 0;
// 		ttl = baseTTL + rand(rangeTTL);
// 		radius = baseRadius + rand(rangeRadius);
// 		hue = baseHue + rand(2 * rangeHue) - rangeHue;
// 		circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
// 	}
// 	function updateCircles() {
// 		let i;
// 		for (i = 0; i < circlePropsLength; i += circlePropCount) {
// 			updateCircle(i);
// 		}
// 	}
// 	function updateCircle(i) {
// 		let i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i;
// 		let x, y, vx, vy, life, ttl, radius, hue;
// 		x = circleProps[i];
// 		y = circleProps[i2];
// 		vx = circleProps[i3];
// 		vy = circleProps[i4];
// 		life = circleProps[i5];
// 		ttl = circleProps[i6];
// 		radius = circleProps[i7];
// 		hue = circleProps[i8];
// 		drawCircle(x, y, life, ttl, radius, hue);
// 		life++;
// 		circleProps[i] = x + vx;
// 		circleProps[i2] = y + vy;
// 		circleProps[i5] = life;
// 		(checkBounds(x, y, radius) || life > ttl) && initCircle(i);
// 	}
// 	function drawCircle(x, y, life, ttl, radius, hue) {
// 		ctx.a.save();
// 		ctx.a.fillStyle = `hsla(${hue},`+s+','+a+`,${fadeInOut(life,ttl)})`;
// 		ctx.a.beginPath();
// 		ctx.a.arc(x,y, radius, 0, TAU);
// 		ctx.a.fill();
// 		ctx.a.closePath();
// 		ctx.a.restore();
// 	}
// 	function checkBounds(x, y, radius) {
// 		return (
// 			x < -radius ||
// 			x > canvas.a.width + radius ||
// 			y < -radius ||
// 			y > canvas.a.height + radius
// 		);
// 	}
// 	function createCanvas() {
// 		container_tags = document.querySelectorAll('.content--canvas-g');
// 		container = container_tags[container_tags.length - 1];
// 		canvas = {
// 			a: document.createElement('canvas'),
// 			b: document.createElement('canvas')
// 		};
// 		canvas.b.style = `
// 			position: fixed;
// 			top: 0;
// 			left: 0;
// 			width: 100%;
// 			height: 100%;
// 		`;
// 		container.appendChild(canvas.b);
// 		ctx = {
// 			a: canvas.a.getContext('2d'),
// 			b: canvas.b.getContext('2d')
// 		};
// 	}
// 	function resize() {
// 		const { innerWidth, innerHeight } = window;
// 		canvas.a.width = innerWidth;
// 		canvas.a.height = innerHeight;
// 		ctx.a.drawImage(canvas.b, 0, 0);
// 		canvas.b.width = innerWidth;
// 		canvas.b.height = innerHeight;
// 		ctx.b.drawImage(canvas.a, 0, 0);
// 	}
// 	function render() {
// 		ctx.b.save();
// 		ctx.b.filter = 'blur(50px)';
// 		ctx.b.drawImage(canvas.a, 0, 0);
// 		ctx.b.restore();
// 	}
// 	function draw() {
// 		ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
// 		ctx.b.fillStyle = backgroundColor;
// 		ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);
// 		updateCircles();
// 		render();
// 		window.requestAnimationFrame(draw);
// 	}
// 	function setup() {
// 		createCanvas();
// 		resize();
// 		initCircles();
// 		draw();
// 	}
// 	setup();
// 	window.addEventListener('resize', resize);
// }
// shift();
