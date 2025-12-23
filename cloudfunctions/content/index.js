const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

// 通用分页查询
async function paginate(collection, where = {}, { page = 1, pageSize = 20, fields = {} } = {}) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const size = Math.max(1, parseInt(pageSize, 10) || 20);
  const start = (p - 1) * size;
  const countRes = await collection.where(where).count();
  const listRes = await collection.where(where).field(fields).skip(start).limit(size).get();
  return { list: listRes.data, total: countRes.total, page: p, pageSize: size };
}

exports.main = async (event) => {
  const { action, id, cid, q, page = 1, pageSize = 20 } = event || {};

  switch (action) {
    case 'listNovels':
      return paginate(db.collection('novels'), {}, { page, pageSize, fields: { chapters: false } });

    case 'getNovel': {
      const res = await db.collection('novels').doc(id).get();
      return res.data;
    }

    case 'getChapter': {
      // 章节独立存储：chapters 集合，字段包含 novelId、id/cid、title、content
      const res = await db.collection('chapters').where({ novelId: id, id: cid }).limit(1).get();
      if (!res.data.length) throw new Error('chapter_not_found');
      return res.data[0];
    }

    case 'listNews':
      return paginate(db.collection('news'), {}, { page, pageSize });

    case 'getNews': {
      const res = await db.collection('news').doc(id).get();
      return res.data;
    }

    case 'search': {
      const keyword = (q || '').trim();
      if (!keyword) return { novels: [], news: [] };
      const reg = db.RegExp({ regexp: keyword, options: 'i' });
      const [novelsHit, newsHit] = await Promise.all([
        db.collection('novels').where(_.or([{ title: reg }, { author: reg }, { desc: reg }])).limit(20).get(),
        db.collection('news').where(_.or([{ title: reg }, { summary: reg }])).limit(20).get()
      ]);
      return { novels: novelsHit.data, news: newsHit.data };
    }

    default:
      throw new Error('invalid_action');
  }
};
