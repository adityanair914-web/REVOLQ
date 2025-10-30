// ========================================
// REVOLQ PREMIUM - JAVASCRIPT
// Apple Temple + Agensy Magic Fusion
// File: nexus.js (Enhanced)
// ========================================

// ===== MOBILE MENU TOGGLE =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    
    // Animate hamburger to X
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking a link
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
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

// ===== ANIMATED CHAT MOCKUP (Hero Section) =====
const chatMessages = document.getElementById('chatMessages');

const conversation = [
    { type: 'customer', text: 'Hi, I need a facial tomorrow at 4 PM', delay: 1000 },
    { type: 'typing', delay: 2000 },
    { type: 'ai', text: "Perfect! I can book you with Anjali. That's ₹1,500. Confirm?", delay: 3500 },
    { type: 'customer', text: 'Yes please!', delay: 5000 },
    { type: 'typing', delay: 6000 },
    { type: 'ai', text: '✅ Booked! Payment link: pay.revolq.in/xyz', delay: 7500 }
];

function createChatBubble(type, text) {
    if (type === 'typing') {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        return typingDiv;
    }
    
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}`;
    bubble.textContent = text;
    return bubble;
}

function animateChat() {
    chatMessages.innerHTML = '';
    
    conversation.forEach((message, index) => {
        setTimeout(() => {
            if (message.type === 'typing') {
                const typingIndicator = createChatBubble('typing');
                chatMessages.appendChild(typingIndicator);
                
                // Remove typing indicator after 1.5 seconds
                if (index < conversation.length - 1 && conversation[index + 1].type !== 'typing') {
                    setTimeout(() => {
                        typingIndicator.remove();
                    }, 1500);
                }
            } else {
                // Remove any typing indicators before adding the message
                const typingIndicators = chatMessages.querySelectorAll('.typing-indicator');
                typingIndicators.forEach(indicator => indicator.remove());
                
                const bubble = createChatBubble(message.type, message.text);
                chatMessages.appendChild(bubble);
                
                // Auto-scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }, message.delay);
    });
}

// Start chat animation on page load
animateChat();

// Restart chat every 15 seconds
setInterval(animateChat, 15000);

// ===== INTERACTIVE SLIDER (Use Cases) =====
const slider = document.getElementById('useCaseSlider');
const slides = slider.querySelectorAll('.slider-slide');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const dotsContainer = document.getElementById('sliderDots');

let currentSlide = 0;
let slideInterval;

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('.slider-dot');

function goToSlide(index) {
    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Add active class to new slide and dot
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Animate counters when slide changes
    animateCounters();
    
    // Reset auto-advance timer
    resetSlideInterval();
}

function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
}

function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
}

// Event listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Start auto-advance
resetSlideInterval();

// Pause on hover
slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
slider.addEventListener('mouseleave', resetSlideInterval);

// ===== ANIMATED COUNTERS =====
function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on size
        if (target >= 1000) {
            element.textContent = '₹' + Math.floor(current).toLocaleString('en-IN');
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

function animateCounters() {
    // Animate counters in active slide
    const activeSlide = slides[currentSlide];
    const counters = activeSlide.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        animateCounter(counter, target);
    });
}

// ===== SCROLL-TRIGGERED COUNTER ANIMATION =====
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.getAttribute('data-count'));
            animateCounter(entry.target, target);
        }
    });
}, observerOptions);

// Observe all counters outside slider
document.querySelectorAll('.counter').forEach(counter => {
    counterObserver.observe(counter);
});

// Animate slider counters on first load
setTimeout(animateCounters, 1000);

// ===== STICKY HEADER SHADOW ON SCROLL =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// ===== FORM SUBMISSION HANDLER =====
const ctaForm = document.getElementById('ctaForm');

ctaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(ctaForm);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        business: formData.get('business'),
        type: formData.get('type'),
        timestamp: new Date().toISOString(),
        source: 'REVOLQ Premium Landing Page'
    };
    
    // Disable submit button
    const submitBtn = ctaForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Submitting...';
    
    // Simulate API call (replace with your actual endpoint)
    try {
        // TODO: Replace with your actual API endpoint
        // const response = await fetch('YOUR_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success message
        submitBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Success!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Show alert
        alert(`🎉 Thank you, ${data.name}! We'll contact you within 24 hours to start your free trial.`);
        
        // Reset form after 2 seconds
        setTimeout(() => {
            ctaForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 2000);
        
        // Log to console (for development)
        console.log('Form submitted:', data);
        
    } catch (error) {
        console.error('Form submission error:', error);
        submitBtn.innerHTML = '<i class="bi bi-exclamation-circle"></i> Try Again';
        submitBtn.disabled = false;
        alert('Oops! Something went wrong. Please try again or call us at +91 7995617374');
    }
});

