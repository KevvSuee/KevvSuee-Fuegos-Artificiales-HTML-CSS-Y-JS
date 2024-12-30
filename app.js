const starsCanvas = document.getElementById('starsCanvas');
const fireworksCanvas = document.getElementById('fireworksCanvas');
const starsCtx = starsCanvas.getContext('2d');
const fireworksCtx = fireworksCanvas.getContext('2d');

starsCanvas.width = fireworksCanvas.width = window.innerWidth;
starsCanvas.height = fireworksCanvas.height = window.innerHeight;

// Star class to create moving stars
class Star {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed * 15;
    }

    update() {
        this.y += this.speed;
        if (this.y > starsCanvas.height) {
            this.y = 0;
            this.x = Math.random() * starsCanvas.width;
        }
    }

    draw() {
        starsCtx.fillStyle = 'white';
        starsCtx.beginPath();
        starsCtx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        starsCtx.fill();
    }
}

// Campo de estrellas

const stars = [];
for (let i = 0; i < 200; i++) {
    const x = Math.random() * starsCanvas.width;
    const y = Math.random() * starsCanvas.height;
    const radius = Math.random() * 1.5;
    const speed = Math.random() * 0.5 + 0.5;
    stars.push(new Star(x, y, radius, speed));
}

class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.trail = [];
        this.exploded = false;
        this.particles = [];
    }

    update() {
        if (!this.exploded) {
            this.trail.push({x: this.x, y: this.y});
            if (this.trail.length > 50) this.trail.shift();

            this.y -= 3;
            if (this.y < fireworksCanvas.height / 2) {
                this.explode();
                this.exploded = true;
            }
        } else {
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => particle.alpha > 0);
        }
    }

    draw() {
        if (!this.exploded) {
            fireworksCtx.beginPath();
            fireworksCtx.moveTo(this.x, this.y);
            this.trail.forEach(point => fireworksCtx.lineTo(point.x, point.y));
            fireworksCtx.strokeStyle = this.color;
            fireworksCtx.stroke();
        } else {
            this.particles.forEach(particle => particle.draw());
        }
    }

    explode() {
        const particleCount = 100;
        const angleIncrement = (2 * Math.PI) / particleCount;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color, i * angleIncrement));
        }
    }
}

class Particle {
    constructor(x, y, color, angle) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.speed = Math.random() * 3 + 1;
        this.gravity = 0.05;
        this.alpha = 1;
        this.fade = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle) + this.gravity;
        this.alpha -= this.fade;
    }

    draw() {
        fireworksCtx.save();
        fireworksCtx.globalAlpha = this.alpha;
        fireworksCtx.fillStyle = this.color;
        fireworksCtx.beginPath();
        fireworksCtx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
        fireworksCtx.fill();
        fireworksCtx.restore();
    }
}

const fireworks = [];
const colors = ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#8000ff'];

function animate() {
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    // Actualizacion para dibujar las estrellas

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    // fireworks

    if (Math.random() < 0.05) {
        const x = Math.random() * fireworksCanvas.width;
        const color = colors[Math.floor(Math.random() * colors.length)];
        fireworks.push(new Firework(x, fireworksCanvas.height, color));
    }
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.exploded && firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

animate();