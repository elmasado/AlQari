export interface TimeSegment {
  start: number;
  end: number;
  baseUrl: string;
}

export function parseTimeSegment(url: string): TimeSegment | null {
  // Séparation de l'URL de base et du segment temporel
  const [baseUrl, timeSegment] = url.split('#t=');
  if (!timeSegment) return null;

  try {
    const [startStr, endStr] = timeSegment.split(',');
    const start = parseFloat(startStr) * 1000; // Conversion en millisecondes
    const end = parseFloat(endStr) * 1000;

    if (isNaN(start) || isNaN(end)) return null;

    return {
      start,
      end,
      baseUrl
    };
  } catch (error) {
    console.error('Error parsing time segment:', error);
    return null;
  }
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function isHLSStream(url: string): boolean {
  return url.endsWith('.m3u8');
}

export function getAudioSource(url: string) {
  if (isHLSStream(url)) {
    return { uri: url };
  }
  
  const timeSegment = parseTimeSegment(url);
  if (!timeSegment) return null;
  
  return {
    uri: timeSegment.baseUrl,
    positionMillis: timeSegment.start,
    shouldPlay: true
  };
}
