const api = require('../../utils/api.js');
const store = require('../../utils/storage.js');

Page({
  data: { novel: null },
  onLoad(options){
    const id = options.id;
    api.getNovel(id).then(novel => this.setData({ novel }));
  },
  startRead(){
    const id = this.data.novel.id;
    const prog = store.getProgress(id);
    wx.navigateTo({ url: `/pages/reader/reader?id=${id}&index=${prog.chapterIndex}` });
  },
  addShelf(){
    store.addToBookshelf(this.data.novel.id);
    wx.showToast({ title: '已加入书架', icon: 'success' });
  },
  readChapter(e){
    const index = e.currentTarget.dataset.index;
    const id = this.data.novel.id;
    wx.navigateTo({ url: `/pages/reader/reader?id=${id}&index=${index}` });
  }
});
