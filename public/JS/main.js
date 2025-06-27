        // Initialize GSAP
        gsap.registerPlugin();
        
        let musicPlaying = false;
        let pageUnlocked = false;
        
        // DOM Elements
        const loadingScreen = document.getElementById('loadingScreen');
        const welcomeScreen = document.getElementById('welcomeScreen');
        const mainContent = document.getElementById('mainContent');
        const openInvitationBtn = document.getElementById('openInvitation');
        const musicControl = document.getElementById('musicControl');
        const musicIcon = document.getElementById('musicIcon');
        const backgroundMusic = document.getElementById('backgroundMusic');
        
        // Prevent scrolling initially
        document.body.style.overflow = 'hidden';
        
        // Loading Screen Animation
        gsap.timeline()
            .to(loadingScreen, { duration: 3, opacity: 1 })
            .to(loadingScreen, { duration: 0.5, opacity: 0, display: 'none' })
            .to(welcomeScreen, { duration: 0.5, opacity: 1 }, '-=0.5');
        
        // Open Invitation Handler
        openInvitationBtn.addEventListener('click', function() {
            // Play background music
            backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
            musicPlaying = true;
            musicIcon.textContent = '🎵';
            
            // Enable scrolling
            document.body.style.overflow = 'auto';
            document.body.classList.add('scrollable');
            pageUnlocked = true;
            
            // Hide welcome screen and show main content
            gsap.timeline()
                .to(welcomeScreen, { duration: 0.5, opacity: 0, display: 'none' })
                .to(mainContent, { duration: 0.5, opacity: 1 })
                .from('.hero-content', { duration: 1, y: 50, opacity: 0, ease: 'power2.out' })
                .from('.photo-frame', { duration: 1, scale: 0.8, opacity: 0, ease: 'back.out(1.7)' }, '-=0.8')
                .from('.main-title', { duration: 1, y: 30, opacity: 0, ease: 'power2.out' }, '-=0.6')
                .from('.birthday-name', { duration: 1, x: -30, opacity: 0, ease: 'power2.out' }, '-=0.4')
                .from('.event-details', { duration: 1, y: 30, opacity: 0, ease: 'power2.out' }, '-=0.2');
            
            // Animate sections on scroll
            setupScrollAnimations();
            
            // Add floating hearts
            createFloatingHearts();
        });
        
        // Music Control
        musicControl.addEventListener('click', function() {
            if (!pageUnlocked) return;
            
           if (musicPlaying) {
    backgroundMusic.pause();
    musicIcon.innerHTML = `
        <!-- Musik OFF -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path d="M9 18.75a2.25 2.25 0 1 1-1.5-2.122V6.498a.75.75 0 0 1 .577-.73l7.5-1.875A.75.75 0 0 1 16.5 4.5v5.128M18 9l3 3m0-3l-3 3"/>
        </svg>
    `;
    musicPlaying = false;
} else {
    backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
   musicIcon.textContent = '🎵';
    musicPlaying = true;
}

        });
        
        // Setup Scroll Animations
        function setupScrollAnimations() {
            // Doa Section
            gsap.fromTo('.doa-header', 
                { y: 50, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.doa-header',
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            gsap.fromTo('.doa-content', 
                { scale: 0.9, opacity: 0 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.doa-content',
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            // Presensi Section
            gsap.fromTo('.presensi-header', 
                { x: -50, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.presensi-header',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            gsap.fromTo('.presensi-form', 
                { x: 50, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.presensi-form',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            // Ucapan Section
            gsap.fromTo('.ucapan-header', 
                { y: 50, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.ucapan-header',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            gsap.fromTo('.ucapan-form', 
                { scale: 0.9, opacity: 0 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.ucapan-form',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            gsap.fromTo('.ucapan-list > div', 
                { y: 30, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: '.ucapan-list',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            // Gift Section
            gsap.fromTo('.gift-header', 
                { rotation: -5, opacity: 0 },
                { 
                    rotation: 0, 
                    opacity: 1, 
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.gift-header',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            gsap.fromTo('.gift-content', 
                { y: 50, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.gift-content',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            // Maps Section
            gsap.fromTo('.maps-header', 
                { x: -50, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.maps-header',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            gsap.fromTo('.maps-content', 
                { scale: 0.9, opacity: 0 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.maps-content',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
        
        // Create Floating Hearts
        function createFloatingHearts() {
            setInterval(() => {
                if (!pageUnlocked) return;
                
                const heart = document.createElement('div');
                heart.className = 'heart-float';
                heart.innerHTML = '💖';
                heart.style.left = Math.random() * 100 + '%';
                heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
                heart.style.animationDelay = Math.random() * 2 + 's';
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 4000);
            }, 3000);
        }
        
        // Form Submissions
    
        // Confetti Effect
        function createConfetti(element) {
            const colors = ['#d4c5a9', '#f5f3ed', '#e8e4d9', '#a67c52'];
            const rect = element.getBoundingClientRect();
            
            for (let i = 0; i < 30; i++) {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = rect.left + rect.width/2 + 'px';
                confetti.style.top = rect.top + rect.height/2 + 'px';
                confetti.style.width = '8px';
                confetti.style.height = '8px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                
                document.body.appendChild(confetti);
                
                gsap.to(confetti, {
                    duration: 1.5,
                    x: (Math.random() - 0.5) * 200,
                    y: Math.random() * 100 + 50,
                    opacity: 0,
                    scale: 0,
                    ease: 'power2.out',
                    onComplete: () => confetti.remove()
                });
            }
        }
        
        // Parallax Effect for Hero Section
        if (window.innerWidth > 768) {
            window.addEventListener('scroll', () => {
                if (!pageUnlocked) return;
                
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('section');
                const sparkles = document.querySelectorAll('.sparkle');
                
                if (hero) {
                    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                }
                
                sparkles.forEach((sparkle, index) => {
                    sparkle.style.transform = `translateY(${scrolled * (0.2 + index * 0.1)}px)`;
                });
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Add hover effects to cards
        document.querySelectorAll('.bg-white, .bg-beige-50').forEach(card => {
            if (card.closest('section')) {
                card.addEventListener('mouseenter', function() {
                    gsap.to(this, { duration: 0.3, scale: 1.02, ease: 'power2.out' });
                });
                
                card.addEventListener('mouseleave', function() {
                    gsap.to(this, { duration: 0.3, scale: 1, ease: 'power2.out' });
                });
            }
        });
        
        // Initialize scroll trigger after page load
        window.addEventListener('load', () => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        });
        
        // Error handling for audio
        backgroundMusic.addEventListener('error', function() {
            console.log('Audio could not be loaded');
            musicControl.style.display = 'none';
        });
        
        // Responsive adjustments
        function handleResize() {
            if (window.innerWidth < 768) {
                // Disable parallax on mobile
                document.querySelector('section').style.transform = 'none';
                document.querySelectorAll('.sparkle').forEach(sparkle => {
                    sparkle.style.transform = 'none';
                });
            }
        }
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
        
        // Accessibility improvements
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target === openInvitationBtn) {
                    e.preventDefault();
                    openInvitationBtn.click();
                }
                if (e.target === musicControl) {
                    e.preventDefault();
                    musicControl.click();
                }
            }
        });
        
        // Add focus styles
        const style = document.createElement('style');
        style.textContent = `
            button:focus, input:focus, textarea:focus, select:focus {
                outline: 2px solid #a67c52;
                outline-offset: 2px;
            }
            .music-control:focus {
                outline: 2px solid #a67c52;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
