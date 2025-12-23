const express = require('express');
const cors = require('cors');
const novels = require('../mock/novels.js');
const news = require('../mock/news.js');

const app = express();
app.use(cors());
app.use(express.json());

function paginate(list, page = 1, pageSize = 20) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const size = Math.max(1, parseInt(pageSize, 10) || 20);
  const start = (p - 1) * size;
  const end = start + size;
  return { list: list.slice(start, end), total: list.length, page: p, pageSize: size };
}

app.get('/api/novels', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  res.json(paginate(novels, page, pageSize));
});

app.get('/api/novels/:id', (req, res) => {
  const novel = novels.find(n => n.id === req.params.id);
  if (!novel) return res.status(404).json({ error: 'novel_not_found' });
  res.json(novel);
});

app.get('/api/novels/:id/chapters/:cid', (req, res) => {
  const novel = novels.find(n => n.id === req.params.id);
  if (!novel) return res.status(404).json({ error: 'novel_not_found' });
  const chapter = novel.chapters.find(c => c.id === req.params.cid);
  if (!chapter) return res.status(404).json({ error: 'chapter_not_found' });
  res.json(chapter);
});

app.get('/api/news', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  res.json(paginate(news, page, pageSize));
});

app.get('/api/news/:id', (req, res) => {
  const item = news.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'news_not_found' });
  res.json(item);
});

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q) return res.json({ novels: [], news: [] });
  const novelsHit = novels.filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.author.toLowerCase().includes(q) ||
    n.desc.toLowerCase().includes(q)
  );
  const newsHit = news.filter(i =>
    i.title.toLowerCase().includes(q) ||
    (i.summary || '').toLowerCase().includes(q)
  );
  res.json({ novels: novelsHit, news: newsHit });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
