// Advanced Booking System for PlayStation Console Rental
document.addEventListener('DOMContentLoaded', function() {
    const bookingModal = document.getElementById('bookingModal');
    const closeBookingButtons = document.querySelectorAll('.close-booking');
    
    // Console data with updated pricing
    const consoleData = {
        'PlayStation 5 Standard': {
            icon: 'PS5',
            price: 150000,
            gradient: 'from-ps-blue to-ps-dark-blue',
            available: 12
        },
        'PlayStation 5 Digital': {
            icon: 'PS5',
            price: 130000,
            gradient: 'from-ps-blue to-ps-dark-blue',
            available: 2
        },
        'PlayStation 4 Pro': {
            icon: 'PS4',
            price: 100000,
            gradient: 'from-gray-700 to-gray-900',
            available: 8
        },
        'PlayStation 4 Slim': {
            icon: 'PS4',
            price: 80000,
            gradient: 'from-gray-600 to-gray-800',
            available: 15
        },
        'Controller Tambahan': {
            icon: '🎮',
            price: 25000,
            gradient: 'from-purple-500 to-purple-700',
            available: 58
        }
    };    // Open booking modal with enhanced mobile support
    function openBookingModal(consoleName) {
        const console = consoleData[consoleName];
        if (!console) return;

        // Update modal content
        document.getElementById('consoleIcon').textContent = console.icon;
        document.getElementById('consoleName').textContent = consoleName;
        document.getElementById('consolePrice').textContent = `Rp ${console.price.toLocaleString()}/hari`;
        document.getElementById('consoleAvailability').textContent = `${console.available} unit tersedia`;
        document.getElementById('pricePerDay').textContent = `Rp ${console.price.toLocaleString()}`;

        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').min = today;
        document.getElementById('endDate').min = today;
        
        // Set default dates
        document.getElementById('startDate').value = today;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('endDate').value = tomorrow.toISOString().split('T')[0];

        // Update console icon gradient
        const iconElement = document.getElementById('consoleIcon').parentElement;
        iconElement.className = `w-16 h-16 bg-gradient-to-br ${console.gradient} rounded-lg flex items-center justify-center`;

        // Calculate initial price
        calculateTotalPrice();

        // Show modal and lock body scroll
        bookingModal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstInput = bookingModal.querySelector('input, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    // Close booking modal with enhanced cleanup
    function closeBookingModal() {
        bookingModal.classList.add('hidden');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.getElementById('bookingForm').reset();
        
        // Reset booking content to original form
        const bookingContent = document.getElementById('bookingContent');
        if (bookingContent && !bookingContent.querySelector('form')) {
            location.reload(); // Reload if form was replaced with success message
        }
    }

    // Calculate total price
    function calculateTotalPrice() {
        const consoleName = document.getElementById('consoleName').textContent;
        const console = consoleData[consoleName];
        const duration = parseInt(document.getElementById('rentalDuration').value) || 1;
        
        if (!console) return;

        const basePrice = console.price * duration;
        const deliveryFee = 50000;
        const totalPrice = basePrice + deliveryFee;

        document.getElementById('durationDisplay').textContent = `${duration} hari`;
        document.getElementById('totalPrice').textContent = `Rp ${totalPrice.toLocaleString()}`;
    }

    // Handle date changes
    function handleDateChange() {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        
        if (startDate && endDate && endDate > startDate) {
            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            document.getElementById('rentalDuration').value = duration;
            calculateTotalPrice();
        }
    }

    // Generate WhatsApp message
    function generateWhatsAppMessage(formData) {
        const consoleName = document.getElementById('consoleName').textContent;
        const duration = document.getElementById('durationDisplay').textContent;
        const totalPrice = document.getElementById('totalPrice').textContent;
        
        return `🎮 *BOOKING PLAYSTATION CONSOLE* 🎮

📱 *Detail Booking:*
• Konsol: ${consoleName}
• Durasi: ${duration}
• Total Harga: ${totalPrice}

📅 *Jadwal:*
• Mulai: ${formData.startDate}
• Selesai: ${formData.endDate}

📍 *Alamat Pengiriman:*
${formData.address}

📞 *Kontak:* ${formData.whatsapp}

${formData.notes ? `📝 *Catatan:*\n${formData.notes}` : ''}

Mohon konfirmasi booking ini. Terima kasih! 🙏`;
    }

    // Handle booking submission
    function handleBookingSubmission(e) {
        e.preventDefault();
        
        const formData = {
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            duration: document.getElementById('rentalDuration').value,
            address: document.getElementById('deliveryAddress').value,
            whatsapp: document.getElementById('whatsappNumber').value,
            notes: document.getElementById('additionalNotes').value
        };        // Validate form
        if (!formData.startDate || !formData.endDate || !formData.address || !formData.whatsapp) {
            console.log('Mohon lengkapi semua field yang diperlukan!');
            return;
        }

        // Validate phone number
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        if (!phoneRegex.test(formData.whatsapp.replace(/\s/g, ''))) {
            console.log('Format nomor WhatsApp tidak valid!');
            return;
        }

        // Generate WhatsApp URL
        const message = generateWhatsAppMessage(formData);
        const whatsappURL = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;

        // Show success message
        showBookingSuccess(whatsappURL);
    }

    // Show booking success
    function showBookingSuccess(whatsappURL) {
        const successHtml = `
            <div class="text-center py-8">
                <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-check text-white text-3xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-ps-text mb-4">Booking Berhasil!</h3>
                <p class="text-ps-text-light mb-6">
                    Booking Anda telah berhasil dibuat. Silakan lanjutkan ke WhatsApp untuk konfirmasi dengan tim kami.
                </p>
                <div class="space-y-3">
                    <a href="${whatsappURL}" target="_blank" 
                       class="inline-flex items-center justify-center w-full py-3 px-6 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors">
                        <i class="fab fa-whatsapp mr-2 text-xl"></i>
                        Lanjut ke WhatsApp
                    </a>
                    <button type="button" onclick="closeBookingModal()" 
                            class="w-full py-3 px-6 border border-ps-gray text-ps-text-light rounded-full hover:bg-ps-light-gray transition-colors">
                        Tutup
                    </button>
                </div>
                <div class="mt-6 p-4 bg-ps-blue/10 rounded-lg">
                    <p class="text-sm text-ps-text-light">
                        <i class="fas fa-info-circle mr-2 text-ps-blue"></i>
                        Tim kami akan merespons dalam 15 menit untuk konfirmasi booking dan jadwal pengiriman.
                    </p>
                </div>
            </div>
        `;
        
        document.getElementById('bookingContent').innerHTML = successHtml;
        
        // Auto close after 10 seconds if user doesn't interact
        setTimeout(() => {
            if (!bookingModal.classList.contains('hidden')) {
                closeBookingModal();
            }
        }, 10000);
    }    // Initialize booking system
    function initializeBookingSystem() {
        // Add event listeners for booking buttons
        document.querySelectorAll('button').forEach(button => {
            if (button.textContent.includes('Booking Sekarang')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const card = button.closest('.bg-white');
                    if (card) {
                        const titleElement = card.querySelector('h3');
                        if (titleElement) {
                            const consoleName = titleElement.textContent.trim();
                            openBookingModal(consoleName);
                        }
                    }
                });
            }
        });

        // Close modal event listeners
        closeBookingButtons.forEach(button => {
            button.addEventListener('click', closeBookingModal);
        });        // Close modal when clicking outside
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });

        // Enhanced mobile modal behavior
        bookingModal.addEventListener('touchmove', (e) => {
            // Prevent body scroll on mobile when modal is open
            if (e.target === bookingModal) {
                e.preventDefault();
            }
        }, { passive: false });

        // Prevent zoom on form inputs for iOS
        const formInputs = bookingModal.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (window.innerWidth <= 768) {
                    // Temporarily adjust viewport to prevent zoom
                    const viewport = document.querySelector('meta[name=viewport]');
                    const originalContent = viewport.content;
                    viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
                    
                    input.addEventListener('blur', () => {
                        viewport.content = originalContent;
                    }, { once: true });
                }
            });
        });

        // Form event listeners
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', handleBookingSubmission);
        }

        // Date change listeners
        document.getElementById('startDate').addEventListener('change', handleDateChange);
        document.getElementById('endDate').addEventListener('change', handleDateChange);
        document.getElementById('rentalDuration').addEventListener('change', calculateTotalPrice);

        // Auto-update end date when start date changes
        document.getElementById('startDate').addEventListener('change', function() {
            const startDate = new Date(this.value);
            const duration = parseInt(document.getElementById('rentalDuration').value);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + duration);
            document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
        });

        console.log('Booking System initialized! 📅');
    }

    // Make functions globally accessible
    window.openBookingModal = openBookingModal;
    window.closeBookingModal = closeBookingModal;

    // Initialize
    initializeBookingSystem();
});