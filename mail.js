$(document).ready(function() {
    "use strict";

    const contactForm = $('#contactForm'); // The contact form

    // Only execute if the contact form exists.
    if (contactForm.length) {
        // Initialize EmailJS with your Public Key.
        emailjs.init("mMoFbLBQtA226NQY_"); // This is your public key.

        const submitBtn = contactForm.find('.submit-btn');
        const alertMsg = contactForm.find('.alert-msg');

        // Handle the form submission event.
        contactForm.on('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission.

            // Update UI to show processing state.
            submitBtn.html('Sending...');
            alertMsg.fadeOut();

            // Send form data using EmailJS.
            // Service ID: service_t4jdpwc
            // Template ID: tamplate_awyrou5
            emailjs.sendForm('service_t4jdpwc', 'tamplate_awyrou5', this)
                .then(function() {
                    alertMsg.html("Thank you! Your message has been sent successfully.").addClass('text-success').fadeIn();
                    contactForm.trigger('reset');
                    submitBtn.html('Send Message');
                }, function(error) {
                    console.error('EmailJS Error:', error);
                    alertMsg.html("Oops! Something went wrong. Please try again.").addClass('text-danger').fadeIn();
                    submitBtn.html('Send Message');
                });
        });
    }
});
