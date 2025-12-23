const api = require('../../utils/api.js');

Page({
  data: { keyword: '', results: { novels: [], news: [] }, loading: false, error: '' },
  onInput(e){ this.setData({ keyword: e.detail.value }); },
  async doSearch(){
    this.setData({ loading: true, error: '' });
    try {
      const results = await api.searchAll(this.data.keyword);
      this.setData({ results });
    } catch (err) {
      this.setData({ error: '搜索失败' });
      wx.showToast({ title: '搜索失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
  goNovel(e){ wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` }); },
  goNews(e){ wx.navigateTo({ url: `/pages/newsDetail/newsDetail?id=${e.currentTarget.dataset.id}` }); }
});
