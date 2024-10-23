document.addEventListener('DOMContentLoaded', () => {
    function toggleMode() {
        const body = document.querySelector('body');
        const isNight = body.classList.contains('night');
        if (isNight) {
            body.classList.remove('night');
            body.classList.add('day');
            localStorage.setItem('mode', 'day');
        } else {
            body.classList.remove('day');
            body.classList.add('night');
            localStorage.setItem('mode', 'night');
        }
    }

    const switchInput = document.querySelector('#switch input');
    switchInput.addEventListener('change', toggleMode);

    const mode = localStorage.getItem('mode');
    if (mode === 'day') {
        document.querySelector('body').classList.add('day');
        switchInput.checked = false;
    } else {
        document.querySelector('body').classList.add('night');
        switchInput.checked = true;
    }
});

document.getElementById('menuicon').addEventListener('click', function (event) {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active'); // Toggle the 'active' class
    event.stopPropagation(); // Prevent the click from bubbling up
});

// Close sidebar when clicking outside of it
document.addEventListener('click', function (event) {
    const sidebar = document.getElementById('sidebar');
    const menuIcon = document.getElementById('menuicon');

    // Check if the click was outside the sidebar and the menu icon
    if (!sidebar.contains(event.target) && !menuIcon.contains(event.target)) {
        sidebar.classList.remove('active'); // Close the sidebar
    }
});

const navItems = document.querySelectorAll('.nav-item a');
navItems.forEach(item => {
    item.addEventListener('click', function () {
        // Remove 'active' class from all items
        navItems.forEach(i => i.classList.remove('active'));
        // Add 'active' class to the clicked item
        this.classList.add('active');
    });
});
