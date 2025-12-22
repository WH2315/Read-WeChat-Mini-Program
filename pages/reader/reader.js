const api = require('../../utils/api.js');
const store = require('../../utils/storage.js');

Page({
  data: { novel: null, chapter: null, chapterIndex: 0 },
  onLoad(options){
    const id = options.id;
    const index = parseInt(options.index || '0', 10);
    api.getNovel(id).then(novel => {
      this.setData({ novel, chapterIndex: index, chapter: novel.chapters[index] });
    });
  },
  prev(){
    if(this.data.chapterIndex > 0){
      const i = this.data.chapterIndex - 1;
      this.setData({ chapterIndex: i, chapter: this.data.novel.chapters[i] });
      store.saveProgress(this.data.novel.id, i);
    }
  },
  next(){
    if(this.data.chapterIndex < this.data.novel.chapters.length - 1){
      const i = this.data.chapterIndex + 1;
      this.setData({ chapterIndex: i, chapter: this.data.novel.chapters[i] });
      store.saveProgress(this.data.novel.id, i);
    }
  },
  onUnload(){
    if(this.data.novel){
      store.saveProgress(this.data.novel.id, this.data.chapterIndex);
    }
  }
});
