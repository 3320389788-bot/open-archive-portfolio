import { workAlbums } from './workAlbums';
export type Reason = {
  id: string;
  title: string;
  shortTitle: string;
  body: string;
  note: string;
  tag: string;
  author?: string;
  source?: string;
};

// Edit this profile and the entries below to make the template your own.
export const templateProfile = {
  brand: 'STUDIO',
  name: '姚佳轩',
  role: '室内设计师助理',
  discipline: '室内设计 / 创意实践',
  disciplines: '室内设计 / 创意实践',
  pageTitle: 'An Open Archive',
  website: 'https://example.com',
  location: '南通',
  introduction: 'A space for ideas, observations, and work in progress.',
  biography: '室内设计师助理，熟悉项目全流程工作，注重空间尺度、落地性与使用者需求，擅长效果图表达。持续深耕室内设计，期待在居住与小型商业空间中探索兼具美感与实用性的设计。',
};

export const contactEmail = '3320389788@qq.com';
export const contactPhone = '19827050610';
export const otherPortfolioUrl = templateProfile.website;

// Set both fields to null for the original text-only computer screen.
export const introMedia: { src: string | null; poster: string | null } = {
  src: `${import.meta.env.BASE_URL}assets/template/intro-loop.mp4`,
  poster: `${import.meta.env.BASE_URL}assets/template/intro-loop-poster.jpg`,
};

export const reasons: Reason[] = [
  {
    id: '01',
    title: '取舍',
    shortTitle: 'Quiet things',
    body: '设计贵在取舍。删去多余形式，在功能、尺度与落地之间寻找平衡。',
    note: 'Leave room for a pause.',
    tag: 'Fragments',
  },
  {
    id: '02',
    title: 'Look a little closer',
    shortTitle: 'Look closely',
    body: 'To see a World in a Grain of Sand\nAnd a Heaven in a Wild Flower',
    note: 'Attention is a beginning.',
    tag: 'Observation',
    author: 'William Blake',
    source: 'https://poets.org/poem/auguries-innocence',
  },
  {
    id: '03',
    title: 'Ideas become experiences',
    shortTitle: 'From idea to experience',
    body: 'Use this space to describe the questions behind a project. What did you explore, what did you learn, and what changed along the way?',
    note: 'Keep the question open.',
    tag: 'Exploration',
  },
  {
    id: '04',
    title: 'A small kind of hope',
    shortTitle: 'Make, notice, repeat',
    body: 'Hope is the thing with feathers\nThat perches in the soul,',
    note: 'One mark at a time.',
    tag: 'Practice',
    author: 'Emily Dickinson',
    source: 'https://poets.org/poem/hope-thing-feathers-254',
  },
  {
    id: '05',
    title: 'Another way to see a shape',
    shortTitle: 'A different angle',
    body: 'A familiar form can hold an unfamiliar possibility. Add an example of how you move between techniques, formats, or ways of seeing.',
    note: 'Turn the page.',
    tag: 'Form',
  },
  {
    id: '06',
    title: '共同打造舒适完整的空间',
    shortTitle: 'Say hello',
    body: '本人自主学习能力强，可快速掌握新工艺、新软件，适配项目各类需求、高效完成重复性辅助任务，帮团队减轻工作量，理顺每一处细节，让工作准时落幕。',
    note: 'Begin with a conversation.',
    tag: 'Collaboration',
  },
  {
    id: '07',
    title: 'Collecting the in-between',
    shortTitle: 'Notes from the everyday',
    body: 'References can arrive from anywhere: a book, a conversation, an unfinished thought. Share the things that shape your point of view.',
    note: 'Keep a small notebook.',
    tag: 'References',
  },
  {
    id: '08',
    title: 'A story beyond a single image',
    shortTitle: 'Beyond the frame',
    body: 'A project can continue through a series, an object, or a new context. Describe the directions you would like your work to take.',
    note: 'There is another page.',
    tag: 'Possibilities',
  },
  {
    id: '09',
    title: 'A point of view, still growing',
    shortTitle: 'A way of seeing',
    body: 'Use this space for your personal approach to making. A clear, thoughtful sentence is enough. Leave room for your practice to change.',
    note: 'Stay curious.',
    tag: 'Perspective',
  },
];

