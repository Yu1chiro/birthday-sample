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

let editingWishId = null;
let editingAttendanceId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadWishesTable();
    loadAttendanceData();
    createEditModals();
});

// Create modal elements
function createEditModals() {
    // Modal untuk edit wishes
    const wishModal = document.createElement('div');
    wishModal.id = 'editWishModal';
    wishModal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    wishModal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            <div class="bg-gradient-to-r from-beige-600 to-beige-700 text-white px-6 py-4 rounded-t-2xl">
                <h3 class="text-xl font-semibold flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Ucapan
                </h3>
            </div>
            <form id="editWishForm" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Nama
                    </label>
                    <input type="text" id="editWishName" required
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beige-500 focus:border-beige-500 transition-colors bg-gray-50 focus:bg-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        Ucapan
                    </label>
                    <textarea id="editWishMessage" rows="4" required
                              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beige-500 focus:border-beige-500 transition-colors bg-gray-50 focus:bg-white resize-none"></textarea>
                </div>
                <div class="flex space-x-3 pt-4">
                    <button type="submit" 
                            class="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Simpan
                    </button>
                    <button type="button" onclick="closeEditWishModal()" 
                            class="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium">
                        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Batal
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(wishModal);

    // Modal untuk edit attendance
    const attendanceModal = document.createElement('div');
    attendanceModal.id = 'editAttendanceModal';
    attendanceModal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    attendanceModal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl">
                <h3 class="text-xl font-semibold flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Edit Data Tamu
                </h3>
            </div>
            <form id="editAttendanceForm" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Nama
                    </label>
                    <input type="text" id="editAttendanceName" required
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Status Kehadiran
                    </label>
                    <div class="space-y-3">
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input type="radio" name="editAttendanceStatus" value="hadir" class="w-4 h-4 text-green-600 focus:ring-green-500">
                            <span class="ml-3 flex items-center text-sm font-medium text-gray-700">
                                <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                Hadir
                            </span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input type="radio" name="editAttendanceStatus" value="tidak" class="w-4 h-4 text-red-600 focus:ring-red-500">
                            <span class="ml-3 flex items-center text-sm font-medium text-gray-700">
                                <span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                Tidak Hadir
                            </span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input type="radio" name="editAttendanceStatus" value="pending" class="w-4 h-4 text-yellow-600 focus:ring-yellow-500">
                            <span class="ml-3 flex items-center text-sm font-medium text-gray-700">
                                <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                                Pending
                            </span>
                        </label>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                        Jumlah Orang
                    </label>
                    <select id="editAttendanceCount" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white">
                        <option value="1">1 Orang</option>
                        <option value="2">2 Orang</option>
                        <option value="3">3 Orang</option>
                        <option value="4">4 Orang</option>
                        <option value="5">5 Orang</option>
                        <option value="6">6+ Orang</option>
                    </select>
                </div>
                <div class="flex space-x-3 pt-4">
                    <button type="submit" 
                            class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Update
                    </button>
                    <button type="button" onclick="closeEditAttendanceModal()" 
                            class="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium">
                        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Batal
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(attendanceModal);

    // Event listeners for forms
    document.getElementById('editWishForm').addEventListener('submit', handleWishUpdate);
    document.getElementById('editAttendanceForm').addEventListener('submit', handleAttendanceUpdate);
}

