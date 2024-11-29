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
                <button class="btn-share">🔗 Share</button>
            </div>
        `;
        
        postContainer.prepend(newPost);
        document.querySelector('.create-post textarea').value = ""; // Clear the textarea
    }
});

// Handle like button click
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-like')) {
        event.target.textContent = event.target.textContent === '👍 Like' ? '❤️ Liked' : '👍 Like';
    }
});

// Handle comment button click
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-comment')) {
        alert('Comment functionality is not implemented yet!');
    }
});

// Handle share button click
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-share')) {
        alert('Share functionality is not implemented yet!');
    }
});
