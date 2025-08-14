async function downloadAudioFromUrl(audioUrl: string, fileName = "audio.mp3") {
  // 1. Fetch the audio stream
  const response = await fetch(audioUrl);
  if (!response.ok) throw new Error("Failed to fetch audio stream");

  // 2. Convert to ArrayBuffer
  const arrayBuffer = await response.arrayBuffer();

  // 3. Create a Blob of type audio/mp3
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });

  // 4. Create a temporary download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();

  // 5. Revoke the object URL
  URL.revokeObjectURL(url);
}
