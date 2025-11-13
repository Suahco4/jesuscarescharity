(function() {
    // Initialize EmailJS with your User ID
    emailjs.init("AkK_OG-iKP7iUGHHX"); // <-- Replace with your EmailJS User ID
})();

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('footerContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Replace with your EmailJS Service ID and Template ID
            const serviceID = 'service_t3g6beo';
            const templateID = 'template_7ogb27c';

            const resultDiv = document.getElementById('footerContactResult');
            resultDiv.innerHTML = '<p>Sending...</p>';

            // Send the form data using EmailJS
            emailjs.sendForm(serviceID, templateID, this)
                .then(function(response) {
                   console.log('SUCCESS!', response.status, response.text);
                   resultDiv.innerHTML = '<p class="text-success">Message sent successfully!</p>';
                   contactForm.reset(); // Clear the form
                }, function(error) {
                   console.log('FAILED...', error);
                   resultDiv.innerHTML = '<p class="text-danger">Failed to send message. Please try again.</p>';
                });
        });
    }
});