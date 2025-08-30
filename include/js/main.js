
$(".carousel").swipe({
	swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
		var isRTL = $('html').attr('dir') === 'rtl';

		if (isRTL) {
			if (direction == 'left') $(this).carousel('prev');
			if (direction == 'right') $(this).carousel('next');
		} else {
			if (direction == 'left') $(this).carousel('next');
			if (direction == 'right') $(this).carousel('prev');
		}
	},
	allowPageScroll: "vertical"
});

$(document).ready(function(){
	$(".stays-carousel").owlCarousel({
		margin:120,
		loop:true,
		dots:true,
		center:true,
		autoplayHoverPause:true,
		autoplay:true,
		responsive:{0:{items:1,},768:{ items:2,},1000:{items:2,},1300:{items:2,}}
	});
});

/*SCROLL PAGE TO TOP*/
$(document).ready(function() {
	$(".toTop").css("display", "none");

	$(window).scroll(function(){
		if($(window).scrollTop() > 0){$(".toTop").fadeIn("slow");} else {$(".toTop").fadeOut("slow");}
	});

	$(".toTop").click(function(event) {
		event.preventDefault();
		$("html, body").animate({scrollTop:0},"slow");
	});
});



var navHeight = $('#main_navbar').offset().top;
FixMegaNavbar(navHeight);
$(window).bind('scroll', function() {FixMegaNavbar(navHeight);});

function FixMegaNavbar(navHeight) {
	if (!$('#main_navbar').hasClass('navbar-fixed-bottom')) {
		if ($(window).scrollTop() > navHeight) {
			$('#main_navbar').addClass('navbar-fixed-top')
			$('#main_navbar').addClass('fixed-bg')
			
			
			if ($('#main_navbar').parent('div').hasClass('container')) $('#main_navbar').children('div').addClass('container').removeClass('container-fluid');
			
			else if ($('#main_navbar').parent('div').hasClass('container-fluid'))
			$('#main_navbar').children('div').addClass('container-fluid').removeClass('container');
		}
		else {
			$('#main_navbar').removeClass('navbar-fixed-top');
			$('#main_navbar').removeClass('fixed-bg')
			
			$('body').css({'margin-top': ''});
		}
	}
}


$(function() {
	$('input[name="daterange"]').daterangepicker({
		opens: 'left'
	}, function(start, end, label) {
		console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
	});
});


