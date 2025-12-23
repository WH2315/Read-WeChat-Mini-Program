const api = require('../../utils/api.js');

Page({
  data: { items: [], allItems: [], loading: false, error: '', page: 1, pageSize: 10, hasMore: true },
  onLoad(){ this.loadNews(true); },

  applyPage(allItems){
    const { page, pageSize } = this.data;
    const slice = allItems.slice(0, page * pageSize);
    const hasMore = slice.length < allItems.length;
    this.setData({ items: slice, allItems, hasMore });
  },

  async loadNews(reset = false){
    this.setData({ loading: true, error: '' });
    try {
      const allItems = reset ? await api.getNews() : this.data.allItems;
      if (reset) this.setData({ page: 1 });
      this.applyPage(allItems);
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
    this.setData({ page: this.data.page + 1 }, () => this.applyPage(this.data.allItems));
  },

  goDetail(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/newsDetail/newsDetail?id=${id}` });
  },

  onPullDownRefresh(){ this.loadNews(true); },
  onReachBottom(){ this.loadMore(); }
});
