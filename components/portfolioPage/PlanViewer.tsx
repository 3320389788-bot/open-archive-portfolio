import { bindPhotoWheel, stepPhoto } from './photoGestures';
import ImageZoom from './ImageZoom';
import { constructionDrawings } from './constructionPhotos';
import plan1 from './photos/plan-01.jpg?url';
import plan2 from './photos/plan-02.jpg?url';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
export default function DocumentGallery({ kind, onBack }: { kind: 'plan' | 'construction'; onBack: () => void }) {
  const images = kind === 'plan' ? [plan1, plan2] : constructionDrawings.map(item => item.image);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const go = (next: number) => setIndex(Math.max(0, Math.min(images.length - 1, next)));
  const touch = useRef(0);
  useEffect(() => {
    const element = section.current?.closest('dialog');
    if (!element || zoom) return;
    return bindPhotoWheel(element, direction=>setIndex(value=>stepPhoto(value,direction,images.length)));
  },[images.length,zoom]);
  const label = kind === 'plan' ? ['原始平面图', '平面布置图'][index] : constructionDrawings[index].label;
  return <section ref={section} className="document-gallery" onKeyDown={event => {
    if (event.key === 'Escape' && zoom) { event.stopPropagation(); event.preventDefault(); setZoom(false); }
    if (event.key === 'ArrowLeft') go(Math.max(0, index - 1));
    if (event.key === 'ArrowRight') go(Math.min(images.length - 1, index + 1));
  }}>
    <button className="document-back" onClick={onBack} aria-label="返回 Document"><ArrowLeft size={26} /></button>
    <div ref={rail} className="document-gallery-rail document-overlap" onTouchStart={e=>{touch.current=e.touches[0].clientX;}} onTouchEnd={e=>{const delta=touch.current-e.changedTouches[0].clientX;if(Math.abs(delta)>40)go(index+Math.sign(delta));}}>
      {images.map((src, i) => <button key={src} className={i === index ? 'is-active' : undefined} tabIndex={i === index ? 0 : -1} aria-hidden={i !== index} onClick={() => { setIndex(i); setZoom(true); }} aria-label={`放大第 ${i + 1} 张样图`}><img src={src} alt={`${kind === 'plan' ? '平面图' : '施工图'}照片 ${i + 1}`} /></button>)}
    </div>
    <nav className="document-gallery-nav photo-viewer-footer"><span className="photo-swipe-hint">滑动切换</span><span className="photo-name">{label}</span><span aria-hidden="true" /></nav>
    {zoom && <ImageZoom src={images[index]} alt={label} onClose={() => setZoom(false)} />}
  </section>;
}
