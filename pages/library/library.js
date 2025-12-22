const api = require('../../utils/api.js');
Page({
  data: { novels: [] },
  onLoad(){
    api.getNovels().then(novels => this.setData({ novels }));
  },
  goDetail(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },
  onPullDownRefresh(){
    api.getNovels().then(novels => { this.setData({novels}); wx.stopPullDownRefresh(); });
  }
});
