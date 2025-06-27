

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.ucapan-form form');
    const wishesContainer = document.querySelector('.ucapan-list');
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nama = form.querySelector('input[type="text"]').value.trim();
        const ucapan = form.querySelector('textarea').value.trim();
        
        if (!nama || !ucapan) {
            alert('Mohon isi nama dan ucapan!');
            return;
        }
        
        // Simpan ke Firebase
        const wishRef = database.ref('wishes').push();
        wishRef.set({
            nama: nama,
            ucapan: ucapan,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            // Reset form
            form.reset();
            showNotification('Ucapan Terkirim! 💝');
        }).catch((error) => {
            console.error('Error:', error);
            showNotification('Gagal mengirim ucapan. ❌');
        });
    });
    
    // Fetch dan display wishes
    fetchWishes();
});

function fetchWishes() {
    const wishesContainer = document.querySelector('.ucapan-list');
    const wishesRef = database.ref('wishes');
    
    // Clear sample wishes first
    wishesContainer.innerHTML = '';
    
    wishesRef.orderByChild('timestamp').on('child_added', function(snapshot) {
        const wish = snapshot.val();
        const wishId = snapshot.key;
        
        // Create wish card dengan animasi
        const wishCard = createWishCard(wish, wishId);
        
        // Add dengan animasi slide in
        wishCard.style.opacity = '0';
        wishCard.style.transform = 'translateX(-100px)';
        wishesContainer.appendChild(wishCard);
        
        // Trigger animation
        setTimeout(() => {
            wishCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            wishCard.style.opacity = '1';
            wishCard.style.transform = 'translateX(0)';
        }, 100);
        
        // Add floating animation
        setTimeout(() => {
            wishCard.classList.add('floating-animation');
        }, 900);
    });
}

function createWishCard(wish, wishId) {
    const card = document.createElement('div');
    card.className = 'bg-white p-6 rounded-2xl shadow-md border-l-4 border-beige-300 wish-card';
    card.setAttribute('data-wish-id', wishId);
    
    // Random emoji untuk setiap card
    const emojis = ['💖', '✨', '🌟', '💕', '💌', '🌸', '🥳', '💝', '🤗', '😎'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    card.innerHTML = `
        <div class="flex items-center mb-2">
            <span class="text-beige-600 font-semibold">${escapeHtml(wish.nama)}</span>
            <span class="text-beige-400 ml-2">${randomEmoji}</span>
        </div>
        <p class="text-beige-700">"${escapeHtml(wish.ucapan)}"</p>
        <div class="text-xs text-beige-700 mt-2">
  ${wish.timestamp ? new Date(wish.timestamp).toLocaleTimeString('id-ID', { timeZone: 'Asia/Makassar', hour: '2-digit', minute: '2-digit' }) + ' WITA' : 'Baru saja'}
</div>

    `;
    
    return card;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


