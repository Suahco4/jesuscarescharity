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
            // This part requires a backend to securely handle API calls.
            // The frontend should not handle API secrets.
            // This is a placeholder for the backend call.
            console.log('Submitting to backend:', { amount, customerPhone: phone });
            showMessage('Redirecting to Orange Money for confirmation...', 'success');
            
            // In a real application, you would fetch from your backend,
            // which then communicates with the Orange Money API.
            // For now, we'll simulate a redirect.
            setTimeout(() => {
                // window.location.href = data.paymentUrl; // This would be the real redirect
                alert('This is a demo. In a real application, you would be redirected to Orange Money.');
            }, 2000);

        } catch (error) {
            showMessage('An error occurred. Please try again.', 'error');
            console.error('Payment error:', error);
        }
    });

    function showMessage(message, type) {
        messageDiv.className = `alert alert-${type} mt-3`;
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
    }
});
