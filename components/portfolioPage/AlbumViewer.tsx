import { useEffect, useRef, useState } from 'react';
import ImageZoom from './ImageZoom';
import { bindPhotoWheel, loopPhoto } from './photoGestures';
export default function AlbumViewer({ images, title }: { images: string[]; title: string }) {
 const [index,setIndex]=useState(0);const [zoom,setZoom]=useState(false);
 const root=useRef<HTMLElement>(null);const start=useRef(0);
 useEffect(()=>{
  const target=root.current?.closest('dialog');
  if(!target || zoom)return;
  return bindPhotoWheel(target, direction=>setIndex(value=>loopPhoto(value,direction,images.length)));
 },[images.length,zoom]);
 return <section ref={root} className="album-viewer" onTouchStart={e=>{start.current=e.touches[0].clientX;}} onTouchEnd={e=>{if(zoom)return;const delta=start.current-e.changedTouches[0].clientX;if(Math.abs(delta)>40)setIndex(v=>loopPhoto(v,Math.sign(delta),images.length));}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();setIndex(v=>loopPhoto(v,1,images.length));}if(e.key==='ArrowLeft'){e.preventDefault();setIndex(v=>loopPhoto(v,-1,images.length));}if(e.key==='Escape'&&zoom){e.preventDefault();e.stopPropagation();setZoom(false);}}}>
  <button className="album-image" onClick={()=>setZoom(true)} aria-label="放大作品照片"><img key={images[index]} src={images[index]} alt={`${title} ${index+1}`} draggable={false} /></button>
  <nav className="photo-viewer-footer"><span className="photo-swipe-hint">滑动切换</span><span>{index+1} / {images.length}</span><span aria-hidden="true" /></nav>
  {zoom&&<ImageZoom src={images[index]} alt={title} onClose={()=>setZoom(false)}/>}
 </section>;
}
