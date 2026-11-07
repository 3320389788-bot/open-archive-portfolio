import React from 'react';
import { ArrowUpRight, Circle, Box, Pencil } from 'lucide-react';
import { contactEmail, contactPhone, templateProfile } from './content';
import ResumeSlip from './ResumeSlip';
import type { ModuleId } from './studioTimeline';

type ArchiveDeskProps = {
  onSelect: (id: ModuleId) => void;
};

function CardArrow() {
  return (
    <span className="archive-desk-card-arrow" aria-hidden="true">
      <ArrowUpRight size={28} />
    </span>
  );
}

export default function ArchiveDesk({ onSelect }: ArchiveDeskProps) {
  return (
    <div className="archive-desk">
      <div className="archive-desk-module archive-desk-about" data-module="about">
        <button className="archive-desk-about-main" type="button" onClick={() => onSelect('about')} aria-label="Read about this archive">
          <span className="archive-desk-about-sheet">
            <span className="archive-desk-eyebrow">01 / {templateProfile.brand}</span>
            <strong className="archive-desk-about-title">A little<br /><span className="archive-desk-title-accent">about me.</span></strong>
            <span className="archive-desk-about-description">想法、图像与日常点滴。</span>
            <span className="archive-desk-about-copy">一份尚未完成的收集。<br />也是重新开始的地方。</span>
          </span>
          <CardArrow />
        </button>
      </div>
      <ResumeSlip />

      <button type="button" className="archive-desk-module archive-desk-fragments" data-module="fragments" onClick={() => onSelect('fragments')} aria-label="Open collected fragments">
        <span className="archive-desk-eyebrow">02</span>
        <strong className="archive-desk-stat">少即是多。</strong>
        <span className="archive-desk-stat-label">但经过深思熟虑。</span>
        <span className="archive-desk-fragment-facts">收集细微的观察与发现。</span>
        <CardArrow />
      </button>

      <button type="button" className="archive-desk-module archive-desk-craft" data-module="craft" onClick={() => onSelect('craft')} aria-label="Explore the creative practice">
        <span className="archive-desk-eyebrow">03</span>
        <strong className="archive-desk-module-title">Following<br />the details.</strong>
        <span className="archive-desk-craft-marks" aria-hidden="true">
          <Pencil size={34} /><Circle size={34} /><Box size={34} />
        </span>
        <span className="archive-desk-craft-copy">观察 / 描绘 / 创作</span>
        <span className="archive-desk-platforms">个人空间案例设计</span>
        <CardArrow />
      </button>

      <button type="button" className="archive-desk-module archive-desk-perspective" data-module="perspective" onClick={() => onSelect('perspective')} aria-label="Read notes on perspective">
        <span className="archive-desk-eyebrow">04</span>
        <strong className="archive-desk-module-title">换个角度<br />重新观看。</strong>
        <span className="archive-desk-user-tag">始终保持好奇</span>
        <span className="archive-desk-user-fact">为另一种视角留出空间。</span>
        <CardArrow />
      </button>

      <button type="button" className="archive-desk-module archive-desk-collaboration" data-module="collaboration" onClick={() => onSelect('collaboration')} aria-label="Contact and collaboration">
        <span className="archive-desk-eyebrow">06</span>
        <strong className="archive-desk-module-title">有想法<br />想聊聊吗？</strong>
        <span className="archive-desk-email"><span>{contactEmail}</span><span>{contactPhone}</span></span>
        <CardArrow />
      </button>
    </div>
  );
}
