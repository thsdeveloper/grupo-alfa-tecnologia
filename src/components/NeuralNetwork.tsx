"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface MousePosition {
  x: number;
  y: number;
}

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<MousePosition>({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.floor((width * height) / 12000);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    particlesRef.current = particles;
  }, []);

  const drawNetwork = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Limpa o canvas
    ctx.clearRect(0, 0, width, height);

    // Configurações de conexão
    const connectionDistance = 150;
    const mouseConnectionDistance = 200;

    // Atualiza e desenha partículas
    particles.forEach((particle, i) => {
      // Movimento das partículas
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce nas bordas
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      // Mantém dentro dos limites
      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));

      // Interação com o mouse - atrai suavemente
      const dxMouse = mouse.x - particle.x;
      const dyMouse = mouse.y - particle.y;
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      if (distMouse < mouseConnectionDistance && distMouse > 0) {
        const force = (mouseConnectionDistance - distMouse) / mouseConnectionDistance;
        particle.vx += (dxMouse / distMouse) * force * 0.02;
        particle.vy += (dyMouse / distMouse) * force * 0.02;

        // Limita velocidade
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > 2) {
          particle.vx = (particle.vx / speed) * 2;
          particle.vy = (particle.vy / speed) * 2;
        }
      }

      // Desenha conexões entre partículas - usando verde limão do projeto
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          // #b6c72c = rgb(182, 199, 44)
          ctx.strokeStyle = `rgba(182, 199, 44, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Conexões especiais com o mouse - verde limão mais brilhante
      if (distMouse < mouseConnectionDistance) {
        const opacity = (1 - distMouse / mouseConnectionDistance) * 0.8;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(182, 199, 44, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Desenha a partícula (nó)
      const glowRadius = distMouse < mouseConnectionDistance ? particle.radius * 1.5 : particle.radius;
      
      // Glow effect - verde limão
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        glowRadius * 3
      );
      gradient.addColorStop(0, "rgba(182, 199, 44, 0.9)");
      gradient.addColorStop(0.5, "rgba(182, 199, 44, 0.3)");
      gradient.addColorStop(1, "rgba(182, 199, 44, 0)");

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, glowRadius * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Núcleo da partícula - branco com toque de verde
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(220, 230, 150, 0.95)";
      ctx.fill();
    });

    // Desenha um nó no cursor do mouse - verde limão
    if (mouse.x > 0 && mouse.y > 0) {
      const mouseGradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        30
      );
      mouseGradient.addColorStop(0, "rgba(182, 199, 44, 0.5)");
      mouseGradient.addColorStop(0.5, "rgba(182, 199, 44, 0.15)");
      mouseGradient.addColorStop(1, "rgba(182, 199, 44, 0)");

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = mouseGradient;
      ctx.fill();
    }

    animationFrameRef.current = requestAnimationFrame(drawNetwork);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    animationFrameRef.current = requestAnimationFrame(drawNetwork);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [initParticles, drawNetwork]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}

