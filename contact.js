// Contact Form Submission Handling
document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (name && email && message) {
        alert(`Thank you, ${name}! Your message has been received.`);
        // Optionally, send this data to a backend service via AJAX or Fetch API
        document.getElementById("contactForm").reset();
    } else {
        alert("Please fill in all fields before submitting.");
    }
});