// ===== TRACK BUTTON CLICKS (Analytics) =====
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-primary-small').forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = e.target.textContent.trim();
        const buttonLocation = e.target.closest('section')?.className || 'navigation';
        
        console.log('Button clicked:', {
            text: buttonText,
            location: buttonLocation,
            timestamp: new Date().toISOString()
        });
        
        // TODO: Send to your analytics platform
        // Example: Google Analytics
        // gtag('event', 'button_click', {
        //     'button_text': buttonText,
        //     'button_location': buttonLocation
        // });
        
        // Example: Facebook Pixel
        // fbq('track', 'Lead', {
        //     content_name: buttonText,
        //     content_category: buttonLocation
        // });
    });
});

// ===== PRICING CARD HOVER EFFECTS =====
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Add subtle scale to featured badge
        const badge = card.querySelector('.popular-badge');
        if (badge) {
            badge.style.transform = 'translateX(-50%) scale(1.1)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const badge = card.querySelector('.popular-badge');
        if (badge) {
            badge.style.transform = 'translateX(-50%) scale(1)';
        }
    });
});

// ===== FAQ ACCORDION (Optional Enhancement) =====
// Uncomment if you want to make FAQs collapsible
/*
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('h3');
    const answer = item.querySelector('p');
    
    // Hide answers by default
    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.3s ease';
    
    question.style.cursor = 'pointer';
    question.addEventListener('click', () => {
        const isOpen = answer.style.maxHeight !== '0px';
        
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.querySelector('p').style.maxHeight = '0';
            }
        });
        
        // Toggle current item
        if (isOpen) {
            answer.style.maxHeight = '0';
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});
*/

// ===== LAZY LOAD BACKGROUND IMAGES =====
function lazyLoadBackgrounds() {
    const elements = document.querySelectorAll('[data-bg]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const bgUrl = element.getAttribute('data-bg');
                element.style.backgroundImage = `url(${bgUrl})`;
                imageObserver.unobserve(element);
            }
        });
    });
    
    elements.forEach(element => imageObserver.observe(element));
}

lazyLoadBackgrounds();

// ===== KEYBOARD NAVIGATION FOR SLIDER =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// ===== PAGE LOAD PERFORMANCE =====
window.addEventListener('load', () => {
    console.log('🚀 REVOLQ Premium Landing Page Loaded');
    console.log('⚡ Built with Apple Temple + Agensy Magic');
    console.log('🇮🇳 Built in Kerala, for Kerala businesses');
    
    // Log performance metrics
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`📊 Page Load Time: ${pageLoadTime}ms`);
    }
});

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        console.log('🎮 Konami Code Activated!');
        alert('🔥 You found the secret! Email us at hello@revolq.in with "KONAMI" for a special discount! 🎉');
        konamiCode = [];
    }
});

// ===== DETECT USER DEVICE & LOCATION =====
function detectEnvironment() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && !isMobile;
    
    console.log('Device Type:', isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop');
    
    // You can use this to customize the experience
    if (isMobile) {
        // Mobile-specific adjustments
        document.body.classList.add('mobile-device');
    }
}

detectEnvironment();

// ===== INITIALIZE =====
console.log('✨ All systems ready. Let\'s fill those slots! 💼');