/*
	(function(){
	const carousel = document.querySelector('.carousel');
	const stage = document.getElementById('stage');
	const slides = Array.from(stage.children);
	const nextBtn = document.getElementById('nextBtn');
	const prevBtn = document.getElementById('prevBtn');
	const dotsWrap = document.getElementById('dots');

	let current = 0;
	let gap = 0; // computed from CSS var
	let autoplayId = null;
	let autoplayDelay = 3600;

	// Respect reduced motion
	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if(prefersReduced){ autoplayDelay = 8000; }

	// Build dots
	slides.forEach((_,i)=>{
		const d=document.createElement('button');
		d.className='dot'; d.type='button'; d.setAttribute('aria-label', `Go to slide ${i+1}`);
		d.addEventListener('click', ()=>goTo(i));
		dotsWrap.appendChild(d);
	});
	const dots = Array.from(dotsWrap.children);

	function computeGap(){
		const styles = getComputedStyle(document.documentElement);
		gap = parseFloat(styles.getPropertyValue('--gap')) || 100;
		const cssDelay = parseFloat(styles.getPropertyValue('--autoplay'));
		if(!Number.isNaN(cssDelay) && cssDelay>0) autoplayDelay = cssDelay;
	}

	function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }

	// Core renderer with fractional offset for drag-follow
	// offset = 0 means exactly on current; 1 means perfectly at next
	function render(offset = 0){
		const total = slides.length;
		slides.forEach((card, i)=>{
			let pos = (i - current + total) % total; // integer position in stack relative to active
			let eff = pos - offset; // fractional position during drag/transition

			if (Math.abs(eff) < 1e-6){ eff = 0; }

			const isActive = eff === 0;
			if (isActive){
				card.style.transform = `translateX(0px) scale(1)`;
				card.style.opacity = 1;
				card.style.zIndex = total;
				card.inert = false;
				card.style.pointerEvents = 'auto';
			} else if (eff > 0) {
				// cards to the right
				const scaleVal = clamp(1 - eff * 0.1, 0.6, 1);
				const x = eff * gap;
				const opacity = clamp(1 - eff * 0.12, 0.15, 1);
				card.style.transform = `translateX(${x}px) scale(${scaleVal})`;
				card.style.opacity = opacity;
				card.style.zIndex = Math.max(0, Math.round(total - eff));
				card.inert = true; card.style.pointerEvents = 'none';
			} else {
				// (optional) ghosting effect for swiping right to previous: mildly reveal one card on the left
				const abs = Math.abs(eff);
				const scaleVal = clamp(1 - abs * 0.08, 0.7, 1);
				const x = -abs * gap * 0.35; // subtle peek on the left
				const opacity = clamp(0.35 + (1 - abs) * 0.65, 0.35, 1);
				card.style.transform = `translateX(${x}px) scale(${scaleVal})`;
				card.style.opacity = opacity;
				card.style.zIndex = Math.max(0, Math.round(total - abs));
				card.inert = true; card.style.pointerEvents = 'none';
			}
		});

		dots.forEach((d, i)=>{ d.setAttribute('aria-current', String(i === current)); });
		slides.forEach((card, i)=>{ card.setAttribute('aria-hidden', String(i !== current)); });
	}

	function next(){ current = (current + 1) % slides.length; render(0); }
	function prev(){ current = (current - 1 + slides.length) % slides.length; render(0); }
	function goTo(i){ current = (i + slides.length) % slides.length; render(0); }

	// Autoplay
	function startAutoplay(){
		if (autoplayId || prefersReduced) return;
		stopAutoplay();
		autoplayId = setInterval(()=>{ next(); }, autoplayDelay);
	}
	function stopAutoplay(){ if (autoplayId){ clearInterval(autoplayId); autoplayId = null; } }

	// Pause on hover / focus / tab hidden
	carousel.addEventListener('mouseenter', stopAutoplay);
	carousel.addEventListener('mouseleave', startAutoplay);
	window.addEventListener('focus', startAutoplay);
	window.addEventListener('blur', stopAutoplay);
	document.addEventListener('visibilitychange', ()=>{
		if (document.hidden) stopAutoplay(); else startAutoplay();
	});

	// Buttons
	nextBtn.addEventListener('click', ()=>{ stopAutoplay(); next(); });
	prevBtn.addEventListener('click', ()=>{ stopAutoplay(); prev(); });

	// Keyboard support
	window.addEventListener('keydown', (e)=>{
		if (e.key === 'ArrowRight'){ stopAutoplay(); next(); }
		else if (e.key === 'ArrowLeft'){ stopAutoplay(); prev(); }
	});

	// Pointer (touch/drag) swipe with live follow and snap
	let startX = 0, dx = 0, isDown = false;
	const threshold = 0.22; // fraction of gap to trigger (22%)

	function frac(){ return clamp(dx / gap, -1, 1); } // convert pixels to fractional slide offset

	function onDown(e){
		isDown = true; dx = 0; startX = (e.touches? e.touches[0].clientX : e.clientX);
		stage.classList.add('dragging');
		stopAutoplay();
	}
	function onMove(e){
		if (!isDown) return;
		const x = (e.touches? e.touches[0].clientX : e.clientX);
		dx = x - startX;
		// left drag (negative dx) heads to next; right drag to previous
		render(-dx / gap);
	}
	function onUp(){
		if (!isDown) return;
		const f = -frac(); // positive means intention to go to next
		stage.classList.remove('dragging');

		if (f >= threshold){ next(); }
		else if (f <= -threshold){ prev(); }
		else { render(0); }

		isDown = false; dx = 0;
		startAutoplay();
	}

	// Click anywhere on stage goes next when not dragging
	stage.addEventListener('click', (e)=>{
		if (isDown) return; // don't treat drag end as click
		if (e.target.closest('.btn')) return;
		stopAutoplay();
		next();
	});

	stage.addEventListener('pointerdown', onDown);
	stage.addEventListener('pointermove', onMove);
	window.addEventListener('pointerup', onUp);
	stage.addEventListener('touchstart', onDown, {passive:true});
	stage.addEventListener('touchmove', onMove, {passive:true});
	window.addEventListener('touchend', onUp);

	// Resize / var recompute
	const resizeObserver = new ResizeObserver(()=>{ computeGap(); render(0); });
	resizeObserver.observe(document.documentElement);

	computeGap();
	render(0);
	startAutoplay();
})();
*/