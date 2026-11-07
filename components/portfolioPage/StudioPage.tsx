import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import ComputerIntro from './ComputerIntro';
import IntroChrome from './IntroChrome';
import BackgroundMusic from './MusicWelcome';
import ArchiveDesk from './ArchiveDesk';
import ArchiveDialog, { type ArchiveDetail } from './ArchiveDetails';
import RenderStudyExperience from './InteriorShowcase';
import ScrollGallery from './WorksGallery';
import GalleryNotes from './GalleryNotes';
import { sampleTimeline, sampleOpeningLayers, progressForModule, progressForGalleryProgress, timelineRunwayVh, TIMELINE_STOPS, type ModuleId } from './studioTimeline';
import { portfolioWorks, templateProfile } from './content';
import { portfolioModules as modules } from './modules';
import { getResponsiveLayout, sampleDeskLayout } from './studioLayout';
import { getGalleryLayout, sampleGalleryLayoutProgress } from './galleryLayout';
import { GALLERY_SOURCE_PAPER, sampleGalleryPortal } from './galleryPortal';
import { getGalleryComposition } from './galleryComposition';
import { getGalleryNotesLayout, projectGalleryNotes } from './galleryNotesLayout';
import useViewport from './useViewport';
import './portfolioStyles.css';

type DialogScrollSnapshot = {
  progress: number;
  left: number;
  overflowY: string;
  opener: HTMLElement | null;
  ancestors: { element: HTMLElement; top: number; left: number }[];
  closing: boolean;
};

