$(document).ready(function() {
    "use strict";

    const donationForm = $('#contactForm'); // The donation form


    // Only execute the following code if the donation form exists on the page.
    if (donationForm.length) {
        // Cache jQuery objects for performance
        const submitBtn = donationForm.find('button[type="submit"]');
        const alertMsg = donationForm.find('.alert-msg');
        const paymentMethodSelect = $('#payment_method');
        const amountInput = $('#amount_sent');
        const $preloader = $('#preloader');

        const bankDetailsDiv = $('#bank_details');

        // Update amount placeholder based on payment method
        paymentMethodSelect.on('change', function() {
            const selectedMethod = $(this).val();
            if (selectedMethod === 'Orange Money' || selectedMethod === 'MTN Mobile Money') {
                amountInput.attr('placeholder', 'Amount Sent (LRD)');
                bankDetailsDiv.hide();
            } else if (selectedMethod === 'Card' || selectedMethod === 'Bank Transfer') {
                if (selectedMethod === 'Bank Transfer') bankDetailsDiv.show();
                else bankDetailsDiv.hide();
                amountInput.attr('placeholder', 'Amount Sent (USD)');
            }
        }).trigger('change'); // Trigger the change event on page load to set the initial placeholder

        // Initialize niceSelect for the payment method dropdown if not already done
        paymentMethodSelect.niceSelect();
        paymentMethodSelect.val("").niceSelect('update');

        // Initialize EmailJS with your Public Key (not User ID).
        // This is safe to expose on the client-side.
        emailjs.init("AkK_OG-iKP7iUGHHX");

        // Handle the form submission event.
        donationForm.on('submit', async function(e) {
            e.preventDefault(); // Prevent the default form submission.

            // Show loader
            alertMsg.fadeOut();
            $preloader.fadeIn();

            // --- Handle Donation ---
            const formData = {
                amount: parseFloat($('#amount_sent').val()),
                name: $('#donor_name').val(),
                email: $('#donor_email').val(),
                phone: $('#phone_number').val(),
                payment_method: $('#payment_method').val()
            };

            // If payment method is card, try to use a backend. Otherwise, use EmailJS.
            if (formData.payment_method === 'Card') { // 'Card' is not an option, so this block is currently unused.
                try {
                    // Send donation data to the backend to create a payment link.
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

                    // Redirect to the payment gateway.
                    if (data.paymentLink) {
                        window.location.href = data.paymentLink;
                        return;
                    } else {
                        throw new Error(data.error || 'Failed to create payment session.');
                    }

                } catch (error) {
                    console.error('Donation processing error:', error);
                    alertMsg.removeClass('text-success').addClass('text-danger').html(`Error: ${error.message || "Something went wrong. Please try again."}`).fadeIn();
                    // Hide loader on error
                    $preloader.fadeOut();
                }
            } else {
                // Fallback to EmailJS for other payment methods
                emailjs.sendForm('service_t3g6beo', 'template_ylyzb89', this)
                    .then(function() {
                        alertMsg.removeClass('text-danger').addClass('text-success').html("Thank you! Your donation confirmation has been sent.").fadeIn();
                        donationForm.trigger('reset');
                        // Redirect to the success page after a short delay
                        setTimeout(() => { window.location.href = 'success.html'; }, 2000);
                    })
                    .catch(function(error) {
                        console.error('EmailJS Error:', error);
                        alertMsg.removeClass('text-success').addClass('text-danger').html("Oops! Something went wrong. Please try again.").fadeIn();
                    })
                    .finally(function() {
                        // Hide loader after EmailJS is done
                        $preloader.fadeOut();
                    });
            }
        });
    }
});