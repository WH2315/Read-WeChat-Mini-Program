const api = require('../../utils/api.js');
Page({
  data: { items: [] },
  onLoad(){ api.getNews().then(items => this.setData({ items })); },
  goDetail(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/newsDetail/newsDetail?id=${id}` });
  },
  onPullDownRefresh(){
    api.getNews().then(items => { this.setData({ items }); wx.stopPullDownRefresh(); });
  }
});
