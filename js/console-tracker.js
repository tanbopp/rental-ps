// Console Availability Tracker & Booking System
document.addEventListener('DOMContentLoaded', function() {
    // Console inventory data
    const consoleInventory = {
        'ps5-standard': {
            name: 'PlayStation 5 Standard',
            total: 15,
            available: 12,
            rented: 3,
            price: 150000,
            category: 'ps5'
        },
        'ps5-digital': {
            name: 'PlayStation 5 Digital',
            total: 8,
            available: 2,
            rented: 6,
            price: 130000,
            category: 'ps5'
        },
        'ps4-pro': {
            name: 'PlayStation 4 Pro',
            total: 12,
            available: 8,
            rented: 4,
            price: 100000,
            category: 'ps4'
        },
        'ps4-slim': {
            name: 'PlayStation 4 Slim',
            total: 20,
            available: 15,
            rented: 5,
            price: 80000,
            category: 'ps4'
        },
        'controllers': {
            name: 'Controller Tambahan',
            total: 65,
            available: 58,
            rented: 7,
            price: 25000,
            category: 'accessory'
        }
    };

    // Update availability status indicators
    function updateAvailabilityStatus() {
        Object.keys(consoleInventory).forEach(consoleId => {
            const console = consoleInventory[consoleId];
            const availabilityPercent = (console.available / console.total) * 100;
            
            // Find console cards by searching for console names
            const consoleCards = document.querySelectorAll('.bg-white');
            
            consoleCards.forEach(card => {
                const titleElement = card.querySelector('h3');
                if (titleElement && titleElement.textContent.includes(console.name)) {
                    updateConsoleCard(card, console, availabilityPercent);
                }
            });
        });
        
        // Update hero stats
        updateHeroStats();
    }

    // Update individual console card
    function updateConsoleCard(card, console, availabilityPercent) {
        // Update status badge
        const statusBadge = card.querySelector('span');
        if (statusBadge && statusBadge.textContent.includes('Tersedia') || 
            statusBadge.textContent.includes('Terbatas') || 
            statusBadge.textContent.includes('Habis')) {
            
            if (availabilityPercent > 50) {
                statusBadge.className = 'bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium';
                statusBadge.textContent = 'Tersedia';
            } else if (availabilityPercent > 0) {
                statusBadge.className = 'bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium';
                statusBadge.textContent = 'Terbatas';
            } else {
                statusBadge.className = 'bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium';
                statusBadge.textContent = 'Habis';
            }
        }

        // Update availability numbers
        const availableElements = card.querySelectorAll('span');
        availableElements.forEach(span => {
            if (span.textContent.includes('Unit')) {
                const parent = span.parentElement;
                if (parent && parent.textContent.includes('Tersedia:')) {
                    span.textContent = `${console.available} Unit`;
                    span.className = `font-semibold ${availabilityPercent > 50 ? 'text-green-600' : availabilityPercent > 0 ? 'text-yellow-600' : 'text-red-600'}`;
                }
                if (parent && parent.textContent.includes('Total Unit:')) {
                    span.textContent = `${console.total} Unit`;
                }
                if (parent && parent.textContent.includes('Disewa:')) {
                    span.textContent = `${console.rented} Unit`;
                }
            }
        });

        // Update progress bar
        const progressBars = card.querySelectorAll('.bg-green-500, .bg-yellow-500, .bg-red-500');
        progressBars.forEach(bar => {
            if (bar.classList.contains('h-2')) {
                bar.style.width = `${availabilityPercent}%`;
                
                // Update color based on availability
                bar.className = bar.className.replace(/bg-(green|yellow|red)-500/, '');
                if (availabilityPercent > 50) {
                    bar.classList.add('bg-green-500');
                } else if (availabilityPercent > 0) {
                    bar.classList.add('bg-yellow-500');
                } else {
                    bar.classList.add('bg-red-500');
                }
            }
        });

        // Update booking button
        const bookingButton = card.querySelector('button');
        if (bookingButton && bookingButton.textContent.includes('Booking')) {
            if (console.available > 0) {
                bookingButton.disabled = false;
                bookingButton.className = bookingButton.className.replace('bg-gray-300', '');
                if (availabilityPercent > 50) {
                    bookingButton.className = 'w-full bg-gradient-to-r from-ps-blue to-ps-dark-blue text-white py-3 px-6 rounded-full font-semibold hover:from-ps-dark-blue hover:to-ps-blue transition-all duration-300 transform hover:scale-105';
                } else {
                    bookingButton.className = 'w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-6 rounded-full font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105';
                }
                bookingButton.textContent = 'Booking Sekarang';
            } else {
                bookingButton.disabled = true;
                bookingButton.className = 'w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-full font-semibold cursor-not-allowed';
                bookingButton.textContent = 'Tidak Tersedia';
            }
        }
    }

    // Update hero section stats
    function updateHeroStats() {
        const ps5Available = consoleInventory['ps5-standard'].available + consoleInventory['ps5-digital'].available;
        const ps4Available = consoleInventory['ps4-pro'].available + consoleInventory['ps4-slim'].available;

        // Update PS5 stat
        const ps5StatElements = document.querySelectorAll('h3');
        ps5StatElements.forEach(h3 => {
            if (h3.textContent === '15' && h3.nextElementSibling && h3.nextElementSibling.textContent.includes('PS5')) {
                h3.textContent = ps5Available;
            }
            if (h3.textContent === '8' && h3.nextElementSibling && h3.nextElementSibling.textContent.includes('PS4')) {
                h3.textContent = ps4Available;
            }
        });
    }

    // Booking functionality
    function handleBooking(consoleName) {
        // Find console in inventory
        let consoleKey = null;
        Object.keys(consoleInventory).forEach(key => {
            if (consoleInventory[key].name === consoleName || consoleInventory[key].name.includes(consoleName)) {
                consoleKey = key;
            }
        });        if (!consoleKey) {
            console.log('Console tidak ditemukan!');
            return;
        }

        const console = consoleInventory[consoleKey];
          if (console.available <= 0) {
            console.log(`Maaf, ${console.name} sedang tidak tersedia`);
            return;
        }        // Auto-book the console (removing confirmation dialog)
        // Update inventory
        console.available--;
        console.rented++;

        // Update UI
        updateAvailabilityStatus();

        console.log(`Booking berhasil! ${console.name} telah dibooking.`);
    }

    // Add event listeners for booking buttons
    function initializeBookingButtons() {
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach(button => {
            if (button.textContent.includes('Booking Sekarang')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Find the console name from the card
                    const card = button.closest('.bg-white');
                    if (card) {
                        const titleElement = card.querySelector('h3');
                        if (titleElement) {
                            const consoleName = titleElement.textContent.trim();
                            handleBooking(consoleName);
                        }
                    }
                });
            }
            
            if (button.textContent.includes('Tambah ke Booking')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleBooking('Controller Tambahan');
                });
            }
        });
    }

    // Real-time simulation
    function simulateRealTimeUpdates() {
        setInterval(() => {
            // Randomly return a console (simulate rental return)
            const consoleKeys = Object.keys(consoleInventory);
            const randomConsoleKey = consoleKeys[Math.floor(Math.random() * consoleKeys.length)];
            const console = consoleInventory[randomConsoleKey];
            
            // 5% chance every 30 seconds that someone returns a console
            if (console.rented > 0 && Math.random() < 0.05) {
                console.available++;                console.rented--;
                updateAvailabilityStatus();
                
                console.log(`${console.name} baru saja tersedia!`);
            }
            
            // 3% chance someone books a console
            if (console.available > 0 && Math.random() < 0.03) {
                console.available--;                console.rented++;
                updateAvailabilityStatus();
                
                if (console.available <= 2) {
                    console.log(`Stok ${console.name} tinggal ${console.available} unit!`);
                }
            }
        }, 30000); // Every 30 seconds
    }

    // Initialize console tracker
    function initializeConsoleTracker() {
        updateAvailabilityStatus();
        initializeBookingButtons();
        simulateRealTimeUpdates();
          // Update every 10 seconds for UI refresh
        setInterval(updateAvailabilityStatus, 10000);
        
        console.log('Console Tracker initialized! 🎮');
    }

    // Start the tracker
    initializeConsoleTracker();
});
