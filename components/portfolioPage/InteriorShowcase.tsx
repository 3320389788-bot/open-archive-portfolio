import { SHOWCASE_INTRO, STACK_STAGGER_MS } from './showcaseIntro';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { renderSlides } from './interiorSlides';
export default function RenderStudyExperience({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState('black');
  const [index, setIndex] = useState(0);
  const [railStep, setRailStep] = useState(0);
  const [snapping, setSnapping] = useState(false);
  const [zoom, setZoom] = useState(false);
  const root = useRef<HTMLElement>(null);
  const lastStep = useRef(-1000);
  const touchY = useRef(0);
  const count = renderSlides.length;
  const move = (direction: number) => { if (performance.now() - lastStep.current < 950) return; lastStep.current = performance.now(); setIndex(value => (value + direction + count) % count); setRailStep(value => value + direction); };
  const railPosition = snapping ? count + index : count + railStep;
  useEffect(() => {
    if (railStep >= count || railStep < 0) {
      const timer = window.setTimeout(() => { setSnapping(true); setRailStep(index); window.requestAnimationFrame(() => window.requestAnimationFrame(() => setSnapping(false))); }, 880);
      return () => window.clearTimeout(timer);
    }
  }, [railStep, index, count]);
  useEffect(() => {
    root.current?.focus();

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timers = motionPreference.matches ? [] : SHOWCASE_INTRO.map(([delay, next]) => window.setTimeout(() => setPhase(next), delay));
    const skipIntro = () => {
      if (!motionPreference.matches) return;
      timers.forEach(window.clearTimeout);
      setPhase('interactive');
    };
    skipIntro();
    motionPreference.addEventListener('change', skipIntro);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      timers.forEach(window.clearTimeout);
      motionPreference.removeEventListener('change', skipIntro);
      document.body.style.overflow = overflow;
    };
  }, []);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let accumulated = 0;
    let lastWheel = 0;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      if (phase !== 'interactive' || zoom) return;
      const now = performance.now();
      if (now - lastWheel > 180) accumulated = 0;
      lastWheel = now;
      if (now - lastStep.current < 950) return;
      accumulated += event.deltaY * (event.deltaMode === 1 ? 16 : 1);
      if (Math.abs(accumulated) < 35) return;
      move(Math.sign(accumulated)); accumulated = 0;
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => element.removeEventListener('wheel', wheel);
  }, [phase, zoom]);
  const slide = renderSlides[index];
  return createPortal(<section ref={root} className="study-showcase motion-v2" data-phase={phase} style={{ '--stack-stagger': `${STACK_STAGGER_MS}ms` } as CSSProperties} role="dialog" aria-modal="true" aria-label="效果图展示" tabIndex={-1}
    onKeyDown={event => { if (event.key === 'Escape') { zoom ? setZoom(false) : onClose(); } if (phase === 'interactive') { if (['ArrowDown','ArrowRight'].includes(event.key)) { event.preventDefault(); move(1); } if (['ArrowUp','ArrowLeft'].includes(event.key)) { event.preventDefault(); move(-1); } } }}
    onTouchStart={event => { touchY.current = event.touches[0].clientY; }} onTouchEnd={event => { if (phase === 'interactive' && !zoom && Math.abs(touchY.current - event.changedTouches[0].clientY) > 45) move(Math.sign(touchY.current - event.changedTouches[0].clientY)); }}>
    <button className="study-close" onClick={onClose} aria-label="关闭效果图展示"><X /></button>

    <div className="study-stack" aria-hidden="true">{renderSlides.map((item, i) => <img key={i} src={item.image} alt="" style={{ '--i': i } as CSSProperties} />)}</div>
    <div className="study-brackets" aria-hidden="true"><svg viewBox="0 0 116 260"><path d="M29 0H116V5A104 125 0 0 0 116 255V260H29L0 231V29Z" /></svg><svg viewBox="0 0 116 260"><path d="M29 0H116V5A104 125 0 0 0 116 255V260H29L0 231V29Z" /></svg></div>
    <div className="study-viewport">
      <div className="study-track" data-snapping={snapping}
        style={{ transform: `translate3d(0,${-railPosition * 46}vh,0)`, '--study-descent-offset': `${-count * 46}vh` } as CSSProperties}
        onAnimationEnd={event => {
          if (event.target === event.currentTarget && event.animationName === 'studio-descend' && phase === 'descend') setPhase('interactive');
        }}>
        {[...renderSlides, ...renderSlides, ...renderSlides].map((item, i) => (
          <button key={i} className={i === railPosition ? 'is-active' : ''}
            data-intro-slide={i > count + 1 && i <= count * 2}
            tabIndex={i === railPosition && phase === 'interactive' ? 0 : -1}
            onClick={() => setZoom(true)} aria-label={`放大 ${item.title}`}>
            <img src={item.image} alt={item.title} loading={i >= count - 1 && i <= count * 2 ? 'eager' : 'lazy'} />
          </button>
        ))}
      </div>
    </div>
    <div className="study-meta" key={index} aria-live="polite"><div className="study-scene">{slide.scene}</div><div className="study-photo-number" aria-label={`第 ${index + 1} 张照片`}>{index + 1}</div></div>
    <footer className="study-footer"><span>滚动浏览 / RENDER STUDY</span></footer>
    {zoom && <div className="study-zoom" onClick={() => setZoom(false)}><button autoFocus aria-label="关闭放大"><X /></button><img src={slide.image} alt={slide.title} /></div>}
  </section>, document.body);
}
