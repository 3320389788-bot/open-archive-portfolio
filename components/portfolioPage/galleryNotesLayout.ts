import { GALLERY_SOURCE_PAPER } from './galleryPortal';
import type { GalleryComposition } from './galleryComposition';
import type { LayoutRect, ViewportSize } from './studioLayout';

export type GalleryNotesLevel = 'hidden' | 'minimal' | 'compact' | 'full';

export interface GalleryNotesOptions {
  readonly composition: GalleryComposition;
  readonly focusScale: number;
}

export interface GalleryNotesLayout {
  readonly left: LayoutRect;
  /** Empty compatibility rectangle; the composition has one prose column. */
  readonly right: LayoutRect;
  readonly level: GalleryNotesLevel;
  readonly opacity: number;
  readonly fontUnit: number;
  readonly headingSize: number;
}

const dimension = (value: number): number => Number.isFinite(value) ? Math.max(0, value) : 0;

/** Typography uses the focused paper size while the same composition animates. */
export function getGalleryNotesLayout(
  viewport: ViewportSize,
  _expansion: number,
  options: GalleryNotesOptions,
): GalleryNotesLayout {
  const { composition } = options;
  const left = composition.textRect;
  const focusScale = dimension(options.focusScale);
  const screenWidth = dimension(left.width * focusScale);
  const screenHeight = dimension(left.height * focusScale);
  const measurable = dimension(viewport.width) > 0 && dimension(viewport.height) > 0;
  const level: GalleryNotesLevel = !measurable || screenWidth < 36 || screenHeight < 44
    ? 'hidden'
    : screenWidth < 76 || screenHeight < 130
      ? 'minimal'
      : screenWidth >= 112 && screenHeight >= 270
        ? 'full'
        : 'compact';
  const inverseFocus = focusScale > 0 ? 1 / focusScale : 1;
  const fontUnit = Number.isFinite(inverseFocus) ? inverseFocus : 1;
  const headingSize = level === 'full' ? Math.min(34, screenWidth / 4.2)
    : level === 'compact' ? Math.min(24, screenWidth / 4.2)
      : level === 'minimal' ? Math.min(20, screenWidth / 2.5)
        : 0;

  return {
    left,
    right: { left: GALLERY_SOURCE_PAPER.width, right: GALLERY_SOURCE_PAPER.width, top: left.top, bottom: left.bottom, width: 0, height: left.height },
    level,
    opacity: level === 'hidden' ? 0 : Math.min(1, dimension(composition.textOpacity)),
    fontUnit,
    headingSize,
  };
}

/** Lay text out at its displayed size so the browser never enlarges a text bitmap. */
export function projectGalleryNotes(layout: GalleryNotesLayout, scale: number): GalleryNotesLayout {
  const factor = Number.isFinite(scale) ? Math.max(0, scale) : 0;
  const project = (rect: LayoutRect): LayoutRect => {
    const left = Math.round(rect.left * factor), top = Math.round(rect.top * factor);
    const right = Math.round(rect.right * factor), bottom = Math.round(rect.bottom * factor);
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  };
  return { ...layout, left: project(layout.left), right: project(layout.right), fontUnit: layout.fontUnit * factor };
}
