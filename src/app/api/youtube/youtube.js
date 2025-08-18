export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const info = await ytdl.getInfo(url);
    res.status(200).json({
      titlee: info.videoDetails.title,
      thumbnaile: info.videoDetails.thumbnails[0].url,
      /*audioUrl: `/api/download-audio?url=https://www.youtube.com/watch?v=RnNFDbKXYrU&list=RDqjPQAE3w2_g&index=9&ab_channel=NomadStrings}`*/
      audioUrle:info.videoDetails.title,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
