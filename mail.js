$(document).ready(function() {
    // Initialize EmailJS with your User ID
    emailjs.init("service_t4jdpwc"); // Replace with your EmailJS User ID

    var form = $('#myForm'); // contact form
    var submit = $('.submit-btn'); // submit button
    var alert = $('.alert-msg'); // alert div for show alert message

    // form submit event
    form.on('submit', function(e) {
        e.preventDefault(); // prevent default form submit

        // Collect form data
        var formData = {
            name: form.find('input[name="name"]').val(),
            email: form.find('input[name="email"]').val(),
            subject: form.find('input[name="subject"]').val(),
            message: form.find('textarea[name="message"]').val()
        };

        // Basic validation (client-side)
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert.html("Please fill in all fields.").fadeIn();
            return;
        }

        // Send via EmailJS
        emailjs.send("service_t4jdpwc", "tamplate_awyrou5", formData) // Replace with your IDs
            .then(function(response) {
                alert.html("Thank you! Your message has been sent successfully.").fadeIn();
                form.trigger('reset');
                submit.attr("style", "display: none !important");
            }, function(error) {
                alert.html("Oops! Something went wrong. Please try again.").fadeIn();
                console.log('EmailJS Error:', error);
            });
    });
});
