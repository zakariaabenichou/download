import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const info = await ytdl.getInfo(url);
    console.log("here the yt js");
    console.log(info);
    console.log(url);

    res.status(200).json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      audioUrl: `/api/download-audio?url=${encodeURIComponent(url)}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