export default function PortfolioTemplate() {
  const reducedMotion = useReducedMotion();
  const track = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const dialogScroll = useRef<DialogScrollSnapshot | null>(null);
  const restoreFrame = useRef(0);
  const [t, setT] = useState(0);
  const viewport = useViewport();
  const [detail, setDetail] = useState<ArchiveDetail | null>(null);
  const [renderStudyOpen, setRenderStudyOpen] = useState(false);
  const isDetailOpen = detail !== null;
  const galleryCount = portfolioWorks.length;
  const layout = getResponsiveLayout(viewport);
  const frame = sampleTimeline(t, layout.compact, galleryCount);
  const gallery = useMemo(() => getGalleryLayout(viewport, portfolioWorks), [viewport]);
  const galleryFrame = sampleGalleryLayoutProgress(frame.galleryProgress, gallery);
  const sceneT = frame.sceneProgress;
  const opening = sampleOpeningLayers(sceneT, Boolean(reducedMotion));
  const current = modules.find(item => item.id === frame.activeModule);
  const deskScene = reducedMotion && current
    ? TIMELINE_STOPS.find(stop => stop.activeModule === current.id)?.t ?? sceneT
    : sceneT;
  const desk = sampleDeskLayout(deskScene, viewport);
  const { scale, camera } = desk;
  const galleryNotesFocusScale = sampleDeskLayout(0.70, viewport).scale;
  const expansion = reducedMotion ? Number(frame.galleryExpansion >= 0.5) : frame.galleryExpansion;
  const portal = sampleGalleryPortal(viewport, desk, expansion);
  const maxAspectRatio = Math.max(...portfolioWorks.map(work => work.width / work.height));
  const galleryComposition = getGalleryComposition(viewport, expansion, {
    gallery,
    maxAspectRatio,
    deskScale: desk.scale,
    currentImageRatio: portfolioWorks[galleryFrame.currentIndex].width / portfolioWorks[galleryFrame.currentIndex].height,
  });
  const galleryNotes = getGalleryNotesLayout(viewport, expansion, {
    composition: galleryComposition,
    focusScale: galleryNotesFocusScale,
  });
  const card = sampleGalleryPortal(viewport, desk, 0);
  const zoomThroughCard = !reducedMotion && expansion > 0;
  const cardZoom = card.paperScale > 0
    ? portal.paperScale / card.paperScale
    : 1;
  const zoomScale = scale * cardZoom;
  const cardAnchorX = scale > 0 ? camera.x + (card.centerX - desk.center.x) / scale : camera.x;
  const cardAnchorY = scale > 0 ? camera.y + (card.centerY - desk.center.y) / scale : camera.y;
  const galleryInteractive = opening.archiveInteractive && expansion >= 1 - 1e-6;
  const chromeGray = Math.round(243 + 12 * expansion);

  useEffect(() => {
    const title = document.title;
    const lang = document.documentElement.lang;
    document.title = `${templateProfile.pageTitle} — Portfolio Template`;
    document.documentElement.lang = 'en';
    document.body.classList.add('archive-page-open');
    return () => { document.title = title; document.documentElement.lang = lang; document.body.classList.remove('archive-page-open'); };
  }, []);

  useEffect(() => () => {
    window.cancelAnimationFrame(restoreFrame.current);
    if (track.current && dialogScroll.current) track.current.style.overflowY = dialogScroll.current.overflowY;
  }, []);

  useLayoutEffect(() => {
    const element = track.current;
    if (!element) return;
    let raf = 0;
    let displayed = scrollProgress.current;
    let lastTime = 0;
    let lastWheel = -Infinity;
    let wheelDistance = 0;
    let wheelHandled = false;
    let destination: number | null = null;
    let settleUntil = 0;
    let touchStart: { x: number; y: number } | null = null;
    const stops = [0, ...modules.flatMap(({ id }) => id === 'works'
      ? gallery.positions.map(position => progressForGalleryProgress(position, galleryCount))
      : [progressForModule(id, galleryCount)])];
    const readProgress = () => {
      const length = element.scrollHeight - element.clientHeight;
      scrollProgress.current = length > 0 ? Math.min(1, Math.max(0, element.scrollTop / length)) : 0;
    };
    const animate = (time: number) => {
      raf = 0;
      if (dialogScroll.current) { displayed = scrollProgress.current; return; }
      const dt = lastTime ? Math.min(64, time - lastTime) : 16;
      lastTime = time;
      const target = scrollProgress.current;
      displayed = reducedMotion ? target : displayed + (target - displayed) * (1 - Math.exp(-dt / 65));
      if (Math.abs(target - displayed) < 0.00001) displayed = target;
      setT(displayed);
      if (displayed !== target) raf = window.requestAnimationFrame(animate);
      else lastTime = 0;
    };
    const onScroll = () => {
      if (dialogScroll.current) return;
      readProgress();
      if (!raf) raf = window.requestAnimationFrame(animate);
    };
    const advance = (direction: number) => {
      if (dialogScroll.current) return;
      if (destination !== null && Math.abs(element.scrollTop - destination) > 2 && performance.now() < settleUntil) return;
      const length = element.scrollHeight - element.clientHeight;
      const top = element.scrollTop;
      const candidates = direction > 0 ? stops : [...stops].reverse();
      const stop = candidates.find(progress => direction * (progress * length - top) > 2);
      if (stop === undefined) return;
      destination = stop * length;
      settleUntil = performance.now() + 1200;
      element.scrollTo({ top: destination, behavior: reducedMotion ? 'instant' : 'smooth' });
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || dialogScroll.current || !event.deltaY) return;
      event.preventDefault();
      const time = performance.now();
      if (time - lastWheel > 160) {
        wheelDistance = 0;
        wheelHandled = false;
      }
      lastWheel = time;
      if (wheelHandled) return;
      wheelDistance += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1);
      if (Math.abs(wheelDistance) < 12) return;
      wheelHandled = true;
      advance(Math.sign(wheelDistance));
    };
    const onTouchStart = (event: TouchEvent) => {
      touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (!touchStart || event.touches.length) return;
      const { clientX, clientY } = event.changedTouches[0];
      const delta = touchStart.y - clientY;
      const horizontal = touchStart.x - clientX;
      touchStart = null;
      if (Math.abs(delta) >= 40 && Math.abs(delta) > Math.abs(horizontal)) advance(Math.sign(delta));
    };
    element.addEventListener('scroll', onScroll, { passive: true });
    element.addEventListener('wheel', onWheel, { passive: false });
    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchend', onTouchEnd, { passive: true });
    readProgress();
    displayed = scrollProgress.current;
    setT(displayed);
    return () => {
      element.removeEventListener('scroll', onScroll);
      element.removeEventListener('wheel', onWheel);
      window.cancelAnimationFrame(raf);
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [reducedMotion, galleryCount, gallery.positions]);

  useLayoutEffect(() => {
    const element = track.current;
    if (!element) return;
    const progress = dialogScroll.current?.progress ?? scrollProgress.current;
    element.scrollTo({ top: progress * (element.scrollHeight - element.clientHeight), left: 0, behavior: 'instant' });
  }, [viewport.width, viewport.height, galleryCount]);

  const openDetail = (nextDetail: ArchiveDetail) => {
    const element = track.current;
    if (!element || dialogScroll.current?.closing) return;
    if (!dialogScroll.current) {
      const length = element.scrollHeight - element.clientHeight;
      const progress = length > 0 ? element.scrollTop / length : 0;
      const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const ancestors: DialogScrollSnapshot['ancestors'] = [];
      for (let ancestor = opener?.parentElement; ancestor && ancestor !== element; ancestor = ancestor.parentElement) {
        if (element.contains(ancestor)) ancestors.push({ element: ancestor, top: ancestor.scrollTop, left: ancestor.scrollLeft });
      }
      // Freeze before showModal can focus or scroll anything in the scene.
      dialogScroll.current = { progress, left: element.scrollLeft, overflowY: element.style.overflowY, opener, ancestors, closing: false };
      scrollProgress.current = progress;
      setT(progress);
      element.scrollTo({ top: element.scrollTop, left: element.scrollLeft, behavior: 'instant' });
      element.style.overflowY = 'hidden';
    }
    setDetail(nextDetail);
  };

  const closeDetail = () => {
    const saved = dialogScroll.current;
    const element = track.current;
    if (!saved || saved.closing || !element) return;
    saved.closing = true;
    setDetail(null);
    const restore = () => {
      element.style.overflowY = saved.overflowY;
      scrollProgress.current = saved.progress;
      setT(saved.progress);
      element.scrollTo({ top: saved.progress * (element.scrollHeight - element.clientHeight), left: saved.left, behavior: 'instant' });
      for (const item of saved.ancestors) {
        item.element.scrollTo({ top: item.top, left: item.left, behavior: 'instant' });
      }
    };
    saved.opener?.focus({ preventScroll: true });
    restore();
    // Native focus restoration and React's close commit must both finish before
    // the scroll observer can advance the timeline again.
    restoreFrame.current = window.requestAnimationFrame(() => {
      restore();
      dialogScroll.current = null;
      restoreFrame.current = 0;
    });
  };

  const openRenderStudy = () => {
    closeDetail();
    window.requestAnimationFrame(() => setRenderStudyOpen(true));
  };

  const seek = (progress: number) => {
    const element = track.current;
    if (!element) return;
    element.scrollTo({ top: Math.max(0, Math.min(1, progress)) * (element.scrollHeight - element.clientHeight), left: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
  };

  const openModule = (id: ModuleId) => {
    if (id === 'works') seek(progressForModule(id, galleryCount));
    else openDetail({ type: 'module', id });
  };
  const openWork = (id: string) => openDetail({ type: 'work', id });
  const seekImage = (index: number) => seek(progressForGalleryProgress(gallery.positions[Math.max(0, Math.min(galleryCount - 1, index))], galleryCount));
  const hasGalleryNext = current?.id === 'works' && frame.galleryProgress < 1;
  const next = () => {
    if (hasGalleryNext) seekImage(Math.min(galleryCount - 1, galleryFrame.currentIndex + 1));
    else {
      const index = modules.findIndex(item => item.id === current?.id);
      seek(progressForModule(modules[(index + 1) % modules.length].id, galleryCount));
    }
  };

  return (
    <div className="archive-page" data-short={viewport.height < 480} style={{
      left: viewport.left,
      top: viewport.top,
      width: viewport.width,
      height: viewport.height,
      '--viewport-left': `${viewport.left}px`,
      '--viewport-top': `${viewport.top}px`,
      '--viewport-width': `${viewport.width}px`,
      '--viewport-height': `${viewport.height}px`,
      '--page-gutter': `${layout.gutter}px`,
      '--nav-inset': `${layout.navInset}px`,
      '--header-height': `${layout.headerHeight}px`,
      '--footer-height': `${layout.footerHeight}px`,
    } as CSSProperties}>
      <BackgroundMusic />
      <main ref={track} className="archive-scroll-track" tabIndex={0} aria-label="Portfolio archive. Scroll to explore, select a note to read more.">
        <div className="archive-scroll-runway" style={{ height: timelineRunwayVh(galleryCount) / 100 * viewport.height }}>
          <div className="archive-pinned-stage" data-progress={t}>
            <div className="archive-computer-layer" style={{ opacity: opening.computerOpacity, pointerEvents: opening.computerInteractive ? 'auto' : 'none', visibility: opening.computerVisible ? 'visible' : 'hidden' }} aria-hidden={!opening.computerVisible} inert={!opening.computerInteractive}>
              <ComputerIntro width={layout.computerWidth} scale={reducedMotion ? 1 : frame.computerScale} loadingProgress={sceneT > 0.01 && sceneT < 0.12 ? Math.min(1, sceneT / 0.12) : null} playVideo={opening.computerVisible && !isDetailOpen} reducedMotion={Boolean(reducedMotion)} onEnter={() => seek(progressForModule('about', galleryCount))} />
            </div>
            <div className="archive-intro-chrome" style={{ opacity: opening.computerOpacity, visibility: opening.computerVisible ? 'visible' : 'hidden' }} aria-hidden={!opening.computerVisible} inert={!opening.computerInteractive}>
              <IntroChrome onOpen={() => seek(progressForModule('about', galleryCount))} />
            </div>
            <div className="archive-desk-layer" style={{ opacity: opening.deskOpacity, visibility: opening.archiveVisible ? 'visible' : 'hidden', pointerEvents: opening.archiveInteractive && !galleryInteractive ? 'auto' : 'none' }} aria-hidden={!opening.archiveInteractive || galleryInteractive} inert={!opening.archiveInteractive || galleryInteractive}>
              <div className="archive-desk-camera" style={{
                left: zoomThroughCard ? portal.centerX : desk.center.x,
                top: zoomThroughCard ? portal.centerY : desk.center.y,
                transform: zoomThroughCard
                  ? `rotate(${portal.rotation - card.rotation}deg) translate3d(${-cardAnchorX * zoomScale}px, ${-cardAnchorY * zoomScale}px, 0) scale(${zoomScale})`
                  : `translate3d(${-camera.x * scale}px, ${-camera.y * scale}px, 0) scale(${scale})`,
              }}>
                <ArchiveDesk onSelect={openModule} />
              </div>
            </div>
            <div className="archive-gallery-layer" data-expansion={frame.galleryExpansion} style={{
              opacity: opening.deskOpacity,
              visibility: opening.archiveVisible ? 'visible' : 'hidden',
            }} aria-hidden={!opening.archiveInteractive} inert={!opening.archiveInteractive}>
              <button className="archive-gallery-paper" data-module="works" type="button" onClick={() => seek(progressForModule('works', galleryCount))} aria-label={`Open chapter 05: ${galleryCount} selected images`} aria-hidden={galleryInteractive} inert={galleryInteractive} tabIndex={galleryInteractive ? -1 : 0} style={{
                left: portal.centerX,
                top: portal.centerY,
                width: GALLERY_SOURCE_PAPER.width,
                height: GALLERY_SOURCE_PAPER.height,
                transform: `translate(-50%, -50%) rotate(${portal.rotation}deg) scale(${portal.paperScale})`,
                pointerEvents: opening.archiveInteractive && !galleryInteractive ? 'auto' : 'none',
              }} />
              <div className="archive-gallery-notes-paper" style={{
                left: Math.round(portal.centerX - portal.paperWidth / 2),
                top: Math.round(portal.centerY - portal.paperHeight / 2),
                width: Math.round(portal.paperWidth),
                height: Math.round(portal.paperHeight),
                transform: `rotate(${portal.rotation}deg)`,
              }}>
                <GalleryNotes layout={projectGalleryNotes(galleryNotes, portal.paperScale)} />
              </div>
              <div className="archive-gallery-content" aria-hidden={!galleryInteractive} inert={!galleryInteractive} style={{
                left: portal.centerX,
                top: portal.centerY,
                width: viewport.width,
                height: viewport.height,
                transform: `translate(-50%, -50%) rotate(${portal.rotation}deg) scale(${portal.scale})`,
                pointerEvents: galleryInteractive ? 'auto' : 'none',
              }}>
                <ScrollGallery showSeriesHint={galleryInteractive}
                  controlsLeft={(1 - galleryComposition.motionProgress) * (viewport.width / 2 + (galleryComposition.textRect.left - GALLERY_SOURCE_PAPER.width / 2) * portal.paperScale / Math.max(portal.scale, 0.0001)) + galleryComposition.motionProgress * layout.gutter}
                  controlsFontSize={(1 - galleryComposition.motionProgress) * (12 * galleryNotes.fontUnit * portal.paperScale / Math.max(portal.scale, 0.0001)) + galleryComposition.motionProgress * 13}
                  pageGutter={layout.gutter} layout={gallery} composition={galleryComposition} progress={frame.galleryProgress} reducedMotion={!!reducedMotion} onView={openWork} onSeek={seekImage} />
              </div>
            </div>
            <div className="archive-archive-chrome" style={{ opacity: opening.deskOpacity, visibility: opening.archiveVisible ? 'visible' : 'hidden', '--chrome-surface': `rgb(${chromeGray}, ${chromeGray}, ${chromeGray})` } as CSSProperties} aria-hidden={!opening.archiveInteractive} inert={!opening.archiveInteractive}>
              <header><button type="button" onClick={() => seek(0)}>{templateProfile.brand}<span> / ARCHIVE</span></button><button type="button" onClick={() => openModule('collaboration')}>Say hello <ArrowUpRight size={13} /></button></header>
              <nav className="archive-focus-nav" aria-label="Archive sections">{modules.map((item, index) => <button key={item.id} type="button" onClick={() => seek(progressForModule(item.id, galleryCount))} aria-current={current?.id === item.id ? 'location' : undefined} aria-label={`Explore ${item.label}`}>{index + 1}</button>)}</nav>
              <footer><span>{current ? current.label : '总览'}</span><button type="button" onClick={next}>{hasGalleryNext ? '下一张' : '下一章节'} <ArrowDown size={12} /></button><span className="archive-t-readout">{String(modules.findIndex(item => item.id === current?.id) + 1).padStart(2, '0')} / 06</span></footer>
            </div>
          </div>
        </div>
      </main>
      <ArchiveDialog detail={detail} onClose={closeDetail} onView={openWork} onOpenRenderStudy={openRenderStudy} />
      {renderStudyOpen && <RenderStudyExperience onClose={() => setRenderStudyOpen(false)} />}
    </div>
  );
}
