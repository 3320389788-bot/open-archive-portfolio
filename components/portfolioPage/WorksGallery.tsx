import { ArrowRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { portfolioWorks } from './content';
import { sampleGalleryLayoutProgress, type GalleryLayout } from './galleryLayout';
import type { GalleryComposition } from './galleryComposition';

type ScrollGalleryProps = {
  showSeriesHint: boolean;
  controlsLeft: number;
  controlsFontSize: number;
  pageGutter: number;
  layout: GalleryLayout;
  composition: GalleryComposition;
  progress: number;
  reducedMotion?: boolean;
  onView: (id: string) => void;
  onSeek: (index: number) => void;
};

export default function ScrollGallery({ showSeriesHint, controlsLeft, controlsFontSize, pageGutter, layout, composition, progress, reducedMotion = false, onView, onSeek }: ScrollGalleryProps) {
  const count = portfolioWorks.length;
  const clampedProgress = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const galleryFrame = sampleGalleryLayoutProgress(clampedProgress, layout);
  const index = galleryFrame.currentIndex;
  const position = reducedMotion ? index : clampedProgress * (count - 1);
  const ribbonPosition = reducedMotion ? layout.positions[index] * layout.maxTravel : galleryFrame.position;
  const maxAspectRatio = Math.max(...portfolioWorks.map(work => work.width / work.height));

  return (
    <section className="archive-scroll-gallery" data-ribbon={layout.compact} aria-label="作品集" style={{
      '--gallery-max-ratio': maxAspectRatio,
      '--controls-font-size': `${controlsFontSize}px`,
      '--gallery-image-height': `${layout.imageHeight}px`,
    } as CSSProperties}>
      <header className="archive-gallery-header">
        <span className="archive-gallery-counter" style={{ transform: `translate3d(${composition.counterOffsetX}px, ${composition.counterOffsetY}px, 0)` }}>
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        {showSeriesHint && <span className="archive-gallery-series-hint">点击展开</span>}
      </header>

      <div className="archive-gallery-viewport" style={{ transform: `translate3d(${composition.artOffsetX}px, ${composition.artOffsetY ?? 0}px, 0) scale(${composition.artScale})` }}>
        <div className="archive-gallery-track" style={layout.compact ? {
          transform: `translate3d(${-ribbonPosition}px, 0, 0)`,
          width: layout.trackWidth,
          paddingLeft: layout.leading,
          paddingRight: layout.trailing,
        } : { transform: `translate3d(${-position * 100}%, 0, 0)` }}>
          {portfolioWorks.map((work, workIndex) => (
            <figure className="archive-gallery-slide" key={work.id} style={layout.compact ? { width: layout.widths[workIndex] } : undefined}>
              <div className="archive-gallery-art-area">
                <button
                  className="archive-gallery-art"
                  type="button"
                  onClick={() => onView(work.id)}
                  tabIndex={workIndex === index ? 0 : -1}
                  aria-label={`View ${work.title}`}
                  style={{ aspectRatio: `${work.width} / ${work.height}` }}
                >
                  <img
                    src={work.image}
                    alt={work.alt}
                    width={work.width}
                    height={work.height}
                    loading={workIndex < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </button>
              </div>

            </figure>
          ))}
        </div>
      </div>



      <footer className="archive-gallery-controls" style={{ transform: `translate3d(0, ${composition.controlsOffsetY}px, 0)`, position: 'relative', left: controlsLeft - pageGutter, marginLeft: 0 }}>
        <button
          className="archive-gallery-next"
          type="button"
          onClick={() => onSeek(index + 1)}
          disabled={index === count - 1}
          aria-label="下一张"
        >
          <ArrowRight size={23} aria-hidden="true" />
        </button>
        <span className="archive-gallery-scroll-hint">继续滚动</span>

      </footer>
    </section>
  );
}
