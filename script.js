document.addEventListener('DOMContentLoaded', () => {
    // Handle login form submission
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const message = await response.text();
        alert(message);
    });

    // Handle registration form submission
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const message = await response.text();
        alert(message);
    });

    // Handle notification form submission
    document.getElementById('notification-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = 'testuser'; // Replace with actual logged in user
        const date = document.getElementById('notification-date').value;
        const time = document.getElementById('notification-time').value;
        const specialOrders = document.getElementById('special-orders').value;
        const response = await fetch('/api/notifications/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, notification: { date, time, specialOrders } })
        });
        const message = await response.text();
        alert(message);
    });
});

