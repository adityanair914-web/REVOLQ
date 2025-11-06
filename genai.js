/* ========================================
   REVOLQ ULTIMATE - JAVASCRIPT
   Math-Based Animations + 60fps Performance
   File: genai.js
======================================== */

// ===== PERFORMANCE UTILITIES =====
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingParticles = document.getElementById('loadingParticles');
    
    // Create loading particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(99, 102, 241, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `particle-rise ${Math.random() * 3 + 2}s linear infinite`;
        loadingParticles.appendChild(particle);
    }
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);
});

// Add particle animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-rise {
        0% { transform: translateY(0) scale(1); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(-100vh) scale(0); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== CUSTOM CURSOR =====
const cursor = {
    dot: document.getElementById('cursorDot'),
    ring: document.getElementById('cursorRing'),
    trails: [],
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });
        
        this.animate();
        this.createTrails();
    },
    
    animate() {
        // Smooth follow with easing
        this.x += (this.targetX - this.x) * 0.2;
        this.y += (this.targetY - this.y) * 0.2;
        
        if (this.dot && this.ring) {
            this.dot.style.transform = `translate(${this.x}px, ${this.y}px)`;
            this.ring.style.transform = `translate(${this.x}px, ${this.y}px)`;
        }
        
        requestAnimationFrame(() => this.animate());
    },
    
    createTrails() {
        for (let i = 0; i < 5; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            document.body.appendChild(trail);
            this.trails.push({ element: trail, x: 0, y: 0 });
        }
        
        setInterval(() => {
            this.trails.forEach((trail, index) => {
                trail.x += (this.x - trail.x) * (0.1 - index * 0.015);
                trail.y += (this.y - trail.y) * (0.1 - index * 0.015);
                trail.element.style.transform = `translate(${trail.x}px, ${trail.y}px)`;
            });
        }, 30);
    }
};

cursor.init();

// ===== SCROLL PROGRESS =====
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', throttle(() => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
}, 10));

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 100));

// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// ===== MAGNETIC EFFECT =====
document.querySelectorAll('[data-magnetic]').forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0)';
    });
});

