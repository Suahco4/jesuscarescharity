$(document).ready(function() {
    "use strict";

    const form = $('#myForm'); // The donation form

    // Only execute the following code if the donation form exists on the page.
    if (form.length) {
        // Cache jQuery objects for performance
        const submitBtn = $('.submit-btn');
        const alertMsg = $('.alert-msg');
        const donationAmountInput = $('#donation-amount');
        const nameInput = $('#fname');
        const emailInput = $('#email');
        const messageInput = $('#message');

        // Initialize EmailJS with your Public Key (not User ID).
        // This is safe to expose on the client-side.
        emailjs.init("AkK_OG-iKP7iUGHHX");

        // Handle the form submission event.
        form.on('submit', async function(e) {
            e.preventDefault(); // Prevent the default form submission.

            // --- Client-side validation ---
            const amount = parseFloat(donationAmountInput.val());
            if (isNaN(amount) || amount <= 0) {
                alertMsg.html("Please enter a valid donation amount.").fadeIn();
                return;
            }

            // Update UI to show processing state
            submitBtn.html('Processing...').prop('disabled', true);
            alertMsg.fadeOut();

            const formData = {
                amount: amount,
                name: nameInput.val(),
                email: emailInput.val(),
                message: messageInput.val()
            };

            try {
                // 1. Attempt to send an email notification via EmailJS.
                // This is done first, but payment is prioritized. If this fails, we still proceed.
                try {
                    await emailjs.sendForm('service_t3g6beo', 'template_7ogb27c', this);
                    console.log('EmailJS notification sent successfully.');
                } catch (emailJsError) {
                    // Log a warning for debugging, but don't block the user.
                    console.warn('EmailJS notification failed, but proceeding with payment:', emailJsError);
                }

                // 2. Send donation data to the backend to create a payment link.
                const response = await fetch('/api/create-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    // Try to get a specific error message from the server response
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                // 3. Redirect to the payment gateway if a link is received.
                if (data.paymentLink) {
                    window.location.href = data.paymentLink;
                } else {
                    // This case handles if the server responds 200 OK but without a payment link.
                    throw new Error(data.error || 'Failed to create payment session.');
                }

            } catch (error) {
                console.error('Form submission error:', error);
                // Provide a more user-friendly error message.
                alertMsg.html(`Error: ${error.message || "Something went wrong. Please try again."}`).fadeIn();

                // Re-enable the button on failure so the user can try again.
                submitBtn.html('Proceed to Donate<span class="lnr lnr-arrow-right"></span>').prop('disabled', false);
            }
        });
    }
});