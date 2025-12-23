const api = require('../../utils/api.js');
const store = require('../../utils/storage.js');

Page({
  data: { novel: null, chapter: null, chapterIndex: 0, paragraphs: [], theme: 'light', fontSize: 30, lineHeight: 1.7 },

  splitParagraphs(content = ''){
    return content
      .split(/\n+|。/)
      .map(t => t.trim())
      .filter(Boolean)
      .map(t => (t.endsWith('。') ? t : `${t}。`));
  },

  loadSettings(){
    const s = store.getSettings();
    this.setData({ theme: s.theme, fontSize: s.fontSize, lineHeight: s.lineHeight });
  },

  onLoad(options){
    this.loadSettings();
    const id = options.id;
    const index = parseInt(options.index || '0', 10);
    api.getNovel(id).then(novel => {
      const chapter = novel.chapters[index];
      this.setData({
        novel,
        chapterIndex: index,
        chapter,
        paragraphs: this.splitParagraphs(chapter.content)
      });
    });
  },

  prev(){
    if(this.data.chapterIndex > 0){
      const i = this.data.chapterIndex - 1;
      const chapter = this.data.novel.chapters[i];
      this.setData({ chapterIndex: i, chapter, paragraphs: this.splitParagraphs(chapter.content) });
      store.saveProgress(this.data.novel.id, i);
    }
  },

  next(){
    if(this.data.chapterIndex < this.data.novel.chapters.length - 1){
      const i = this.data.chapterIndex + 1;
      const chapter = this.data.novel.chapters[i];
      this.setData({ chapterIndex: i, chapter, paragraphs: this.splitParagraphs(chapter.content) });
      store.saveProgress(this.data.novel.id, i);
    }
  },

  toggleTheme(){
    const next = this.data.theme === 'dark' ? 'light' : 'dark';
    store.saveSettings({ theme: next, fontSize: this.data.fontSize, lineHeight: this.data.lineHeight });
    this.setData({ theme: next });
  },

  incFont(){
    const next = Math.min(this.data.fontSize + 2, 40);
    this.setFont(next, this.data.lineHeight);
  },

  decFont(){
    const next = Math.max(this.data.fontSize - 2, 22);
    this.setFont(next, this.data.lineHeight);
  },

  setFont(fontSize, lineHeight){
    store.saveSettings({ theme: this.data.theme, fontSize, lineHeight });
    this.setData({ fontSize, lineHeight });
  },

  onUnload(){
    if(this.data.novel){
      store.saveProgress(this.data.novel.id, this.data.chapterIndex);
    }
  }
});
