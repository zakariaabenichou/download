import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');

  try {
    ytdl(url, { quality: 'highestaudio', filter: 'audioonly' }).pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
