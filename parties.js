// Add event listener to RSVP buttons
document.querySelectorAll('.btn-rsvp').forEach(button => {
    button.addEventListener('click', function() {
        alert("You have successfully RSVP'd for this party!");
        // You can further implement functionality like sending an RSVP request to a server
    });
});
