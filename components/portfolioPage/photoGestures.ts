export function loopPhoto(index: number, direction: number, count: number) {
  if (count <= 0) return 0;
  return ((index + direction) % count + count) % count;
}
export function stepPhoto(index: number, direction: number, count: number) {
  return Math.max(0, Math.min(count - 1, index + direction));
}
export function bindPhotoWheel(target: EventTarget, onStep: (direction: number) => void, now = () => performance.now()) {
  let total = 0, lastEvent = -1000, lastStep = -1000;
  const wheel = (raw: Event) => {
    const event = raw as WheelEvent;
    if (event.ctrlKey) return;
    event.preventDefault(); event.stopPropagation();
    const time = now();
    if (time - lastEvent > 160) total = 0;
    lastEvent = time;
    if (time - lastStep < 380) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    total += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 600 : 1);
    if (Math.abs(total) < 30) return;
    onStep(Math.sign(total)); total = 0; lastStep = time;
  };
  target.addEventListener('wheel', wheel, { passive: false });
  return () => target.removeEventListener('wheel', wheel);
}
