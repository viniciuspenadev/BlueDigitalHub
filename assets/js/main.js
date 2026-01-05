// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuDropdown = document.getElementById('mobile-menu-dropdown');
    const menuIcon = document.getElementById('mobile-menu-icon');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    if (menuBtn && menuDropdown) {
        menuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            toggleMenu();
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                toggleMenu();
            });
        });
    }

    function toggleMenu() {
        if (isMenuOpen) {
            menuDropdown.classList.remove('hidden');
            // Change icon to X
            menuIcon.setAttribute('data-lucide', 'x');
        } else {
            menuDropdown.classList.add('hidden');
            // Change icon back to Menu
            menuIcon.setAttribute('data-lucide', 'menu');
        }
        // Re-render icons to apply changes
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // --- Portfolio Scroll Logic ---
    const scrollContainer = document.getElementById('portfolio-scroll-container');
    const scrollLeftBtn = document.getElementById('portfolio-scroll-left');
    const scrollRightBtn = document.getElementById('portfolio-scroll-right');
    const progressBar = document.getElementById('portfolio-progress-bar');
    const portfolioSection = document.getElementById('portfolio');

    if (scrollContainer && progressBar) {

        // Update Progress Bar
        const updateProgress = () => {
            const scrollLeft = scrollContainer.scrollLeft;
            const scrollWidth = scrollContainer.scrollWidth;
            const clientWidth = scrollContainer.clientWidth;

            const maxScroll = scrollWidth - clientWidth;
            const progress = (scrollLeft / maxScroll) * 100;

            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        };

        scrollContainer.addEventListener('scroll', updateProgress);

        // Buttons
        const scrollAmount = 450;

        if (scrollLeftBtn) {
            scrollLeftBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        if (scrollRightBtn) {
            scrollRightBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
        // Hover Blur Effect (Ported from React)
        // We will add a class 'has-hover' to container when any card is hovered
        const cards = document.querySelectorAll('.portfolio-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Add blur to all OTHER cards
                cards.forEach(c => {
                    if (c !== card) {
                        c.classList.add('opacity-70', 'blur-[1px]', 'scale-95');
                        c.classList.remove('opacity-100');
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                // Remove blur from all
                cards.forEach(c => {
                    c.classList.remove('opacity-70', 'blur-[1px]', 'scale-95');
                    c.classList.add('opacity-100');
                });
            });
        });
    }
});