function loadWishesTable() {
    const tableBody = document.querySelector('#wishesTamu tbody');
    
    if (!tableBody) {
        console.error('Tabel wishes dengan ID "wishesTamu" tidak ditemukan');
        return;
    }
    
    tableBody.innerHTML = '<tr><td colspan="3" class="text-center py-4">Memuat data...</td></tr>';
    
    const wishesRef = database.ref('wishes');
    
    wishesRef.on('value', function(snapshot) {
        tableBody.innerHTML = '';
        
        if (!snapshot.exists()) {
            tableBody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-beige-500">Belum ada ucapan</td></tr>';
            return;
        }
        
        const wishes = [];
        snapshot.forEach(function(childSnapshot) {
            wishes.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        
        wishes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        wishes.forEach(function(wish) {
            const row = createWishTableRow(wish);
            tableBody.appendChild(row);
        });
    }, function(error) {
        console.error('Error fetching wishes:', error);
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-red-600">Error loading wishes data</td></tr>';
    });
}

function createWishTableRow(wish) {
    const row = document.createElement('tr');
    row.className = 'fade-in hover:bg-beige-50 transition-colors';
    row.setAttribute('data-wish-id', wish.id);
    
    row.innerHTML = `
        <td class="px-4 py-3 whitespace-nowrap text-sm text-beige-800">
            <div class="flex items-center">
                <div class="w-8 h-8 bg-beige-100 rounded-full flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-beige-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                </div>
                ${escapeHtml(wish.nama || 'Unknown')}
            </div>
        </td>
        <td class="px-4 py-3 text-sm text-beige-800">
            <div class="max-w-xs truncate" title="${escapeHtml(wish.ucapan || wish.message || 'No message')}">
                ${escapeHtml(wish.ucapan || wish.message || 'No message')}
            </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap text-sm text-beige-800">
            <div class="flex space-x-2">
                <button onclick="editWish('${wish.id}')" 
                        class="hidden inline-flex items-center px-3 py-1 bg-beige-100 text-beige-700 rounded-lg hover:bg-beige-200 transition-colors text-xs font-medium">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                </button>
                <button onclick="deleteWish('${wish.id}')" 
                        class="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs font-medium">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Hapus
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function loadAttendanceData() {
    const tableBody = document.querySelector('#Tabletamu tbody');
    
    if (!tableBody) {
        console.error('Tabel dengan ID "Tabletamu" tidak ditemukan');
        return;
    }
    
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">Loading...</td></tr>';
    
    database.ref('attendance').on('value', (snapshot) => {
        const data = snapshot.val();
        tableBody.innerHTML = '';
        
        if (!data) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-beige-600">Belum ada data attendance</td></tr>';
            return;
        }
        
        const attendanceArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));
        
        attendanceArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        attendanceArray.forEach(item => {
            const row = createAttendanceTableRow(item);
            tableBody.appendChild(row);
        });
        
    }, (error) => {
        console.error('Error fetching attendance data:', error);
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-red-600">Error loading attendance data</td></tr>';
    });
}

function createAttendanceTableRow(data) {
    const row = document.createElement('tr');
    row.className = 'fade-in hover:bg-beige-50 transition-colors';
    
    row.innerHTML = `
        <td class="px-4 py-3 whitespace-nowrap text-sm text-beige-800">
            <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                </div>
                ${data.nama || 'Unknown'}
            </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap text-sm text-beige-800">
            ${getStatusBadge(data.status)}
        </td>
        <td class="px-4 py-3 whitespace-nowrap text-sm text-beige-800">
            <div class="flex items-center">
                <svg class="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                ${data.jumlahOrang || 1}
            </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap text-sm text-beige-800">
            <div class="flex space-x-2">
                <button onclick="editAttendance('${data.id}')" 
                        class="hidden inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs font-medium">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                </button>
                <button onclick="deleteAttendance('${data.id}')" 
                        class="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs font-medium">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Hapus
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Wish functions
function editWish(wishId) {
    database.ref(`wishes/${wishId}`).once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                editingWishId = wishId;
                document.getElementById('editWishName').value = data.nama || '';
                document.getElementById('editWishMessage').value = data.ucapan || data.message || '';
                document.getElementById('editWishModal').classList.remove('hidden');
                document.getElementById('editWishName').focus();
            }
        })
        .catch((error) => {
            console.error('Error fetching wish data:', error);
            showNotification('Error mengambil data ucapan', 'error');
        });
}

function closeEditWishModal() {
    document.getElementById('editWishModal').classList.add('hidden');
    editingWishId = null;
}

