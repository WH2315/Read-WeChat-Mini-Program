const api = require('../../utils/api.js');
Page({
  data: { item: null },
  onLoad(options){ api.getNewsItem(options.id).then(item => this.setData({ item })); }
});
