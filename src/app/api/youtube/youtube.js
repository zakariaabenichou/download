import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const info = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(
  info.formats.filter(f => f.mimeType?.includes('audio/')),
  { quality: 'highestaudio' }
);

    res.status(200).json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      audioUrl: audioFormat.url // <-- this is the direct audio stream
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
