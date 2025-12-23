const novels = require('../mock/novels.js');
const news = require('../mock/news.js');

// 将 BASE_URL 设置为你的后端域名；留空时使用本地 mock 数据
const BASE_URL = '';
const USE_MOCK = !BASE_URL;
const USE_CLOUD = false; // 若使用云函数，置为 true 并在下方配置

// 轻量 delay，用于 mock
const delay = (data, ms = 120) => new Promise(resolve => setTimeout(() => resolve(data), ms));

// 通用请求封装，保持 Promise 形态，便于页面复用
function request(url, { method = 'GET', data = {} } = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      success: res => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error(`http_${res.statusCode}`));
        }
      },
      fail: reject
    });
  });
}

// 帮助函数：兼容 list 包装或直接数组
const pickList = res => (Array.isArray(res) ? res : (res && Array.isArray(res.list) ? res.list : []));

function getNovels(params = {}) {
  if (USE_CLOUD) return callCloud('listNovels', params).then(res => pickList(res));
  if (USE_MOCK) return delay(novels);
  return request('/api/novels', { method: 'GET', data: params }).then(pickList);
}

function getNovel(id) {
  if (USE_CLOUD) return callCloud('getNovel', { id });
  if (USE_MOCK) {
    const novel = novels.find(n => n.id === id);
    if (!novel) return Promise.reject(new Error('novel_not_found'));
    return delay(novel);
  }
  return request(`/api/novels/${id}`, { method: 'GET' });
}

function getNews(params = {}) {
  if (USE_CLOUD) return callCloud('listNews', params).then(res => pickList(res));
  if (USE_MOCK) return delay(news);
  return request('/api/news', { method: 'GET', data: params }).then(pickList);
}

function getNewsItem(id) {
  if (USE_CLOUD) return callCloud('getNews', { id });
  if (USE_MOCK) {
    const item = news.find(i => i.id === id);
    if (!item) return Promise.reject(new Error('news_not_found'));
    return delay(item);
  }
  return request(`/api/news/${id}`, { method: 'GET' });
}

function searchAll(keyword) {
  if (USE_CLOUD) return callCloud('search', { q: keyword });
  if (USE_MOCK) {
    const k = (keyword || '').trim().toLowerCase();
    if (!k) return delay({ novels: [], news: [] });
    return delay({
      novels: novels.filter(n =>
        n.title.toLowerCase().includes(k) ||
        n.author.toLowerCase().includes(k) ||
        n.desc.toLowerCase().includes(k)
      ),
      news: news.filter(i =>
        i.title.toLowerCase().includes(k) ||
        (i.summary || '').toLowerCase().includes(k)
      )
    });
  }
  return request('/api/search', { method: 'GET', data: { q: keyword } });
}

// 云函数调用封装（需在 app.js 初始化 wx.cloud）
function callCloud(action, data = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'content',
      data: { action, ...data },
      success: res => resolve(res.result),
      fail: reject
    });
  });
}

module.exports = { getNovels, getNovel, getNews, getNewsItem, searchAll };
