const api = require('../../utils/api.js');
Page({
  data: { keyword: '', results: { novels: [], news: [] } },
  onInput(e){ this.setData({ keyword: e.detail.value }); },
  doSearch(){
    api.searchAll(this.data.keyword).then(results => this.setData({ results }));
  },
  goNovel(e){ wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` }); },
  goNews(e){ wx.navigateTo({ url: `/pages/newsDetail/newsDetail?id=${e.currentTarget.dataset.id}` }); }
});
