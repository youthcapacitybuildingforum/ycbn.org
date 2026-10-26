// Touch & Click-friendly Dropdown for Mobile, Tablet & Laptops
(function() {
    // Dropdown toggle for screens up to 1400px wide
    document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            // Apply to screens up to 1400px (covers 1280px laptops)
            if (window.innerWidth <= 1400) {
                e.preventDefault();
                e.stopPropagation(); // Stop the click from immediately closing the menu
                
                var container = this.closest('.dropdown-container');
                var dropdown = container.querySelector('.dropdown-menu');
                var isOpen = dropdown.classList.contains('open');
                
                // Close all other dropdowns
                document.querySelectorAll('.dropdown-menu.open').forEach(function(d) {
                    d.classList.remove('open');
                    var arrow = d.closest('.dropdown-container').querySelector('.fa-chevron-down');
                    if (arrow) arrow.classList.remove('rotate-180');
                });
                
                // Toggle the clicked one
                if (!isOpen) {
                    dropdown.classList.add('open');
                    var arrow = this.querySelector('.fa-chevron-down');
                    if (arrow) arrow.classList.add('rotate-180');
                }
            }
        });
    });
    
    // Mobile menu submenu toggle
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var content = this.nextElementSibling;
            var isOpen = !content.classList.contains('hidden');
            var arrow = this.querySelector('.fa-chevron-down');
            
            // Close all other mobile submenus
            document.querySelectorAll('.mobile-dropdown-content').forEach(function(c) {
                c.classList.add('hidden');
                var ca = c.previousElementSibling.querySelector('.fa-chevron-down');
                if (ca) ca.classList.remove('rotate-180');
            });
            
            if (!isOpen) {
                content.classList.remove('hidden');
                if (arrow) arrow.classList.add('rotate-180');
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown-container') && !e.target.closest('.mobile-dropdown')) {
            document.querySelectorAll('.dropdown-menu.open').forEach(function(d) {
                d.classList.remove('open');
                var arrow = d.closest('.dropdown-container').querySelector('.fa-chevron-down');
                if (arrow) arrow.classList.remove('rotate-180');
            });
            document.querySelectorAll('.mobile-dropdown-content').forEach(function(c) {
                c.classList.add('hidden');
                var arrow = c.previousElementSibling.querySelector('.fa-chevron-down');
                if (arrow) arrow.classList.remove('rotate-180');
            });
        }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown-menu.open').forEach(function(d) {
                d.classList.remove('open');
                var arrow = d.closest('.dropdown-container').querySelector('.fa-chevron-down');
                if (arrow) arrow.classList.remove('rotate-180');
            });
            document.querySelectorAll('.mobile-dropdown-content').forEach(function(c) {
                c.classList.add('hidden');
                var arrow = c.previousElementSibling.querySelector('.fa-chevron-down');
                if (arrow) arrow.classList.remove('rotate-180');
            });
        }
    });
})();