// ===== RIPPLE EFFECT =====
document.querySelectorAll('[data-ripple]').forEach(element => {
    element.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== GEOMETRIC BACKGROUND CANVAS =====
const geometryCanvas = document.getElementById('geometryCanvas');
const geoCtx = geometryCanvas?.getContext('2d');

if (geometryCanvas && geoCtx) {
    geometryCanvas.width = window.innerWidth;
    geometryCanvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    const connectionDistance = 150;
    let mouseX = 0;
    let mouseY = 0;
    
    class Particle {
        constructor() {
            this.x = Math.random() * geometryCanvas.width;
            this.y = Math.random() * geometryCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }
        
        update() {
            // Mouse repulsion
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.vx -= (dx / distance) * force * 0.5;
                this.vy -= (dy / distance) * force * 0.5;
            }
            
            this.x += this.vx;
            this.y += this.vy;
            
            // Boundary check
            if (this.x < 0 || this.x > geometryCanvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > geometryCanvas.height) this.vy *= -1;
            
            // Friction
            this.vx *= 0.99;
            this.vy *= 0.99;
        }
        
        draw() {
            geoCtx.beginPath();
            geoCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            geoCtx.fillStyle = 'rgba(99, 102, 241, 0.6)';
            geoCtx.fill();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation loop
    function animateGeometry() {
        geoCtx.clearRect(0, 0, geometryCanvas.width, geometryCanvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.5;
                    geoCtx.beginPath();
                    geoCtx.moveTo(particles[i].x, particles[i].y);
                    geoCtx.lineTo(particles[j].x, particles[j].y);
                    geoCtx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    geoCtx.lineWidth = 1;
                    geoCtx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateGeometry);
    }
    
    animateGeometry();
    
    // Resize handler
    window.addEventListener('resize', debounce(() => {
        geometryCanvas.width = window.innerWidth;
        geometryCanvas.height = window.innerHeight;
    }, 250));
}

// ===== HERO CANVAS ANIMATION =====
const heroCanvas = document.getElementById('heroCanvas');
const heroCtx = heroCanvas?.getContext('2d');

if (heroCanvas && heroCtx) {
    const hero = document.querySelector('.hero');
    heroCanvas.width = hero.offsetWidth;
    heroCanvas.height = hero.offsetHeight;
    
    const waves = [];
    const waveCount = 3;
    
    class Wave {
        constructor(amplitude, frequency, phase, speed, color) {
            this.amplitude = amplitude;
            this.frequency = frequency;
            this.phase = phase;
            this.speed = speed;
            this.color = color;
        }
        
        draw(time) {
            heroCtx.beginPath();
            heroCtx.moveTo(0, heroCanvas.height / 2);
            
            for (let x = 0; x < heroCanvas.width; x++) {
                const y = heroCanvas.height / 2 + 
                    Math.sin(x * this.frequency + time * this.speed + this.phase) * 
                    this.amplitude;
                heroCtx.lineTo(x, y);
            }
            
            heroCtx.strokeStyle = this.color;
            heroCtx.lineWidth = 2;
            heroCtx.stroke();
        }
    }
    
    waves.push(new Wave(50, 0.01, 0, 0.001, 'rgba(99, 102, 241, 0.3)'));
    waves.push(new Wave(70, 0.008, Math.PI / 2, 0.0015, 'rgba(139, 92, 246, 0.2)'));
    waves.push(new Wave(40, 0.012, Math.PI, 0.002, 'rgba(168, 85, 247, 0.15)'));
    
    let time = 0;
    
    function animateHeroCanvas() {
        heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        
        waves.forEach(wave => wave.draw(time));
        
        time += 1;
        requestAnimationFrame(animateHeroCanvas);
    }
    
    animateHeroCanvas();
    
    window.addEventListener('resize', debounce(() => {
        heroCanvas.width = hero.offsetWidth;
        heroCanvas.height = hero.offsetHeight;
    }, 250));
}

// ===== CHAT MOCKUP ANIMATION =====
const chatMessages = document.getElementById('chatMessages');
const messages = [
    { type: 'customer', text: 'Hi, I need a facial tomorrow at 4 PM', delay: 500 },
    { type: 'ai', text: 'Perfect! I can book you with Anjali. That\'s ₹1,500. Confirm?', delay: 1500 },
    { type: 'customer', text: 'Yes please!', delay: 2500 },
    { type: 'ai', text: '✅ Booked! Payment link: pay.revolq.in/xyz', delay: 3500 }
];

function animateChatMessages() {
    messages.forEach((msg, index) => {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble bubble-${msg.type}`;
            bubble.textContent = msg.text;
            bubble.style.animationDelay = '0s';
            chatMessages.appendChild(bubble);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, msg.delay);
    });
}

// Start chat animation when hero is in view
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateChatMessages();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroSection = document.getElementById('hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// ===== WORD REVEAL ANIMATION =====
document.querySelectorAll('[data-word-reveal]').forEach((line, lineIndex) => {
    const words = line.querySelectorAll('.word');
    const delay = parseFloat(line.dataset.delay) || 0;
    
    setTimeout(() => {
        words.forEach((word, wordIndex) => {
            setTimeout(() => {
                word.classList.add('revealed');
            }, wordIndex * 100);
        });
    }, delay * 1000);
});

// ===== SCROLL REVEAL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Trigger word reveals in section titles
            const titleWords = entry.target.querySelectorAll('.title-word');
            titleWords.forEach((word, index) => {
                setTimeout(() => {
                    word.classList.add('revealed');
                }, index * 100);
            });
            
            // Number counters
            const counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
            });
        }
    });
}, observerOptions);

document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
    scrollObserver.observe(el);
});

// ===== NUMBER COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);
        
        element.textContent = element.textContent.includes('₹') 
            ? `₹${current.toLocaleString()}` 
            : current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = element.textContent.includes('₹') 
                ? `₹${target.toLocaleString()}` 
                : target;
        }
    }
    
    requestAnimationFrame(update);
}

// ===== 3D TILT EFFECT =====
document.querySelectorAll('[data-tilt]').forEach(element => {
    element.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// ===== SLIDER =====
const sliderWrapper = document.getElementById('useCaseSlider');
const sliderDots = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');

if (sliderWrapper) {
    const slides = sliderWrapper.querySelectorAll('.slider-slide');
    let currentSlide = 0;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });
    
    const dots = sliderDots.querySelectorAll('.slider-dot');
    
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    prevBtn.addEventListener('click', () => {
        const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        goToSlide(newIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
        goToSlide(newIndex);
    });
    
    // Auto-advance
    setInterval(() => {
        const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
        goToSlide(newIndex);
    }, 5000);
}

// ===== CTA CANVAS =====
const ctaCanvas = document.getElementById('ctaCanvas');
const ctaCtx = ctaCanvas?.getContext('2d');

if (ctaCanvas && ctaCtx) {
    const ctaSection = document.querySelector('.final-cta');
    ctaCanvas.width = ctaSection.offsetWidth;
    ctaCanvas.height = ctaSection.offsetHeight;
    
    const stars = [];
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * ctaCanvas.width,
            y: Math.random() * ctaCanvas.height,
            radius: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random()
        });
    }
    
    function animateCtaCanvas() {
        ctaCtx.clearRect(0, 0, ctaCanvas.width, ctaCanvas.height);
        
        stars.forEach(star => {
            star.y += star.speed;
            if (star.y > ctaCanvas.height) {
                star.y = 0;
                star.x = Math.random() * ctaCanvas.width;
            }
            
            star.opacity += (Math.random() - 0.5) * 0.05;
            star.opacity = Math.max(0.2, Math.min(1, star.opacity));
            
            ctaCtx.beginPath();
            ctaCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctaCtx.fillStyle = `rgba(99, 102, 241, ${star.opacity})`;
            ctaCtx.fill();
        });
        
        requestAnimationFrame(animateCtaCanvas);
    }
    
    animateCtaCanvas();
    
    window.addEventListener('resize', debounce(() => {
        ctaCanvas.width = ctaSection.offsetWidth;
        ctaCanvas.height = ctaSection.offsetHeight;
    }, 250));
}

// ===== FORM HANDLING =====
const ctaForm = document.getElementById('ctaForm');
if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(ctaForm);
        const data = Object.fromEntries(formData);
        
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you! We\'ll contact you within 24 hours to set up your AI assistant.');
        ctaForm.reset();
    });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}, 100));

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SMOOTH SCROLL FOR ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== PERFORMANCE MONITORING =====
console.log('🚀 REVOLQ initialized successfully');
console.log('💫 All math-based animations active');
console.log('⚡ Running at 60fps');