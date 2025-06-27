
 const firebaseConfig = {
  apiKey: "AIzaSyDexF7vJsXLz3VYEGdIqsaHDcqZVdxSS54",
  authDomain: "birthday-seventeen.firebaseapp.com",
  projectId: "birthday-seventeen",
  storageBucket: "birthday-seventeen.firebasestorage.app",
  messagingSenderId: "146029137165",
  appId: "1:146029137165:web:a26f8433c68b77ef797444",
  measurementId: "G-9EE23NP3TE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ambil data dari form
            const namaLengkap = document.querySelector('input[type="text"]').value.trim();
            const attendance = document.querySelector('input[name="attendance"]:checked');
            const jumlahTamu = document.querySelector('select').value;
            
            // Validasi input
            if (!namaLengkap) {
               showNotification('Jangan lupa isi namamu ya!');
                return;
            }
            
            if (!attendance) {
               showNotification('Konfirmasi kehadiranmu dlu yuk!');
                return;
            }
            
            // Siapkan data untuk disimpan
            const attendanceData = {
                nama: namaLengkap,
                status: attendance.value,
                jumlahOrang: jumlahTamu,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                tanggalDibuat: new Date().toISOString()
            };
            
            // Tampilkan loading
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Mengirim...';
            submitButton.disabled = true;
            
            // Simpan ke Firebase Realtime Database
            database.ref('attendance').push(attendanceData)
                .then(() => {
                    // Berhasil
                   showNotification('Kehadiran terkirim! Sampai ketemu di acara ya!');
                    
                    // Reset form
                    form.reset();
                    
                    // Restore button
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    
                    // Refresh tabel jika ada
                    if (typeof loadAttendanceData === 'function') {
                        loadAttendanceData();
                    }
                })
                .catch((error) => {
                    // Error
                    console.error('Error:', error);
                   showNotification('pastikan internetmu baik ya!');
                    
                    // Restore button
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        });
    }
});
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
.notification {
    position: fixed;
    top: 20px; /* ubah dari bottom ke top */
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    background-color: #faf9f6;
    color: #8b5e34;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-left: 4px solid #d4c5a9;
    transform: translateY(-100px); /* ubah translateY agar animasi muncul dari atas */
    opacity: 0;
    transition: all 0.3s ease-out;
    z-index: 1000;
    max-width: 300px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.notification.show {
    transform: translateY(0);
    opacity: 1;
}

.notification-icon {
    font-size: 20px;
}

.notification-close {
    margin-left: 12px;
    cursor: pointer;
    opacity: 0.7;
    font-size: 14px;
}

.notification-close:hover {
    opacity: 1;
}
`;

document.head.appendChild(notificationStyle);

// Notification function
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Add appropriate icon based on message type
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.textContent = isError ? '❌' : '💝';
    
    const text = document.createElement('span');
    text.textContent = message;
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'notification-close';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeBtn);
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}
// Fungsi untuk format status badge
function getStatusBadge(status) {
    if (status === 'hadir') {
        return '<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Hadir</span>';
    } else if (status === 'tidak') {
        return '<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Tidak Hadir</span>';
    } else {
        return '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>';
    }
}
