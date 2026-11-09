import { useEffect, useState } from 'react';
import PortfolioTemplate from './StudioPage';
import { introMedia, portfolioWorks, templateProfile } from './content';
import { renderSlides } from './interiorSlides';

const ENTRY_WAIT_MS = 8000;
const entryImages = [...new Set([
  ...(introMedia.poster ? [introMedia.poster] : []),
  ...portfolioWorks.map(work => work.thumbnail),
])];

const albums = portfolioWorks.map(work => work.album ?? []);
const albumDepth = Math.max(0, ...albums.map(album => album.length));
const laterAlbumImages = Array.from({ length: Math.max(0, albumDepth - 1) },
  (_, index) => albums.flatMap(album => album.slice(index + 1, index + 2)),
).flat();
const backgroundImages = [...new Set([
  ...albums.flatMap(album => album.slice(0, 1)),
  ...renderSlides.slice(0, 3).map(slide => slide.image),
  ...laterAlbumImages,
  ...renderSlides.slice(3).map(slide => slide.image),
])];

function warmImage(src: string, priority: 'high' | 'low'): Promise<void> {
  return new Promise(resolve => {
    const image = new Image();
    image.fetchPriority = priority;
    const finish = () => {
      window.clearTimeout(timeout);
      image.onload = image.onerror = null;
      resolve();
    };
    const timeout = window.setTimeout(finish, priority === 'high' ? ENTRY_WAIT_MS : 15000);
    image.onload = priority === 'high' && typeof image.decode === 'function'
      ? () => { void image.decode().then(finish, finish); }
      : finish;
    image.onerror = finish;
    image.src = src;
  });
}

export default function PortfolioEntrance() {
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    let active = true;
    const deadline = window.setTimeout(() => setReady(true), ENTRY_WAIT_MS);
    void Promise.all(entryImages.map(async src => {
      await warmImage(src, 'high');
      if (active) setLoaded(count => count + 1);
    })).then(() => {
      window.clearTimeout(deadline);
      if (active) setReady(true);
    });
    return () => {
      active = false;
      window.clearTimeout(deadline);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let active = true;
    let next = 0;
    const warmQueue = async () => {
      while (active && next < backgroundImages.length) {
        await warmImage(backgroundImages[next++], 'low');
      }
    };
    const start = window.setTimeout(() => { void warmQueue(); void warmQueue(); }, 300);
    return () => {
      active = false;
      window.clearTimeout(start);
    };
  }, [ready]);

  if (ready) return <PortfolioTemplate />;

  const percent = Math.round(100 * loaded / entryImages.length);
  return (
    <div className="archive-entrance-loading" lang="zh-CN">
      <div className="archive-entrance-panel">
        <p className="archive-entrance-brand">{templateProfile.brand} <span>/ ARCHIVE</span></p>
        <div className="archive-entrance-label">
          <span id="archive-loading-label">正在加载作品图片</span>
          <span aria-hidden="true">{percent}%</span>
        </div>
        <div className="archive-entrance-meter" role="progressbar" aria-labelledby="archive-loading-label"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
          <div style={{ transform: `scaleX(${percent / 100})` }} />
        </div>
      </div>
    </div>
  );
}
