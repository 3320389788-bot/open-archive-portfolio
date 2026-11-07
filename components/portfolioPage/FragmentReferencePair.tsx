import { useState } from 'react';
import ImageZoom from './ImageZoom';
import massing from './references/massing-study.jpg?url';
import composition from './references/spatial-composition.jpg?url';

const studies = [
 { image: massing, title: '体块推敲', alt: '黑白手绘体块草图，线条交叠推敲空间与动线' },
 { image: composition, title: '抽象空间构图', alt: '留白中的黑色几何体块与透视网格' },
];
export default function FragmentStudies() {
 const [zoom,setZoom]=useState<number|null>(null);
 return <div className="archive-detail-fragment-images">
  {studies.map((study,i)=><figure key={study.image} className="fragment-study">
   <button className="archive-detail-fragment-image" onClick={()=>setZoom(i)} aria-label={`放大参考线稿：${study.title}`}><img src={study.image} alt={study.alt} loading="lazy"/></button>
  </figure>)}
  {zoom!==null&&<ImageZoom monochrome src={studies[zoom].image} alt={studies[zoom].alt} onClose={()=>setZoom(null)}/>}
 </div>;
}
