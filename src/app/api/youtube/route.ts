import {NextRequest, NextResponse} from 'next/server';
import {google} from 'googleapis';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({error: 'Video URL is required.'}, {status: 400});
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return NextResponse.json({error: 'Invalid YouTube URL.'}, {status: 400});
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {error: 'YouTube API key is not configured.'},
      {status: 500}
    );
  }

  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
    });

    const response = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId],
    });

    const video = response.data.items?.[0];

    if (!video || !video.snippet) {
      return NextResponse.json({error: 'Video not found.'}, {status: 404});
    }

    return NextResponse.json({
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails?.high?.url || '',
    });
  } catch (error) {
    console.error('Error fetching video from YouTube:', error);
    return NextResponse.json(
      {error: 'Failed to fetch video details from YouTube.'},
      {status: 500}
    );
  }
}

function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    if (
      urlObj.hostname === 'www.youtube.com' ||
      urlObj.hostname === 'youtube.com'
    ) {
      return urlObj.searchParams.get('v');
    }
  } catch (e) {
    // a non-url string was passed in
  }
  return null;
}
