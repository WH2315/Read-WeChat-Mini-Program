const api = require('../../utils/api.js');
const store = require('../../utils/storage.js');

Page({
  data: { novels: [] },
  onShow(){
    const ids = store.getBookshelf();
    api.getNovels().then(all => {
      const novels = all.filter(n => ids.includes(n.id));
      this.setData({ novels });
    });
  },
  remove(e){
    const id = e.currentTarget.dataset.id;
    const novels = this.data.novels.filter(n => n.id !== id);
    store.removeFromBookshelf(id);
    this.setData({ novels });
  },
  open(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  }
});
