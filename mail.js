$(document).ready(function() {
    "use strict";

    const contactForm = $('#contactForm');

    if (contactForm.length) {
        // EmailJS is initialized in main.js or payment.js, no need to re-initialize.

        const submitBtn = contactForm.find('.submit-btn');
        const alertMsg = contactForm.find('.alert-msg');

        contactForm.on('submit', function(e) {
            e.preventDefault();

            const originalBtnText = submitBtn.html();
            submitBtn.prop('disabled', true).html('Sending...');
            alertMsg.fadeOut();

            // Service ID: service_t3g6beo, Template ID: template_7ogb27c
            emailjs.sendForm('service_t3g6beo', 'template_7ogb27c', this)
                .then(function() {
                    alertMsg.removeClass('text-danger').addClass('text-success').html("Thank you! Your message has been sent successfully.").fadeIn();
                    contactForm.trigger('reset');
                    $('.amount-btn').removeClass('active'); // Also reset amount buttons
                }, function(error) {
                    console.error('EmailJS Error:', error);
                    alertMsg.removeClass('text-success').addClass('text-danger').html("Oops! Something went wrong. Please try again.").fadeIn();
                })
                .finally(function() {
                    submitBtn.prop('disabled', false).html(originalBtnText);
                });
        });
    }
});
