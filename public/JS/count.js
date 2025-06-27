// Firebase Database References
const attendanceRef = database.ref('attendance');
const wishesRef = database.ref('wishes');

// Elements
const totalHadirElement = document.getElementById('totalHadir');
const totalUcapanElement = document.getElementById('totalUcapan');

// Function to fetch and update totals
async function fetchTotals() {
    try {
        // Fetch total attendance (hadir)
        const attendanceSnapshot = await attendanceRef.once('value');
        let totalHadir = 0;
        
        if (attendanceSnapshot.exists()) {
            const attendanceData = attendanceSnapshot.val();
            // Count only records with status "hadir"
            totalHadir = Object.values(attendanceData).filter(item => 
                item.status === 'hadir'
            ).length;
        }
        
        // Fetch total wishes (ucapan)
        const wishesSnapshot = await wishesRef.once('value');
        let totalUcapan = 0;
        
        if (wishesSnapshot.exists()) {
            const wishesData = wishesSnapshot.val();
            totalUcapan = Object.keys(wishesData).length;
        }
        
        // Update UI with animation
        updateCounterWithAnimation(totalHadirElement, totalHadir);
        updateCounterWithAnimation(totalUcapanElement, totalUcapan);
        
    } catch (error) {
        console.error('Error fetching totals:', error);
        // Set default values on error
        totalHadirElement.textContent = '0';
        totalUcapanElement.textContent = '0';
    }
}

// Function to animate counter updates
function updateCounterWithAnimation(element, targetValue) {
    const currentValue = parseInt(element.textContent) || 0;
    const increment = targetValue > currentValue ? 1 : -1;
    const duration = 1000; // 1 second
    const steps = Math.abs(targetValue - currentValue);
    const stepDuration = steps > 0 ? duration / steps : 0;
    
    if (steps === 0) return;
    
    let current = currentValue;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current.toString();
        
        if (current === targetValue) {
            clearInterval(timer);
        }
    }, stepDuration);
}

// Real-time listeners for live updates
function setupRealTimeListeners() {
    // Listen for attendance changes
    attendanceRef.on('value', (snapshot) => {
        let totalHadir = 0;
        
        if (snapshot.exists()) {
            const attendanceData = snapshot.val();
            totalHadir = Object.values(attendanceData).filter(item => 
                item.status === 'hadir'
            ).length;
        }
        
        updateCounterWithAnimation(totalHadirElement, totalHadir);
    });
    
    // Listen for wishes changes
    wishesRef.on('value', (snapshot) => {
        let totalUcapan = 0;
        
        if (snapshot.exists()) {
            const wishesData = snapshot.val();
            totalUcapan = Object.keys(wishesData).length;
        }
        
        updateCounterWithAnimation(totalUcapanElement, totalUcapan);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initial fetch
    fetchTotals();
    
    // Setup real-time listeners for live updates
    setupRealTimeListeners();
});

// Optional: Manual refresh function
function refreshTotals() {
    fetchTotals();
}

// Optional: Clean up listeners when page unloads
window.addEventListener('beforeunload', function() {
    attendanceRef.off();
    wishesRef.off();
});