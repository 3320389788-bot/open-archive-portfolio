import type { CSSProperties } from 'react';
import type { GalleryNotesLayout } from './galleryNotesLayout';

export default function GalleryNotes({ layout }: { layout: GalleryNotesLayout }) {
  if (layout.level === 'hidden') return null;
  const rectStyle = (rect: GalleryNotesLayout['left']): CSSProperties => ({
    left: rect.left, top: rect.top, width: rect.width, height: rect.height,
    '--note-width': `${rect.width}px`,
  } as CSSProperties);
  const screenHeight = layout.left.height / layout.fontUnit;
  const tight = screenHeight < 320;
  const headingSize = Math.min(layout.headingSize,
    layout.level === 'full' && tight ? 30 : layout.level === 'compact' && screenHeight < 160 ? 22 : layout.headingSize,
  );

  return (
    <div className="archive-gallery-notes" data-density={layout.level} data-tight={tight} aria-hidden="true" style={{
      opacity: layout.opacity,
      '--note-unit': layout.fontUnit,
      '--note-heading': `${headingSize}px`,
      '--note-body-size': `${Math.max(1, Math.round(13 * layout.fontUnit))}px`,
      '--note-heading-size': `${Math.max(1, Math.round(headingSize * layout.fontUnit))}px`,
    } as CSSProperties}>
      <div className="archive-gallery-note archive-gallery-note-left" style={rectStyle(layout.left)}>
        <span className="archive-gallery-note-label">{layout.level === 'minimal' ? '05' : 'ARCHIVE / 05'}</span>
        <h2>{layout.level === 'minimal' ? 'Render Study' : <>Render<br /><em>Study</em></>}</h2>
        {layout.level === 'full' && <div className="archive-gallery-note-copy">
          <p>A collection of render studies.<br />效果图临摹习作。</p>
          <p>Focus on space, material and light.<br />研习空间、材质与光影。</p>
          <p>Learn from excellent works to polish visual skills.<br />借鉴优秀案例，打磨画面表达能力。</p>
        </div>}
        {layout.level === 'compact' && <p className="archive-gallery-note-copy">效果图临摹习作，<br />研习空间、材质与光影。</p>}
        {layout.level === 'full' && <span className="archive-gallery-note-foot">近距离观察 ↗</span>}
      </div>
    </div>
  );
}
