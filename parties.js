// Handle the creation of a new post
document.querySelector('.btn-post').addEventListener('click', function() {
    const postContent = document.querySelector('.create-post textarea').value;
    
    if (postContent.trim() !== "") {
        const postContainer = document.querySelector('.feed-posts');

        const newPost = document.createElement('div');
        newPost.classList.add('post');
        
        newPost.innerHTML = `
            <div class="post-header">
                <div class="user-info">
                    <img src="images/avatars/user1.png" alt="User Avatar" class="avatar">
                    <span class="username">User1</span>
                </div>
                <span class="post-time">Just Now</span>
            </div>
            <div class="post-content">
                <p>${postContent}</p>
            </div>
            <div class="post-footer">
                <button class="btn-like">👍 Like</button>
                <button class="btn-comment">💬 Comment</button>
                <button class="btn

// Add event listener to RSVP buttons
document.querySelectorAll('.btn-rsvp').forEach(button => {
    button.addEventListener('click', function() {
        alert("You have successfully RSVP'd for this party!");
        // You can further implement functionality like sending an RSVP request to a server
    });
});
