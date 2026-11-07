import { useEffect, useRef, useState } from 'react';
import musicUrl from './background-music.m4a?url';
import { Check, X, Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic() {
  const [intro, setIntro] = useState<'idle' | 'waiting' | 'zoom' | 'question' | 'returning' | 'done'>('idle');
  const prompt = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.archive-page');
    if (page) page.dataset.musicIntro = intro;
    return () => { if (page) delete page.dataset.musicIntro; };
  }, [intro]);
  useEffect(() => {
    if (intro !== 'idle') return;
    const begin = (event: Event) => {
      if (event instanceof WheelEvent && event.ctrlKey) return;
      event.preventDefault(); event.stopPropagation();
      document.querySelector('.archive-scroll-track')?.scrollTo({ top: 0, behavior: 'instant' });
      setIntro('waiting');
    };
    const options = { capture: true, passive: false };
    window.addEventListener('pointermove', begin, options);
    window.addEventListener('wheel', begin, options);
    window.addEventListener('pointerdown', begin, options);
    window.addEventListener('keydown', begin, options);
    return () => {
      window.removeEventListener('pointermove', begin, true); window.removeEventListener('wheel', begin, true);
      window.removeEventListener('pointerdown', begin, true); window.removeEventListener('keydown', begin, true);
    };
  }, [intro]);
  useEffect(() => {
    if (intro === 'idle' || intro === 'done') return;
    const block = (event: WheelEvent) => { if (!event.ctrlKey) { event.preventDefault(); event.stopPropagation(); } };
    window.addEventListener('wheel', block, { capture: true, passive: false });
    const timer = intro === 'waiting' ? window.setTimeout(() => setIntro('zoom'), 800) : intro === 'zoom' ? window.setTimeout(() => setIntro('question'), 800)
      : intro === 'returning' ? window.setTimeout(() => { setIntro('done'); document.querySelector<HTMLElement>('.archive-scroll-track')?.focus({ preventScroll: true }); }, 850) : 0;
    if (intro === 'question') prompt.current?.querySelectorAll<HTMLButtonElement>('button')[1]?.focus();
    return () => { window.clearTimeout(timer); window.removeEventListener('wheel', block, true); };
  }, [intro]);
  const audio = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.5);
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function toggle() {
    const player = audio.current;
    if (!player || pending) return;
    if (!player.paused) {
      player.pause();
      return;
    }
    setPending(true);
    setError(false);
    player.volume = volume;
    try {
      await player.play();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  const choose = (enabled: boolean) => {
    if (enabled) void toggle();
    else audio.current?.pause();
    document.querySelector('.archive-scroll-track')?.scrollTo({ top: 0, behavior: 'instant' });
    setIntro('returning');
  };
  const label = `${playing ? '关闭' : '开启'}背景音乐`;
  return (
    <>
    <div className="archive-music">
      <audio ref={audio} src={musicUrl} loop preload="none"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onError={() => { setPlaying(false); setError(true); }} />
      <button type="button" className="archive-music-toggle" onClick={toggle}
        aria-label={label} aria-pressed={playing} aria-busy={pending} disabled={pending}
        title={error ? '音频加载失败，点击重试' : label}>
        {playing ? <Volume2 size={19} strokeWidth={1.5} /> : <VolumeX size={19} strokeWidth={1.5} />}
      </button>
      <div className="archive-volume-panel">
        <label htmlFor="archive-volume">音量 <output>{Math.round(volume * 100)}%</output></label>
        <input id="archive-volume" aria-label="背景音乐音量" type="range" min="0" max="1" step="0.01" value={volume}
          onChange={event => { const value = Number(event.target.value); setVolume(value); if (audio.current) audio.current.volume = value; }} />
      </div>
      <span className="archive-music-status" role="status">{error ? '音频加载失败，请点击重试' : ''}</span>
    </div>
    {intro === 'question' && <div ref={prompt} className="music-invitation" role="dialog" aria-modal="true" aria-label="背景音乐选择" onKeyDown={event => { if (event.key === 'Escape') choose(false); if (event.key === 'Tab') { event.preventDefault(); const buttons = prompt.current?.querySelectorAll('button'); const next = document.activeElement === buttons?.[0] ? 1 : 0; buttons?.[next].focus(); } }}>
      <p>搭配音乐食用更美味</p>
      <div><button type="button" onClick={() => choose(false)} aria-label="不播放音乐"><X size={20} /></button><button type="button" onClick={() => choose(true)} aria-label="播放音乐"><Check size={20} /></button></div>
    </div>}
    </>
  );
}
