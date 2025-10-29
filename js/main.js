
$(document).ready(function(){
	"use strict";

	// =========================================================================
	// 1. Caching jQuery Objects for Performance
	// =========================================================================
	const $window = $(window);
	const $body = $('body');
	const $header = $('.default-header');
	const $mainNav = $("#mainNav");
	const $menuBar = $(".menu-bar");
	const $backToTop = $('.back-to-top');

	// =========================================================================
	// 2. Initial Setup and Calculations
	// =========================================================================
	const headerHeight = $header.height();

	// Set initial padding on the body to prevent content from being hidden by the fixed header.
	if (headerHeight > 0) {
		$body.css('padding-top', headerHeight + 'px');
		// Adjust banner height for true fullscreen experience post-header.
		$('.banner-area.fullscreen').css('height', `calc(100vh - ${headerHeight}px)`);
		// Adjust banner row height for vertical content alignment.
		$('.banner-row-height').css('min-height', `calc(100vh - ${headerHeight}px)`);
	}

	// =========================================================================
	// 3. Event Listeners
	// =========================================================================

	// -------- Header Scroll Class Toggling ----------//
	let lastScrollTop = 0;
	$window.on('scroll', function() {
		let st = $(this).scrollTop();
		if (st > lastScrollTop && st > headerHeight) {
			// Scroll Down
			$header.addClass('nav-up');
		} else {
			// Scroll Up
			$header.removeClass('nav-up');
		}
		lastScrollTop = st;
	});

	// ------- Mobile Menu Activation -----//
	$menuBar.on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		const isExpanded = $menuBar.attr('aria-expanded') === 'true';
		$menuBar.attr('aria-expanded', !isExpanded);
		$mainNav.toggleClass('hide mobile-menu');
		$("span", this).toggleClass("lnr-cross");
		// Manage focus for accessibility
		if (!isExpanded) {
			$mainNav.find('a:first').focus();
		} else {
			$menuBar.focus();
		}
	});

	// Close mobile menu when a navigation link is clicked
	$('#mainNav a').on('click', function() {
		if ($mainNav.hasClass('mobile-menu')) {
			$menuBar.trigger('click');
		}
	});

	// -------- Smooth Scrolling for Anchor Links ----------//
	$('a[href*="#"]')
		// Remove links that don't actually link to anything
		.not('[href="#"]')
		.not('[href="#0"]')
		.click(function(event) {
			// On-page links
			if (
				location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
				location.hostname == this.hostname
			) {
				// Figure out element to scroll to
				let target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
				// Does a scroll target exist?
				if (target.length) {
					// Only prevent default if animation is actually gonna happen
					event.preventDefault();
					$('html, body').animate({
						scrollTop: target.offset().top - headerHeight
					}, 1000, function() {
						// Callback after animation for accessibility
						target.focus();
						if (target.is(":focus")) { // Checking if the target was focused
							return false;
						} else {
							target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
							target.focus(); // Set focus again
						};
					});
				}
			}
		});

	// -------- Back to Top Button Visibility and Click Handler ----------//
	$window.on('scroll', function() {
		if ($(this).scrollTop() > 300) {
			$backToTop.removeClass('d-none').fadeIn();
		} else {
			$backToTop.fadeOut(function() {
				$backToTop.addClass('d-none');
			});
		}
	});

	$backToTop.on('click', function(e) {
		e.preventDefault();
		$('html, body').animate({ scrollTop: 0 }, 1000);
	});

	// =========================================================================
	// 4. Plugin Initializations
	// =========================================================================

	// Initialize Nice Select
	$('select').niceSelect();

	// Initialize Animate On Scroll (AOS)
	AOS.init();

	// Initialize Bootstrap Tabs (if any are used)
	$('.nav-item a:first').tab('show');
 });
