document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');
    if (!paymentForm) return;

    const amountInput = document.getElementById('amount');
    const phoneInput = document.getElementById('phone');
    const messageDiv = document.getElementById('form-message');
    const paymentMethod = paymentForm.dataset.paymentMethod || 'Mobile Money';

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
            // This is a placeholder for a real payment integration.
            console.log(`Submitting for ${paymentMethod}:`, { amount, customerPhone: phone });
            showMessage(`Redirecting to ${paymentMethod} for confirmation...`, 'success');
            
            setTimeout(() => {
                alert(`This is a demo. In a real application, you would be redirected to ${paymentMethod}.`);
            }, 2000);
        } catch (error) {
            showMessage('An error occurred. Please try again.', 'error');
            console.error('Payment error:', error);
        }
    });

    function showMessage(message, type) {
        messageDiv.className = `alert alert-${type === 'error' ? 'danger' : type} mt-3`;
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
    }
});