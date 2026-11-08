import FragmentStudies from './FragmentReferencePair';
import AlbumViewer from './AlbumViewer';
import DocumentGallery from './PlanViewer';
import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { contactEmail, contactPhone, otherPortfolioUrl, portfolioWorks, reasons } from './content';
import { portfolioModules } from './modules';
import type { ModuleId } from './studioTimeline';
import ResumeDetails from './ResumeDetails';
import perspectiveSpiral from './perspectiveArt/spiral.png?url';
import perspectiveSideView from './perspectiveArt/side-view.png?url';

export type ArchiveDetail =
  | { type: 'module'; id: ModuleId }
  | { type: 'work'; id: string }
  | { type: 'resume' };

type ArchiveDialogProps = {
  detail: ArchiveDetail | null;
  onClose: () => void;
  onView: (id: string) => void;
  onOpenRenderStudy: () => void;
};

export default function ArchiveDialog({ detail, onClose, onView, onOpenRenderStudy }: ArchiveDialogProps) {
  const [documentKind, setDocumentKind] = useState<'plan' | 'construction' | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const module = detail?.type === 'module' ? portfolioModules.find(item => item.id === detail.id) : undefined;
  const workIndex = detail?.type === 'work' ? portfolioWorks.findIndex(work => work.id === detail.id) : -1;
  const work = portfolioWorks[workIndex];
  const selectedReasons = module?.id === 'about' ? reasons : reasons.filter(reason => module?.reasonIds.includes(reason.id));
  const isResume = detail?.type === 'resume' || module?.id === 'about';

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (detail && !element.open) {
      element.showModal();
      element.focus({ preventScroll: true });
    }
    if (!detail && element.open) element.close();
    element.scrollTop = 0;
    setDocumentKind(null);
  }, [detail]);

  const requestClose = () => {
    // Close the native top layer before the parent restores focus and scrolling.
    if (dialog.current?.open) dialog.current.close();
    onClose();
  };

  return (
    <dialog
      ref={dialog}
      tabIndex={-1}
      data-document={module?.id === 'craft' ? 'true' : undefined}
      className={`archive-archive-dialog${isResume ? ' archive-resume-dialog' : ''}${work ? ' archive-image-dialog' : ''}`}
      onClose={event => { if (!event.currentTarget.open) onClose(); }}
      onCancel={event => { event.preventDefault(); requestClose(); }}
      onClick={event => { if (event.target === event.currentTarget) requestClose(); }}
      aria-labelledby={isResume || documentKind || work?.album ? undefined : 'archive-detail-title'}
      aria-label={work?.album ? '系列照片' : documentKind ? '图纸展示' : isResume ? '个人资料' : undefined}
    >
      {detail && <div className="archive-detail-paper">
        {documentKind ? <DocumentGallery kind={documentKind} onBack={() => setDocumentKind(null)} /> : <>
        {isResume ? <ResumeDetails /> : !work?.album && <h2 id="archive-detail-title">{work?.title || module?.label}</h2>}
        {module?.id === 'perspective' && <>
          <p className="archive-detail-intro">它意味着跳出固有的框架，用新的视角看待问题、事物甚至自己。</p>
          <div className="archive-perspective-art">
            <img src={perspectiveSpiral} alt="平面的螺旋" width={1254} height={1254} draggable={false} />
            <img src={perspectiveSideView} alt="从侧面看向上展开的螺旋" width={1254} height={1254} draggable={false} />
          </div>
        </>}
        {module?.id === 'craft' && <div className="archive-document-items">
          {[
            ['01', 'Floor Plan', '以平面划分生活的秩序'],
            ['02', 'Construction Drawing', '用图纸定义落地的边界'],
            ['03', 'Rendering', '预先看见空间最终的模样。'],
          ].map(([id, title, body]) => <article key={id} className="archive-detail-reason archive-document-item">
            <span>{id}</span><div><h3>{title}</h3><div className="archive-document-link-row"><p>{body}</p><button className="archive-document-arrow" type="button" onClick={() => id === '03' ? onOpenRenderStudy() : setDocumentKind(id === '01' ? 'plan' : 'construction')} aria-label={`打开 ${title} 展示`}><ArrowRight size={25} /></button></div></div>
          </article>)}
        </div>}
        {module && module.id !== 'craft' && !isResume && selectedReasons.map(reason => <article key={reason.id} className="archive-detail-reason">
          <span>{reason.id}</span><div><h3>{reason.title}</h3><p className={reason.author ? 'archive-poem' : undefined}>{reason.body}</p>{reason.author && <a className="archive-poem-credit" href={reason.source} target="_blank" rel="noopener noreferrer">— {reason.author} <ArrowUpRight size={12} aria-hidden="true" /></a>}</div>
        </article>)}
        {module?.id === 'fragments' && <FragmentStudies />}
        {module?.id === 'works' && <div className="archive-detail-works">
          {portfolioWorks.map(item => <article key={item.id}>
            <button className="archive-detail-work-button" type="button" onClick={() => onView(item.id)} aria-label={`View ${item.title}`}>
              <img src={item.thumbnail} alt={item.alt} loading="lazy" decoding="async" />
            </button>
            <h3>{item.title}</h3>
          </article>)}
        </div>}
        {work?.album ? <AlbumViewer key={work.id} title={work.title} images={work.album} /> : work && <>
          <figure className="archive-lightbox">
            <div className="archive-lightbox-image">
              <img src={work.image} alt={work.alt} width={work.width} height={work.height} decoding="async" />
            </div>
            <figcaption>{work.caption}</figcaption>
          </figure>
          <nav className="archive-lightbox-actions" aria-label="Browse enlarged images">
            <button type="button" disabled={workIndex === 0} onClick={() => onView(portfolioWorks[workIndex - 1].id)}><ChevronLeft size={17} />Previous</button>
            <span>{workIndex + 1} / {portfolioWorks.length}</span>
            <button type="button" disabled={workIndex === portfolioWorks.length - 1} onClick={() => onView(portfolioWorks[workIndex + 1].id)}>Next<ChevronRight size={17} /></button>
          </nav>
        </>}
        {module?.id === 'collaboration' && <div>
          <a className="archive-detail-contact" href={`mailto:${contactEmail}`}>{contactEmail}<ArrowUpRight size={18} /></a>
          <a className="archive-detail-contact" href={`tel:${contactPhone}`}>{contactPhone}<ArrowUpRight size={18} /></a>
        </div>}
        {module?.id === 'works' && <a className="archive-detail-other-works" href={otherPortfolioUrl} target="_blank" rel="noopener noreferrer">Elsewhere<ArrowUpRight size={15} /></a>}
        </>}
      </div>}
    </dialog>
  );
}
