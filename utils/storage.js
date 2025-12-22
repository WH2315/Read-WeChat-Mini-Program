const BS_KEY = 'bookshelf';
const RP_KEY = 'reading_progress';

function getBookshelf() { return wx.getStorageSync(BS_KEY) || []; }
function addToBookshelf(id) {
  const s = getBookshelf();
  if (!s.includes(id)) { s.push(id); wx.setStorageSync(BS_KEY, s); }
  return s;
}
function removeFromBookshelf(id) {
  const s = getBookshelf().filter(x => x !== id);
  wx.setStorageSync(BS_KEY, s);
  return s;
}
function saveProgress(novelId, chapterIndex) {
  const p = wx.getStorageSync(RP_KEY) || {};
  p[novelId] = { chapterIndex };
  wx.setStorageSync(RP_KEY, p);
  return p[novelId];
}
function getProgress(novelId) {
  const p = wx.getStorageSync(RP_KEY) || {};
  return p[novelId] || { chapterIndex: 0 };
}

module.exports = { getBookshelf, addToBookshelf, removeFromBookshelf, saveProgress, getProgress };
