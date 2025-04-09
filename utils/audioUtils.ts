interface TimeSegment {
  start: number;
  end: number;
}

export function parseTimeSegment(url: string): TimeSegment | null {
  const timeRegex = /#t=(\d+\.?\d*),(\d+\.?\d*)/;
  const match = url.match(timeRegex);
  
  if (!match) return null;
  
  return {
    start: parseFloat(match[1]) * 1000, // Convert to milliseconds
    end: parseFloat(match[2]) * 1000
  };
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
