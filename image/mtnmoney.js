document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');
    const amountInput = document.getElementById('amount');
    const phoneInput = document.getElementById('phone');
    const messageDiv = document.getElementById('form-message');

    // Get amount from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const amountFromUrl = urlParams.get('amount');
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

        showMessage('Processing your payment...', 'info');

        try {
            console.log('Submitting to backend:', { amount, customerPhone: phone });
            showMessage('Redirecting to MTN Mobile Money for confirmation...', 'success');
            
            setTimeout(() => {
                alert('This is a demo. In a real application, you would be redirected to MTN Mobile Money.');
            }, 2000);

        } catch (error) {
            showMessage('An error occurred. Please try again.', 'error');
            console.error('Payment error:', error);
        }
    });

    function showMessage(message, type) {
        messageDiv.className = `alert alert-danger mt-3`; // Using alert-danger for visibility on this theme
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
    }
});