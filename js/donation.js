$(document).ready(function() {
    "use strict";

    var form = $('#myForm'); // The donation form

    // Only execute the following code if the donation form exists on the page.
    if (form.length) {
        var submit = $('.submit-btn'); // The submit button
        var alert = $('.alert-msg'); // The alert message area

        // Initialize EmailJS with your Public Key.
        // It's best to do this only on pages where it's needed.
        emailjs.init("mMoFbLBQtA226NQY_"); // TODO: Replace with your EmailJS User ID

        // Handle the form submission event.
        form.on('submit', async function(e) {
            e.preventDefault(); // Prevent the default form submission.

            // Update UI to show processing state.
            submit.html('Processing...').prop('disabled', true);
            alert.fadeOut();

            const formData = {
                amount: parseFloat($('#donation-amount').val()),
                name: $('#fname').val(),
                email: $('#email').val(),
                message: $('#message').val()
            };

            try {
                // 1. Attempt to send an email notification via EmailJS.
                try {
                    await emailjs.sendForm('service_t4jdpwc', 'tamplate_bq7h8n6', this);
                    console.log('EmailJS notification sent successfully.');
                } catch (emailJsError) {
                    // Log a warning but continue with the payment process.
                    console.warn('EmailJS notification failed, but proceeding with payment:', emailJsError);
                }

                // 2. Send donation data to the backend to create a payment link.
                const response = await fetch('/create-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                // 3. Redirect to the payment gateway if a link is received.
                if (data.paymentLink) {
                    window.location.href = data.paymentLink;
                } else {
                    throw new Error(data.error || 'Failed to create payment session.');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert.html("Oops! Something went wrong. Please try again.").fadeIn();
                // Re-enable the button on failure.
                submit.html('Proceed to Donate<span class="lnr lnr-arrow-right"></span>').prop('disabled', false);
            }
        });
    }
});