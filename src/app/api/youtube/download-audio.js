import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  res.setHeader('Content-Type', 'audio/mpeg');
  ytdl(url, { quality: 'highestaudio', filter: 'audioonly' }).pipe(res);
}
