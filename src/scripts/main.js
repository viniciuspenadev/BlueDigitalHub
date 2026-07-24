import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Preloader + intro do hero ---------- */
const preloader = document.getElementById('preloader');
const pct = document.getElementById('preloader-pct');
const heroLines = document.querySelectorAll('.hero-line');
const heroRest = document.querySelectorAll('.hero-badge, .hero-sub, .hero-cta, .hero-hint');

if (preloader && !reduced) {
  document.documentElement.classList.add('overflow-hidden');
  gsap.set(heroLines, { yPercent: 110 });
  gsap.set(heroRest, { opacity: 0, y: 24 });

  const state = { v: 0 };
  gsap.to(state, {
    v: 100,
    duration: 0.6, // contador rápido — reduz o tempo até o H1 pintar (LCP)
    ease: 'power2.inOut',
    onUpdate() {
      pct.textContent = `${Math.round(state.v)}%`;
    },
    onComplete() {
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.5,
        ease: 'power4.inOut',
        onStart() {
          const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
          tl.to(heroLines, { yPercent: 0, duration: 0.7, stagger: 0.08 }, 0.05)
            .to(heroRest, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 }, 0.3);
        },
        onComplete() {
          preloader.remove();
          document.documentElement.classList.remove('overflow-hidden');
        },
      });
    },
  });
} else if (preloader) {
  preloader.remove();
}

/* ---------- Reveal palavra por palavra (manifesto) ---------- */
document.querySelectorAll('.word-reveal').forEach((el) => {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join('');
  if (reduced) return;
  gsap.to(el.querySelectorAll('.w'), {
    opacity: 1,
    ease: 'none',
    stagger: 0.05,
    scrollTrigger: {
      trigger: el,
      start: 'top 78%',
      end: 'bottom 50%',
      scrub: 0.4,
    },
  });
});

/* ---------- Entrada suave das seções ---------- */
if (!reduced) {
  gsap.utils.toArray('[data-animate]').forEach((el) => {
    gsap.from(el, {
      y: 36,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' },
    });
  });
}

/* O comportamento do header (fundo ao rolar, esconder ao descer) e o menu
   mobile vivem agora no próprio componente Header.astro, para funcionarem
   em todas as páginas — inclusive as que não carregam este main.js. */

/* O contato agora é um quiz-diagnóstico com lógica própria em Contact.astro. */
