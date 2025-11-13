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
        const subjectInput = $('#subject');
        const messageInput = $('#message');

        // Initialize EmailJS with your Public Key (not User ID).
        // This is safe to expose on the client-side.
        emailjs.init("AkK_OG-iKP7iUGHHX");

        // Handle the form submission event.
        form.on('submit', async function(e) {
            e.preventDefault(); // Prevent the default form submission.

            // Update UI to show processing state
            submitBtn.html('Processing...').prop('disabled', true);
            alertMsg.fadeOut();

            const amount = parseFloat(donationAmountInput.val());
            const isDonation = !isNaN(amount) && amount > 0;

            const formData = {
                amount: isDonation ? amount : 0,
                name: nameInput.val(),
                email: emailInput.val(),
                subject: subjectInput.val(),
                message: messageInput.val()
            };

            if (isDonation) {
                // --- Handle Donation ---
                try {
                    // Send donation data to the backend to create a payment link.
                    const response = await fetch('/api/create-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();

                    // Redirect to the payment gateway.
                    if (data.paymentLink) {
                        window.location.href = data.paymentLink;
                    } else {
                        throw new Error(data.error || 'Failed to create payment session.');
                    }

                } catch (error) {
                    console.error('Donation processing error:', error);
                    alertMsg.html(`Error: ${error.message || "Something went wrong. Please try again."}`).fadeIn();
                    submitBtn.html('Proceed to Donate<span class="lnr lnr-arrow-right"></span>').prop('disabled', false);
                }
            } else {
                // --- Handle Contact Message ---
                // Use the same EmailJS service and template, but the content will be different
                // Ensure your template `template_7ogb27c` can handle an empty amount and has a place for {{subject}}.
                emailjs.send('service_t3g6beo', 'template_ylyzb89', formData)
                    .then(function() {
                        alertMsg.html("Thank you! Your message has been sent successfully.").addClass('text-success').fadeIn();
                        form.trigger('reset');
                        submitBtn.html('Proceed to Donate<span class="lnr lnr-arrow-right"></span>').prop('disabled', false);
                    }, function(error) {
                        console.error('EmailJS Error:', error);
                        alertMsg.html("Oops! Something went wrong. Please try again.").addClass('text-danger').fadeIn();
                        submitBtn.html('Proceed to Donate<span class="lnr lnr-arrow-right"></span>').prop('disabled', false);
                    });
            }

        });
    }
});