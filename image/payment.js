document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    (function(){
        emailjs.init("AkK_OG-iKP7iUGHHX"); // Replace with your EmailJS User ID
    }());

    const paymentForm = document.getElementById('paymentForm');
    if (!paymentForm) return;

    const amountInput = document.getElementById('amount');
    const phoneInput = document.getElementById('phone');
    const messageDiv = document.getElementById('form-message');
    const paymentMethod = paymentForm.dataset.paymentMethod || 'Mobile Money';

    // Get amount from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const amountFromUrl = urlParams.get('amount');
    const nameFromUrl = urlParams.get('name');
    const emailFromUrl = urlParams.get('email');

    if (amountFromUrl) {
        amountInput.value = amountFromUrl;
    }


    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = amountInput.value;
        const phone = phoneInput.value;

        if (!amount || !phone) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        const submitButton = paymentForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';

        const templateParams = {
            payment_method: paymentMethod,
            amount_sent: amount,
            phone_number: phone,
            donor_name: nameFromUrl || 'N/A',
            donor_email: emailFromUrl || 'N/A'
        };

        // Replace with your EmailJS Service ID and Template ID
        emailjs.send('service_t3g6beo', 'template_ylyzb89', templateParams)
            .then(function(response) {
               console.log('SUCCESS!', response.status, response.text);
               showMessage('Thank you! Your confirmation has been sent.', 'success');
               paymentForm.reset();
               submitButton.disabled = false;
               submitButton.innerHTML = 'Confirm Donation<span class="lnr lnr-arrow-right"></span>';
            }, function(error) {
               console.log('FAILED...', error);
               showMessage('Oops! Something went wrong. Please try again.', 'error');
               submitButton.disabled = false;
               submitButton.innerHTML = 'Confirm Donation<span class="lnr lnr-arrow-right"></span>';
            });
    });

    function showMessage(message, type) {
        messageDiv.className = `alert alert-${type === 'error' ? 'danger' : type} mt-3`;
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
    }
});