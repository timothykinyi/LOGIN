document.addEventListener('DOMContentLoaded', () => {
    fetchUserDetails();
});

function fetchUserDetails() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('You must be logged in to view this page.');
        window.location.href = 'index.html'; // Redirect to login page if not logged in
        return;
    }

    fetch('https://login-9ebe.onrender.com/api/auth/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            document.getElementById('user-details').style.display = 'block';
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
        } else {
            console.error('Failed to fetch user details');
        }
    })
    .catch(error => console.error('Error:', error));
}
