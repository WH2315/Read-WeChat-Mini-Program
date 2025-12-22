const novels = require('../mock/novels.js');
const news = require('../mock/news.js');

function getNovels() {
  return Promise.resolve(novels);
}
function getNovel(id) {
  return Promise.resolve(novels.find(n => n.id === id));
}
function getNews() {
  return Promise.resolve(news);
}
function getNewsItem(id) {
  return Promise.resolve(news.find(i => i.id === id));
}
function searchAll(keyword) {
  const k = (keyword || '').trim().toLowerCase();
  if (!k) return Promise.resolve({ novels: [], news: [] });
  return Promise.resolve({
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

module.exports = { getNovels, getNovel, getNews, getNewsItem, searchAll };
