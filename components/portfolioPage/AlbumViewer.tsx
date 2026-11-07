import { useEffect, useRef, useState } from 'react';
import ImageZoom from './ImageZoom';
import { bindPhotoWheel, loopPhoto } from './photoGestures';

export default function AlbumViewer({ images, title }: { images: string[]; title: string }) {
  const [requested, setRequested] = useState(0);
  const [{ index, previous }, setPhoto] = useState<{ index: number; previous: number | null }>({ index: 0, previous: null });
  const [zoom, setZoom] = useState(false);
  const root = useRef<HTMLElement>(null);
  const pending = useRef<HTMLImageElement>(null);
  const touchStart = useRef(0);
  const pendingIndex = requested === index ? null : requested;

  useEffect(() => {
    const target = root.current?.closest('dialog');
    if (!target || zoom) return;
    return bindPhotoWheel(target, direction => setRequested(value => loopPhoto(value, direction, images.length)));
  }, [images.length, zoom]);

  useEffect(() => {
    if (pendingIndex === null || !pending.current) return;
    let cancelled = false;
    pending.current.decode().then(() => {
      if (!cancelled) setPhoto({ index: pendingIndex, previous: index });
    }).catch(() => {
      if (!cancelled) setRequested(index);
    });
    return () => { cancelled = true; };
  }, [index, pendingIndex]);

  useEffect(() => {
    if (previous === null) return;
    const timer = window.setTimeout(() => setPhoto({ index, previous: null }), 240);
    return () => window.clearTimeout(timer);
  }, [index, previous]);

  useEffect(() => {
    for (const direction of [-1, 1]) {
      const photo = new Image();
      photo.src = images[loopPhoto(index, direction, images.length)];
    }
  }, [images, index]);

  const layers = [...new Set([previous, index, pendingIndex])].filter(value => value !== null);
  return <section ref={root} className="album-viewer"
    onTouchStart={event => { touchStart.current = event.touches[0].clientX; }}
    onTouchEnd={event => {
      if (zoom) return;
      const delta = touchStart.current - event.changedTouches[0].clientX;
      if (Math.abs(delta) > 40) setRequested(value => loopPhoto(value, Math.sign(delta), images.length));
    }}
    onKeyDown={event => {
      if (zoom && event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setZoom(false);
      }
      if (zoom) return;
      const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (direction) {
        event.preventDefault();
        setRequested(value => loopPhoto(value, direction, images.length));
      }
    }}>
    <button className="album-image" onClick={() => setZoom(true)} aria-label="放大作品照片">
      {layers.map(layer => <span key={layer} className="album-photo-layer" data-layer={layer === index ? 'current' : layer === previous ? 'previous' : 'pending'} data-fade={layer === index && previous !== null}>
        <img ref={layer === pendingIndex ? pending : undefined} src={images[layer]} alt={layer === index ? `${title} ${index + 1}` : ''} draggable={false} />
      </span>)}
    </button>
    <nav className="photo-viewer-footer"><span className="photo-swipe-hint">滑动切换</span><span>{index + 1} / {images.length}</span><span aria-hidden="true" /></nav>
    {zoom && <ImageZoom src={images[index]} alt={title} onClose={() => setZoom(false)} />}
  </section>;
}