export type PortfolioWork = {
  album?: string[];
  id: string;
  category: 'fragments' | 'illustration' | 'character-illustration' | 'red-envelope' | 'branding' | 'platform' | 'product' | 'pet-design' | '3d';
  title: string;
  caption: string;
  image: string;
  thumbnail: string;
  alt: string;
  width: number;
  height: number;
};

export const workCategories: Array<{
  id: 'all' | PortfolioWork['category'];
  label: string;
}> = [
  { id: 'all', label: 'All work' },
  { id: 'fragments', label: 'Fragments' },
  { id: 'illustration', label: 'Studies' },
  { id: 'branding', label: 'Visual systems' },
  { id: 'product', label: 'Experiments' },
];

const workAsset = (filename: string) => `${import.meta.env.BASE_URL}assets/template/${filename}`;

const originalWorks: PortfolioWork[] = [
  {
    id: 'silence',
    category: 'fragments',
    title: '静谧',
    caption: '关于静止的练习',
    image: workAsset('01-silence.svg'),
    thumbnail: workAsset('01-silence.svg'),
    alt: 'Black and white typographic study titled Silence.',
    width: 900,
    height: 1200,
  },
  {
    id: 'feathers',
    category: 'fragments',
    title: '羽翼',
    caption: '一个微小的开始',
    image: workAsset('02-feathers.svg'),
    thumbnail: workAsset('02-feathers.svg'),
    alt: 'Black and white typographic study titled Feathers.',
    width: 900,
    height: 1200,
  },
  {
    id: 'horizon',
    category: 'illustration',
    title: '地平线',
    caption: '开阔之境',
    image: workAsset('03-horizon.svg'),
    thumbnail: workAsset('03-horizon.svg'),
    alt: 'Monochrome graphic study of a horizon.',
    width: 1200,
    height: 1200,
  },
  {
    id: 'grain',
    category: 'branding',
    title: '肌理',
    caption: '节奏与重复',
    image: workAsset('04-grain.svg'),
    thumbnail: workAsset('04-grain.svg'),
    alt: 'Black and white graphic study titled Grain.',
    width: 1600,
    height: 1000,
  },
  {
    id: 'orbit',
    category: 'illustration',
    title: '轨迹',
    caption: '另一种视角',
    image: workAsset('05-orbit.svg'),
    thumbnail: workAsset('05-orbit.svg'),
    alt: 'Monochrome graphic study of orbital forms.',
    width: 1000,
    height: 1400,
  },
  {
    id: 'room',
    category: 'product',
    title: '空间',
    caption: '想象的空间',
    image: workAsset('06-room.svg'),
    thumbnail: workAsset('06-room.svg'),
    alt: 'Black and white graphic composition titled Room.',
    width: 1200,
    height: 900,
  },
  {
    id: 'margin',
    category: 'branding',
    title: '边界',
    caption: '边缘的记录',
    image: workAsset('07-margin.svg'),
    thumbnail: workAsset('07-margin.svg'),
    alt: 'Monochrome typographic composition titled Margin.',
    width: 900,
    height: 1200,
  },
  {
    id: 'beginning',
    category: 'illustration',
    title: '起点',
    caption: '下一页空白',
    image: workAsset('08-beginning.svg'),
    thumbnail: workAsset('08-beginning.svg'),
    alt: 'Black and white typographic composition titled Beginning.',
    width: 1200,
    height: 1200,
  },
];

export const portfolioWorks: PortfolioWork[] = originalWorks.slice(0, 5).map((work, index) => {
 const album = workAlbums[index];
 return album ? { ...work, title: album.title, caption: '', alt: album.title, image: album.cover, thumbnail: album.cover, width: album.width, height: album.height, album: album.images } : work;
});

export const templateResume = {
  experience: {
    title: '设计工作室｜室内设计师助理',
    period: '2025 – 至今',
    bullets: [
      '协助主案完成流程：现场量房、平面规划、彩屏图制作、PPT制作、施工图绘制、方案排版、图纸整理、素材归档、项目资料汇总。做事细致，学习能力强，高效配合团队落地项目。',
    ],
  },
  education: {
    title: '南通科技职业学院',
    period: '',
  },
  practice: '可完成量房、方案、出图等助理相关工作。自主练习空间方案，研究动线、材质与色彩搭配，坚持从实际使用角度思考设计，定期整理优秀案例复盘学习。',
  tools: ['CAD、酷家乐、SketchUp、PS'],
};