function handleWishUpdate(e) {
    e.preventDefault();
    
    const name = document.getElementById('editWishName').value.trim();
    const message = document.getElementById('editWishMessage').value.trim();
    
    if (!name || !message) {
        showNotification('Nama dan ucapan tidak boleh kosong!', 'error');
        return;
    }
    
    const wishRef = database.ref(`wishes/${editingWishId}`);
    wishRef.update({
        nama: name,
        ucapan: message,
        message: message,
        lastEdited: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        closeEditWishModal();
        showNotification('Ucapan berhasil diupdate! ✅', 'success');
    }).catch((error) => {
        console.error('Error:', error);
        showNotification('Gagal mengupdate ucapan. Silakan coba lagi.', 'error');
    });
}

function deleteWish(wishId) {
    Swal.fire({
        title: 'Apakah ingin menghapus data ini?',
        text: 'Ucapan tidak dapat dikembalikan',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            const wishRef = database.ref(`wishes/${wishId}`);
            wishRef.remove()
                .then(() => {
                    showNotification('Ucapan berhasil dihapus! 🗑️', 'success');
                })
                .catch((error) => {
                    console.error('Error:', error);
                    showNotification('Gagal menghapus ucapan. Silakan coba lagi.', 'error');
                });
        }
    });
}

// Attendance functions
function editAttendance(id) {
    database.ref(`attendance/${id}`).once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                editingAttendanceId = id;
                document.getElementById('editAttendanceName').value = data.nama || '';
                document.querySelector(`input[name="editAttendanceStatus"][value="${data.status}"]`).checked = true;
                document.getElementById('editAttendanceCount').value = data.jumlahOrang || '1';
                document.getElementById('editAttendanceModal').classList.remove('hidden');
                document.getElementById('editAttendanceName').focus();
            }
        })
        .catch((error) => {
            console.error('Error fetching attendance data:', error);
            showNotification('Error mengambil data untuk edit', 'error');
        });
}

function closeEditAttendanceModal() {
    document.getElementById('editAttendanceModal').classList.add('hidden');
    editingAttendanceId = null;
}

function handleAttendanceUpdate(e) {
    e.preventDefault();
    
    const name = document.getElementById('editAttendanceName').value.trim();
    const status = document.querySelector('input[name="editAttendanceStatus"]:checked')?.value;
    const count = document.getElementById('editAttendanceCount').value;
    
    if (!name || !status) {
        showNotification('Semua field harus diisi!', 'error');
        return;
    }
    
    const attendanceRef = database.ref(`attendance/${editingAttendanceId}`);
    attendanceRef.update({
        nama: name,
        status: status,
        jumlahOrang: count,
        lastEdited: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        closeEditAttendanceModal();
        showNotification('Data tamu berhasil diupdate! ✅', 'success');
   }).catch((error) => {
        console.error('Error:', error);
        showNotification('Gagal mengupdate data tamu. Silakan coba lagi.', 'error');
    });
}

function deleteAttendance(id) {
    Swal.fire({
        title: 'Apakah ingin menghapus data ini?',
        text: 'Kehadiran tidak dapat dikembalikan',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            const attendanceRef = database.ref(`attendance/${id}`);
            attendanceRef.remove()
                .then(() => {
                    showNotification('Data tamu berhasil dihapus! 🗑️', 'success');
                })
                .catch((error) => {
                    console.error('Error:', error);
                    showNotification('Gagal menghapus data tamu. Silakan coba lagi.', 'error');
                });
        }
    });
}


// Utility functions
function getStatusBadge(status) {
    switch(status) {
        case 'hadir':
            return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                        Hadir
                    </span>`;
        case 'tidak':
            return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <span class="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                        Tidak Hadir
                    </span>`;
        case 'pending':
            return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <span class="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                        Pending
                    </span>`;
        default:
            return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <span class="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
                        Unknown
                    </span>`;
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-white'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const wishModal = document.getElementById('editWishModal');
    const attendanceModal = document.getElementById('editAttendanceModal');
    
    if (wishModal && event.target === wishModal) {
        closeEditWishModal();
    }
    
    if (attendanceModal && event.target === attendanceModal) {
        closeEditAttendanceModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEditWishModal();
        closeEditAttendanceModal();
    }
});

// Add fade-in animation CSS
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification {
        max-width: 400px;
        word-wrap: break-word;
    }
        
`;
document.head.appendChild(style);