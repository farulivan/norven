import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reducedMotion } from "./motion";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

function initLenis(): void {
  if (lenis || reducedMotion()) return;
  lenis = new Lenis({ autoRaf: false, lerp: 0.12, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

function destroyLenis(): void {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

function bindReveals(): void {
  const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  if (els.length === 0) return;
  if (reducedMotion()) {
    els.forEach((el) => {
      el.classList.add("is-in");
      gsap.set(el, { clearProps: "all" });
    });
    return;
  }
  ScrollTrigger.batch(els, {
    start: "top 88%",
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          overwrite: true,
        },
      ),
    once: true,
  });
}

function boot(): void {
  initLenis();
  bindReveals();
  // Refresh after reveals + section scripts have set their triggers
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

document.addEventListener("astro:page-load", boot);
document.addEventListener("astro:before-swap", destroyLenis);
