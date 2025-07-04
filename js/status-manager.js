// Real-time Console Status Updates
class ConsoleStatusManager {
    constructor() {
        this.consoles = {
            'PlayStation 5 Standard': { 
                total: 15, 
                available: 12, 
                rented: 3,
                price: 150000,
                lastUpdate: Date.now()
            },
            'PlayStation 5 Digital': { 
                total: 8, 
                available: 2, 
                rented: 6,
                price: 130000,
                lastUpdate: Date.now()
            },
            'PlayStation 4 Pro': { 
                total: 12, 
                available: 8, 
                rented: 4,
                price: 100000,
                lastUpdate: Date.now()
            },
            'PlayStation 4 Slim': { 
                total: 20, 
                available: 15, 
                rented: 5,
                price: 80000,
                lastUpdate: Date.now()
            },
            'Controller Tambahan': { 
                total: 65, 
                available: 58, 
                rented: 7,
                price: 25000,
                lastUpdate: Date.now()
            }
        };
        
        this.init();
    }

    init() {
        this.updateDisplay();
        this.startRealTimeUpdates();
        this.setupEventListeners();
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.simulateStatusChanges();
            this.updateDisplay();
        }, 30000);
    }

    simulateStatusChanges() {
        Object.keys(this.consoles).forEach(consoleName => {
            const console = this.consoles[consoleName];
            
            // Random small changes to simulate real bookings
            if (Math.random() > 0.7) { // 30% chance of change
                const change = Math.random() > 0.5 ? 1 : -1;
                const newAvailable = Math.max(0, Math.min(console.total, console.available + change));
                
                if (newAvailable !== console.available) {
                    console.available = newAvailable;
                    console.rented = console.total - console.available;                    console.lastUpdate = Date.now();
                }
            }
        });
    }

    updateDisplay() {
        Object.keys(this.consoles).forEach(consoleName => {
            this.updateConsoleCard(consoleName);
        });
        
        this.updateHeroStats();
    }

    updateConsoleCard(consoleName) {
        const console = this.consoles[consoleName];
        const cards = document.querySelectorAll('.console-card, .bg-white');
        
        cards.forEach(card => {
            const title = card.querySelector('h3');
            if (title && title.textContent.includes(consoleName.split(' ')[0])) {
                this.updateCardContent(card, console);
            }
        });
    }

    updateCardContent(card, console) {
        // Update availability numbers
        const availableSpan = card.querySelector('.text-green-600');
        const rentedSpan = card.querySelector('.text-orange-600');
        const progressBar = card.querySelector('.progress-bar, .bg-green-500, .bg-yellow-500');
        const statusBadge = card.querySelector('.status-available, .bg-green-500, .bg-yellow-500, .bg-red-500');
        
        if (availableSpan) {
            availableSpan.textContent = `${console.available} Unit`;
        }
        
        if (rentedSpan) {
            rentedSpan.textContent = `${console.rented} Unit`;
        }
        
        // Update progress bar
        if (progressBar) {
            const percentage = (console.available / console.total) * 100;
            progressBar.style.width = `${percentage}%`;
            
            // Update color based on availability
            progressBar.className = progressBar.className.replace(/bg-(green|yellow|red)-500/, 
                percentage > 50 ? 'bg-green-500' : 
                percentage > 20 ? 'bg-yellow-500' : 'bg-red-500');
        }
        
        // Update status badge
        if (statusBadge) {
            if (console.available === 0) {
                statusBadge.textContent = 'Habis';
                statusBadge.className = statusBadge.className.replace(/bg-(green|yellow)-500/, 'bg-red-500');
            } else if (console.available <= 3) {
                statusBadge.textContent = 'Terbatas';
                statusBadge.className = statusBadge.className.replace(/bg-(green|red)-500/, 'bg-yellow-500');
            } else {
                statusBadge.textContent = 'Tersedia';
                statusBadge.className = statusBadge.className.replace(/bg-(yellow|red)-500/, 'bg-green-500');
            }
        }
        
        // Update booking button state
        const bookingButton = card.querySelector('button');
        if (bookingButton) {
            if (console.available === 0) {
                bookingButton.disabled = true;
                bookingButton.textContent = 'Stok Habis';
                bookingButton.className = bookingButton.className.replace(/hover:scale-105/, '') + ' opacity-50 cursor-not-allowed';
            } else {
                bookingButton.disabled = false;
                bookingButton.textContent = bookingButton.textContent.includes('Tambah') ? 'Tambah ke Booking' : 'Booking Sekarang';
                bookingButton.className = bookingButton.className.replace(' opacity-50 cursor-not-allowed', '') + ' hover:scale-105';
            }
        }
    }

    updateHeroStats() {
        // Update hero section stats
        const ps5Available = this.consoles['PlayStation 5 Standard'].available + this.consoles['PlayStation 5 Digital'].available;
        const ps4Available = this.consoles['PlayStation 4 Pro'].available + this.consoles['PlayStation 4 Slim'].available;
        
        const heroStats = document.querySelectorAll('.text-center.p-4');
        heroStats.forEach(stat => {
            const heading = stat.querySelector('h3');
            if (heading) {
                if (heading.textContent.includes('PS5')) {
                    heading.textContent = ps5Available;
                } else if (heading.textContent.includes('PS4')) {
                    heading.textContent = ps4Available;
                }
            }
        });
    }

    getConsoleData(consoleName) {
        return this.consoles[consoleName] || null;
    }

    bookConsole(consoleName, quantity = 1) {
        const console = this.consoles[consoleName];
        if (console && console.available >= quantity) {
            console.available -= quantity;
            console.rented += quantity;
            console.lastUpdate = Date.now();
            this.updateDisplay();
            return true;
        }
        return false;
    }

    setupEventListeners() {
        // Add refresh button functionality
        const refreshBtn = document.createElement('button');
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>Update Status';
        refreshBtn.className = 'fixed bottom-4 right-4 bg-ps-blue text-white px-4 py-2 rounded-full shadow-lg hover:bg-ps-dark-blue transition-colors z-40';        refreshBtn.addEventListener('click', () => {
            this.simulateStatusChanges();
            this.updateDisplay();
            console.log('Status konsol telah diperbarui!');
        });
        document.body.appendChild(refreshBtn);
    }
}

// Initialize console status manager
document.addEventListener('DOMContentLoaded', function() {
    window.consoleStatusManager = new ConsoleStatusManager();
    console.log('Console Status Manager initialized! 📊');
});

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConsoleStatusManager;
}
