// ===== Cursor Trail Effect (粒子系统) =====
class CursorTrail {
    constructor() {
        this.canvas = document.getElementById('cursor-trail');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -100, y: -100 };
        this.lastMouse = { x: -100, y: -100 };
        this.mouseVelocity = { x: 0, y: 0 };
        this.maxParticles = 200;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    onMouseMove(e) {
        // 计算鼠标速度
        this.mouseVelocity.x = e.clientX - this.lastMouse.x;
        this.mouseVelocity.y = e.clientY - this.lastMouse.y;

        this.lastMouse.x = this.mouse.x;
        this.lastMouse.y = this.mouse.y;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        // 在光标移动方向的相反方向散射粒子
        this.addParticles();
    }

    onTouchMove(e) {
        const touch = e.touches[0];
        this.mouseVelocity.x = touch.clientX - this.lastMouse.x;
        this.mouseVelocity.y = touch.clientY - this.lastMouse.y;

        this.lastMouse.x = this.mouse.x;
        this.lastMouse.y = this.mouse.y;
        this.mouse.x = touch.clientX;
        this.mouse.y = touch.clientY;

        this.addParticles();
    }

    addParticles() {
        // 计算鼠标移动方向，粒子向相反方向散射
        const moveAngle = Math.atan2(this.mouseVelocity.y, this.mouseVelocity.x);
        const oppositeAngle = moveAngle + Math.PI;

        // 每次移动生成 3-5 个粒子
        const count = 3 + Math.floor(Math.random() * 3);

        for (let i = 0; i < count; i++) {
            // 65% 三角形 + 35% 圆点
            const isTriangle = Math.random() < 0.65;

            // 散射角度：在相反方向 ±60度范围内
            const scatterAngle = oppositeAngle + (Math.random() - 0.5) * (Math.PI / 1.5);

            // 散射速度
            const speed = 1 + Math.random() * 3;

            let size;
            if (isTriangle) {
                // 三角形：7-15px
                size = 7 + Math.random() * 8;
            } else {
                // 圆点：2-8px
                size = 2 + Math.random() * 6;
            }

            // 初始透明度 0.42-0.67
            const alpha = 0.42 + Math.random() * 0.25;

            this.particles.push({
                x: this.mouse.x + (Math.random() - 0.5) * 6,
                y: this.mouse.y + (Math.random() - 0.5) * 6,
                vx: Math.cos(scatterAngle) * speed,
                vy: Math.sin(scatterAngle) * speed,
                life: 1,
                decay: 0.015 + Math.random() * 0.02,
                size: size,
                alpha: alpha,
                isTriangle: isTriangle,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            });
        }

        // 最大数量 200 个，超出时丢弃旧粒子
        if (this.particles.length > this.maxParticles) {
            this.particles = this.particles.slice(-this.maxParticles);
        }
    }

    drawTriangle(ctx, x, y, size, rotation, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        // 等边三角形
        const h = size * Math.cos(Math.PI / 6);
        ctx.moveTo(0, -size);
        ctx.lineTo(-h, size / 2);
        ctx.lineTo(h, size / 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
        ctx.restore();
    }

    drawCircle(ctx, x, y, size, alpha) {
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 过滤掉已消失的粒子
        this.particles = this.particles.filter(p => p.life > 0);

        this.particles.forEach(p => {
            // 更新位置
            p.x += p.vx;
            p.y += p.vy;

            // 添加一点摩擦力
            p.vx *= 0.98;
            p.vy *= 0.98;

            // 更新生命
            p.life -= p.decay;

            // 更新旋转
            p.rotation += p.rotationSpeed;

            // 计算当前透明度（逐渐衰减）
            const currentAlpha = p.alpha * p.life;

            if (p.isTriangle) {
                this.drawTriangle(this.ctx, p.x, p.y, p.size, p.rotation, currentAlpha);
            } else {
                this.drawCircle(this.ctx, p.x, p.y, p.size, currentAlpha);
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===== Smooth Scroll =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===== Header Scroll Effect =====
class HeaderScroll {
    constructor() {
        this.header = document.getElementById('header');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }
}

// ===== Features Carousel =====
class FeaturesCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.cards = document.querySelectorAll('.feature-card');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        this.currentIndex = 0;
        this.totalSlides = this.cards.length;

        this.init();
    }

    init() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });

        // Auto-play
        setInterval(() => this.next(), 5000);
    }

    update() {
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        this.cards.forEach((card, index) => {
            card.classList.toggle('active', index === this.currentIndex);
        });

        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.update();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.update();
    }

    goTo(index) {
        this.currentIndex = index;
        this.update();
    }
}

// ===== FAQ Accordion =====
class FAQAccordion {
    constructor() {
        this.items = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggle(item));
        });
    }

    toggle(item) {
        const isActive = item.classList.contains('active');

        // Close all
        this.items.forEach(i => i.classList.remove('active'));

        // Open clicked if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// ===== Back to Top =====
class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== Intersection Observer for Animations =====
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.overview-card, .bento-card, .resource-card, .faq-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Add animate-in class styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    new CursorTrail();
    new SmoothScroll();
    new HeaderScroll();
    new FeaturesCarousel();
    new FAQAccordion();
    new BackToTop();
    new ScrollAnimations();
});
