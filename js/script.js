// Steam-like Gaming Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    const closeBtns = document.querySelectorAll('.close');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    // Login button (in header)
    const headerLoginBtn = document.querySelector('button:contains("Masuk")');
    const headerRegisterBtn = document.querySelector('button:contains("Daftar")');

    // Get buttons by text content
    const allButtons = document.querySelectorAll('button');
    let loginButton, registerButton;
    
    allButtons.forEach(btn => {
        if (btn.textContent.trim() === 'Masuk') {
            loginButton = btn;
        }
        if (btn.textContent.trim() === 'Daftar') {
            registerButton = btn;
        }
    });

    // Open login modal
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            loginModal.classList.remove('hidden');
        });
    }

    // Open register modal
    if (registerButton) {
        registerButton.addEventListener('click', function() {
            registerModal.classList.remove('hidden');
        });
    }

    // Switch between modals
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.add('hidden');
            registerModal.classList.remove('hidden');
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.classList.add('hidden');
            loginModal.classList.remove('hidden');
        });
    }

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            loginModal.classList.add('hidden');
            registerModal.classList.add('hidden');
        });
    });

    // Close modal when clicking outside
    [loginModal, registerModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 80; // Account for fixed header
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('bg-steam-dark/98');
            header.classList.remove('bg-steam-dark/95');
        } else {
            header.classList.add('bg-steam-dark/95');
            header.classList.remove('bg-steam-dark/98');
        }
        
        lastScrollTop = scrollTop;
    });

    // Game card hover effects (already handled by CSS, but can add more interactivity)
    const gameCards = document.querySelectorAll('.group');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateY(0deg)';
        });
    });

    // Package selection
    const packageBtns = document.querySelectorAll('.btn-package, button:contains("Pilih Paket")');
    packageBtns.forEach(btn => {
        if (btn.textContent.includes('Pilih Paket')) {
            btn.addEventListener('click', function() {                // Package selection logic - redirect to booking
                const packageCard = this.closest('.bg-steam-dark, .package-card');
                const packageName = packageCard.querySelector('h3').textContent;
                
                // Scroll to availability section to see consoles
                const availabilitySection = document.getElementById('availability');
                if (availabilitySection) {
                    availabilitySection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });

    // Rental now buttons
    const rentalBtns = document.querySelectorAll('button:contains("Rental Sekarang")');
    rentalBtns.forEach(btn => {
        if (btn.textContent.includes('Rental Sekarang')) {            btn.addEventListener('click', function() {
                const gameCard = this.closest('.group');
                const gameName = gameCard.querySelector('h3').textContent;
                
                // Scroll to availability section
                const availabilitySection = document.getElementById('availability');
                if (availabilitySection) {
                    availabilitySection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });

    // Hero action buttons
    const heroButtons = document.querySelectorAll('.hero button');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('Mulai Rental')) {
                document.getElementById('packages').scrollIntoView({ behavior: 'smooth' });
            } else if (this.textContent.includes('Lihat Katalog')) {
                document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // Set initial styles
        img.style.opacity = '0';
        img.style.transform = 'scale(1.1)';
        img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = this.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                    input.style.boxShadow = '0 0 0 1px #ef4444';
                } else {
                    input.style.borderColor = '#374151';
                    input.style.boxShadow = 'none';
                }
            });
            
            if (isValid) {
                // Show success message
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Berhasil!';
                submitBtn.style.backgroundColor = '#10b981';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    // Close modal
                    loginModal.classList.add('hidden');
                    registerModal.classList.add('hidden');
                }, 2000);
            }
        });
    });

    // Add some particle effects for hero section (optional)
    function createParticles() {
        const hero = document.querySelector('#home');
        if (!hero) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-1 h-1 bg-steam-blue rounded-full opacity-20';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 4 + 's';
            hero.appendChild(particle);
        }
    }

    // Add CSS animation for particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.2;
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 0.5;
            }
        }
        
        .game-card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .game-card-hover:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(102, 192, 244, 0.3);
        }
    `;
    document.head.appendChild(style);

    // Initialize particles
    createParticles();

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-xl';
            } else {
                icon.className = 'fas fa-times text-xl';
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars text-xl';
            });
        });
    }

    console.log('RentalPS website loaded successfully! 🎮');
});
