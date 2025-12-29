// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    delay: 100
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animated counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.getAttribute('data-count');
        
        // Check if it's a percentage or regular number
        if (target.includes('%')) {
            const numValue = parseInt(target);
            const suffix = target.replace(numValue.toString(), '');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let current = 0;
                        const increment = numValue / 50;
                        
                        const updateCounter = () => {
                            current += increment;
                            
                            if (current < numValue) {
                                counter.textContent = `+${Math.floor(current)}${suffix}`;
                                setTimeout(updateCounter, 30);
                            } else {
                                counter.textContent = `+${numValue}${suffix}`;
                            }
                        };
                        
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        } else if (target.includes('k')) {
            // Handle thousands format
            const numValue = parseFloat(target.replace('k', '')) * 1000;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let current = 0;
                        const increment = numValue / 50;
                        
                        const updateCounter = () => {
                            current += increment;
                            
                            if (current < numValue) {
                                counter.textContent = `${Math.floor(current).toLocaleString()}+`;
                                setTimeout(updateCounter, 30);
                            } else {
                                counter.textContent = `${numValue.toLocaleString()}+`;
                            }
                        };
                        
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        } else {
            // Regular number
            const numValue = parseInt(target);
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let current = 0;
                        const increment = numValue / 50;
                        
                        const updateCounter = () => {
                            current += increment;
                            
                            if (current < numValue) {
                                counter.textContent = `+${Math.floor(current)}`;
                                setTimeout(updateCounter, 30);
                            } else {
                                counter.textContent = `+${numValue}`;
                            }
                        };
                        
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        }
    });
}

// FAQ accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Form submission
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable submit button
            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            alert('Formulário enviado com sucesso! Entraremos em contato em breve.');
            
            // Reset form
            contactForm.reset();
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    }
}

// Bubble animations
function initBubbleAnimations() {
    const bubbles = document.querySelectorAll('.bubble');
    
    bubbles.forEach(bubble => {
        bubble.addEventListener('mouseenter', () => {
            bubble.style.transform = 'scale(1.05)';
        });
        
        bubble.addEventListener('mouseleave', () => {
            bubble.style.transform = 'scale(1)';
        });
    });
}

// Timeline animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
    initFAQ();
    initContactForm();
    initBubbleAnimations();
    initTimelineAnimations();
    
    // Add floating animation to badges
    const badges = document.querySelectorAll('.hero-badge');
    badges.forEach(badge => {
        badge.style.animation = 'float 3s ease-in-out infinite';
    });
});

// WhatsApp formatting
const whatsappInput = document.getElementById('whatsapp');
if (whatsappInput) {
    whatsappInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d*)/, '($1');
        }
        
        e.target.value = value;
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});
// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    delay: 100
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animated counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.getAttribute('data-count');
        
        // Check if it's a percentage or regular number
        if (target.includes('%')) {
            const numValue = parseInt(target);
            const suffix = target.replace(numValue.toString(), '');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let current = 0;
                        const increment = numValue / 50;
                        
                        const updateCounter = () => {
                            current += increment;
                            
                            if (current < numValue) {
                                counter.textContent = `+${Math.floor(current)}${suffix}`;
                                setTimeout(updateCounter, 30);
                            } else {
                                counter.textContent = `+${numValue}${suffix}`;
                            }
                        };
                        
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        } else if (target.includes('k')) {
            // Handle thousands format
            const numValue = parseFloat(target.replace('k', '')) * 1000;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let current = 0;
                        const increment = numValue / 50;
                        
                        const updateCounter = () => {
                            current += increment;
                            
                            if (current < numValue) {
                                counter.textContent = `${Math.floor(current).toLocaleString()}+`;
                                setTimeout(updateCounter, 30);
                            } else {
                                counter.textContent = `${numValue.toLocaleString()}+`;
                            }
                        };
                        
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        } else {
            // Regular number
            const numValue = parseInt(target);
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let current = 0;
                        const increment = numValue / 50;
                        
                        const updateCounter = () => {
                            current += increment;
                            
                            if (current < numValue) {
                                counter.textContent = `+${Math.floor(current)}`;
                                setTimeout(updateCounter, 30);
                            } else {
                                counter.textContent = `+${numValue}`;
                            }
                        };
                        
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        }
    });
}

// FAQ accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Form submission
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable submit button
            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            alert('Formulário enviado com sucesso! Entraremos em contato em breve.');
            
            // Reset form
            contactForm.reset();
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    }
}

// Demo button functionality
function initDemoButton() {
    const demoButton = document.querySelector('.demo-button');
    
    if (demoButton) {
        demoButton.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            
            if (contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
    initFAQ();
    initContactForm();
    initDemoButton();
});

