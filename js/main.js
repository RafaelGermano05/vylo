// Initialize AOS animations
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    delay: 100,
    easing: 'ease-in-out'
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
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                const menu = document.querySelector('.mobile-menu');
                if (menu && menu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        }
    });
});

// Animated counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.getAttribute('data-count');
                const isPercentage = target.includes('%');
                const isThousands = target.includes('k');
                
                let finalValue;
                
                if (isPercentage) {
                    finalValue = parseInt(target);
                } else if (isThousands) {
                    finalValue = parseFloat(target.replace('k', '')) * 1000;
                } else {
                    finalValue = parseInt(target);
                }
                
                animateCounter(counter, finalValue, isPercentage, isThousands);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, isPercentage, isThousands) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const interval = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue;
        if (isPercentage) {
            displayValue = `${Math.floor(current)}%`;
        } else if (isThousands && target >= 1000) {
            displayValue = `${(current / 1000).toFixed(1).replace('.0', '')}k+`;
        } else {
            displayValue = `${Math.floor(current).toLocaleString()}+`;
        }
        
        element.textContent = displayValue;
    }, interval);
}

// FAQ accordion
// function initFAQ() {
//     const faqItems = document.querySelectorAll('.faq-item');
    
//     faqItems.forEach(item => {
//         const question = item.querySelector('.faq-question');
        
//         question.addEventListener('click', () => {
//             // Close all other items
//             faqItems.forEach(otherItem => {
//                 if (otherItem !== item && otherItem.classList.contains('active')) {
//                     otherItem.classList.remove('active');
//                 }
//             });
            
//             // Toggle current item
//             item.classList.toggle('active');
            
//             // Add smooth animation for arrow
//             const arrow = question.querySelector('i');
//             arrow.style.transition = 'transform 0.3s ease';
//         });
//     });
// }

// Form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.btn-submit');
    
    if (!contactForm || !submitBtn) return;
    
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
    
    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'whatsapp', 'company', 'employees', 'revenue'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Por favor, insira um email válido.');
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success message
            showNotification('Formulário enviado com sucesso! Entraremos em contato em breve.', 'success');
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            showNotification('Erro ao enviar o formulário. Tente novamente.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: 0.5rem;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyles);

// Parallax effect for hero image
function initParallax() {
    const heroImage = document.querySelector('.hero-img');
    if (!heroImage) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
    initFAQ();
    initContactForm();
    initParallax();
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.vylo-card, .diff-card, .knowledge-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Add lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Add CSS for mobile menu (if needed later)
const mobileMenuStyles = document.createElement('style');
mobileMenuStyles.textContent = `
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
        }
        
        .nav-links {
            display: none;
        }
        
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--primary-purple);
            padding: 1rem;
            z-index: 1000;
        }
    }
`;
document.head.appendChild(mobileMenuStyles);

    // Initialize AOS animations
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        delay: 50,
        easing: 'ease-in-out'
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

    // FAQ functionality - CORREÇÃO DO PROBLEMA DO FAQ
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Fecha todas as outras FAQs
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alterna a FAQ atual
            if (!isActive) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    // Counter animation
    // function animateCounter(element, start, end, duration) {
    //     let startTimestamp = null;
    //     const step = (timestamp) => {
    //         if (!startTimestamp) startTimestamp = timestamp;
    //         const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    //         const value = Math.floor(progress * (end - start) + start);
            
    //         if (element.textContent.includes('%')) {
    //             element.textContent = value + '%';
    //         } else if (element.textContent.includes('+')) {
    //             element.textContent = value.toLocaleString('pt-BR') + '+';
    //         } else {
    //             element.textContent = value.toLocaleString('pt-BR');
    //         }
            
    //         if (progress < 1) {
    //             window.requestAnimationFrame(step);
    //         }
    //     };
    //     window.requestAnimationFrame(step);
    // }

    // Start counters when in viewport
    // const observer = new IntersectionObserver((entries) => {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting) {
    //             const counters = entry.target.querySelectorAll('.stat-number[data-count]');
    //             counters.forEach(counter => {
    //                 const target = counter.getAttribute('data-count');
    //                 let endValue;
                    
    //                 if (target.includes('%')) {
    //                     endValue = parseInt(target);
    //                     animateCounter(counter, 0, endValue, 2000);
    //                 } else if (target.includes('+')) {
    //                     endValue = parseInt(target.replace('+', ''));
    //                     animateCounter(counter, 0, endValue, 2000);
    //                 }
    //             });
    //         }
    //     });
    // }, { threshold: 0.5 });

    // Observe stats section
    const statsSection = document.querySelector('#stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ef4444';
                    isValid = false;
                } else {
                    field.style.borderColor = '#e5e7eb';
                }
            });
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = this.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Obrigado pelo seu contato! Entraremos em contato em breve.');
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }

    // WhatsApp input mask
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function(e) {
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

    // Mobile menu toggle (se ativar a navbar)
    function toggleMobileMenu() {
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            navContainer.classList.toggle('active');
        }
    }

    // Add mobile menu styles if navbar is active
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-container {
                display: none;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--primary-purple);
                padding: 1rem;
                box-shadow: var(--shadow-xl);
            }
            
            .nav-container.active {
                display: flex;
            }
            
            .mobile-menu-btn {
                display: block;
                background: none;
                border: none;
                color: var(--white);
                font-size: 1.5rem;
                cursor: pointer;
                position: absolute;
                right: 1rem;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    `;
    document.head.appendChild(style);

    // Parallax effect for hero (opcional)
    // window.addEventListener('scroll', () => {
    //     const scrolled = window.pageYOffset;
    //     const hero = document.querySelector('.hero');
    //     if (hero) {
    //         hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    //     }
    // });

    // Add hover effect to cards
    document.querySelectorAll('.vylo-card, .diff-card, .knowledge-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });