// Mobile Modal Enhancement Script
document.addEventListener('DOMContentLoaded', function() {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    // Enhanced modal behavior for mobile
    if (isMobile) {
        const bookingModal = document.getElementById('bookingModal');
        
        if (bookingModal) {
            // Prevent viewport scale on input focus
            const viewport = document.querySelector('meta[name=viewport]');
            const originalViewport = viewport ? viewport.content : '';
            
            // Handle input focus to prevent zoom
            bookingModal.addEventListener('focusin', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    if (viewport) {
                        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                    }
                }
            });
            
            // Restore viewport on blur
            bookingModal.addEventListener('focusout', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    setTimeout(() => {
                        if (viewport) {
                            viewport.content = originalViewport || 'width=device-width, initial-scale=1.0';
                        }
                    }, 100);
                }
            });
            
            // Smooth scroll to focused input
            bookingModal.addEventListener('focusin', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    setTimeout(() => {
                        e.target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 300);
                }
            });
            
            // Handle keyboard visibility on mobile
            let initialViewportHeight = window.innerHeight;
            
            window.addEventListener('resize', () => {
                const currentHeight = window.innerHeight;
                const heightDifference = initialViewportHeight - currentHeight;
                
                // Keyboard is likely open if height decreased significantly
                if (heightDifference > 150) {
                    bookingModal.style.paddingBottom = heightDifference + 'px';
                } else {
                    bookingModal.style.paddingBottom = '';
                }
            });
        }
    }
    
    // Enhanced scroll lock for all devices
    function lockBodyScroll() {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        document.body.dataset.scrollY = scrollY;
    }
    
    function unlockBodyScroll() {
        const scrollY = document.body.dataset.scrollY;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY));
            delete document.body.dataset.scrollY;
        }
    }
    
    // Override default modal functions with enhanced scroll lock
    if (window.openBookingModal && window.closeBookingModal) {
        const originalOpen = window.openBookingModal;
        const originalClose = window.closeBookingModal;
        
        window.openBookingModal = function(consoleName) {
            originalOpen(consoleName);
            lockBodyScroll();
        };
        
        window.closeBookingModal = function() {
            originalClose();
            unlockBodyScroll();
        };
    }
    
    console.log('Mobile Modal Enhancement loaded! 📱');
});
