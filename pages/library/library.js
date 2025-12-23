const api = require('../../utils/api.js');

Page({
  data: { novels: [], allNovels: [], loading: false, error: '', page: 1, pageSize: 10, hasMore: true },
  onLoad(){ this.loadNovels(true); },

  applyPage(allNovels){
    const { page, pageSize } = this.data;
    const slice = allNovels.slice(0, page * pageSize);
    const hasMore = slice.length < allNovels.length;
    this.setData({ novels: slice, allNovels, hasMore });
  },

  async loadNovels(reset = false){
    this.setData({ loading: true, error: '' });
    try {
      const allNovels = reset ? await api.getNovels() : this.data.allNovels;
      if (reset) this.setData({ page: 1 });
      this.applyPage(allNovels);
    } catch (err) {
      this.setData({ error: '加载失败' });
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },

  loadMore(){
    if (!this.data.hasMore || this.data.loading) return;
    this.setData({ page: this.data.page + 1 }, () => this.applyPage(this.data.allNovels));
  },

  goDetail(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  onPullDownRefresh(){ this.loadNovels(true); },
  onReachBottom(){ this.loadMore(); }
});
