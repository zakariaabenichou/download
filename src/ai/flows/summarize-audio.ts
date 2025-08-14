'use server';

/**
 * @fileOverview Summarizes the audio content of a video given its URL.
 *
 * - summarizeAudio - A function that takes a video URL and returns a summary of the audio content.
 * - SummarizeAudioInput - The input type for the summarizeAudio function.
 * - SummarizeAudioOutput - The return type for the summarizeAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAudioInputSchema = z.object({
  videoUrl: z.string().describe('The URL of the video to summarize.'),
});
export type SummarizeAudioInput = z.infer<typeof SummarizeAudioInputSchema>;

const SummarizeAudioOutputSchema = z.object({
  summary: z.string().describe('A summary of the video audio content.'),
  progress: z.string().describe('Progress of the summarization task'),
});
export type SummarizeAudioOutput = z.infer<typeof SummarizeAudioOutputSchema>;

export async function summarizeAudio(input: SummarizeAudioInput): Promise<SummarizeAudioOutput> {
  return summarizeAudioFlow(input);
}

const summarizeAudioPrompt = ai.definePrompt({
  name: 'summarizeAudioPrompt',
  input: {schema: SummarizeAudioInputSchema},
  output: {schema: SummarizeAudioOutputSchema},
  prompt: `You are an AI expert in summarizing video audio content.  Given the audio content of the following video, create a concise summary that captures the main points.

Video URL: {{{videoUrl}}}

Summary:`,
});

const summarizeAudioFlow = ai.defineFlow(
  {
    name: 'summarizeAudioFlow',
    inputSchema: SummarizeAudioInputSchema,
    outputSchema: SummarizeAudioOutputSchema,
  },
  async input => {
    // Simulate progress
    const progress = 'Generating a summary of the video audio.';

    const {output} = await summarizeAudioPrompt(input);

    // Ensure the output includes the progress
    return {
      ...output!,
      progress: progress,
    };
  }
);
