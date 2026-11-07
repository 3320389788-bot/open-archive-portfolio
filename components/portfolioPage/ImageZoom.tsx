import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
export default function ImageZoom({ src, alt, onClose, monochrome = false }: { src: string; alt: string; onClose: () => void; monochrome?: boolean }) {
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const el=ref.current;el?.showModal();return()=>{el?.close();};},[]);
 return createPortal(<dialog ref={ref} className="drawing-fullscreen" aria-label="图片放大查看" onCancel={e=>{e.preventDefault();e.stopPropagation();onClose();}} onClick={e=>{e.stopPropagation();if(e.target===e.currentTarget)onClose();}}>
 <button autoFocus className="drawing-fullscreen-close" aria-label="关闭放大" onClick={onClose}><X /></button><img src={src} alt={alt} style={monochrome ? {filter: 'grayscale(1)'} : undefined}/>
 </dialog>,document.body);
}
