// Smooth scroll for anchor links (только для якорных ссылок, не для внешних)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Пропускаем ссылки с data-link, они внешние
    if (!anchor.hasAttribute('data-link')) {
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
    }
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(26, 26, 46, 0.98)';
    } else {
        header.style.background = 'rgba(26, 26, 46, 0.95)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

function applyLinksAndAnimations() {
    // Устанавливаем ссылки для всех элементов с data-link атрибутом
    document.querySelectorAll('[data-link]').forEach(link => {
        const linkType = link.getAttribute('data-link');
        if (typeof LINKS !== 'undefined' && LINKS[linkType]) {
            link.setAttribute('href', LINKS[linkType]);
        }
    });
    
    const animatedElements = document.querySelectorAll('.game-card, .advantage-card, .benefit-item, .step, .faq-item, .review-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLinksAndAnimations);
} else {
    applyLinksAndAnimations();
}

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        navToggle.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            navToggle.classList.remove('open');
        });
    });
}

// FAQ accordion functionality (optional enhancement)
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
        question.style.cursor = 'pointer';
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('open');
                const ans = faq.querySelector('.faq-answer');
                if (ans) {
                    ans.style.maxHeight = null;
                }
            });
            
            // Open clicked item if it wasn't open
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
        
        // Initialize answer style
        answer.style.maxHeight = null;
        answer.style.transition = 'max-height 0.3s ease';
    }
});

// Button hover effects
document.querySelectorAll('.btn, .btn-game, .btn-telegram').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 500);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Game card click tracking (for analytics)
document.querySelectorAll('.game-card, .btn-game').forEach(card => {
    card.addEventListener('click', function(e) {
        const gameName = this.querySelector('.game-title')?.textContent || 'Unknown Game';
        console.log('Game clicked:', gameName);
        // Here you can add analytics tracking
    });
});

