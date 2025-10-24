
$(document).ready(function(){
	"use strict";

	var window_width 	 = $(window).width(),
	window_height 		 = window.innerHeight,
	header_height 		 = $(".default-header").height(),
	header_height_static = $(".site-header.static").outerHeight(),
	fitscreen 			 = window_height - header_height;


	$(".fullscreen").css("height", window_height)
	$(".fitscreen").css("height", fitscreen);

  //-------- Header Scroll Class  ----------//
	var lastScrollTop = 0;
	$(window).on('scroll', function() {
		var st = $(this).scrollTop();
		var header = $('.default-header');
		if (st > lastScrollTop && st > header.height()) {
			// Scroll Down
			header.addClass('nav-up');
		} else {
			// Scroll Up
			header.removeClass('nav-up');
		}
		lastScrollTop = st;
	});

	// Add padding to body to prevent content from being hidden by the fixed header
	var headerHeight = $('.default-header').height();
	$('body').css('padding-top', headerHeight + 'px');
	// Adjust banner height
	$('.banner-area.fullscreen').css('height', 'calc(100vh - ' + headerHeight + 'px)');
	// Adjust banner row height for content alignment
	$('.banner-row-height').css('min-height', 'calc(100vh - ' + headerHeight + 'px)');
  
  
  //------- Active Nice Select --------//
     $('select').niceSelect();
     
     
   // -------   Active Mobile Menu-----//

  var menu = $("#mainNav");
  var menubar = $(".menu-bar");

  menubar.on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var isExpanded = menubar.attr('aria-expanded') === 'true';
      menubar.attr('aria-expanded', !isExpanded);
      menu.toggleClass('hide mobile-menu');
      $("span", this).toggleClass("lnr-cross");
      if (!isExpanded) {
        menu.find('a:first').focus();
      } else {
        menubar.focus();
      }
  });

  // Close mobile menu when a link is clicked
  $('#mainNav a').on('click', function() {
    if (menu.hasClass('mobile-menu')) {
      menubar.trigger('click');
    }
  });


  $('.nav-item a:first').tab('show');



  // Select all links with hashes
  $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
        && 
        location.hostname == this.hostname
      ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $('html, body').animate({
            scrollTop: target.offset().top - headerHeight
          }, 1000, function() {
            // Callback after animation
            // Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { // Checking if the target was focused
              return false;
            } else {
              $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
              $target.focus(); // Set focus again
            };
          });
        }
      }
    });


    // Initialize Animate On Scroll
    AOS.init();

    // Back to Top button
    var backToTop = $('.back-to-top');
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            backToTop.removeClass('d-none').fadeIn();
        } else {
            backToTop.fadeOut(function() {
                backToTop.addClass('d-none');
            });
        }
    });

    backToTop.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 1000);
    });

 });
