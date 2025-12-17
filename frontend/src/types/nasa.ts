interface NasaApodData {
  title: string;
  explanation: string;
  date: string;
  url?: string;
  hdurl?: string;
}

interface UseNasaApodResult {
  data: NasaApodData | null;
  loading: boolean;
  error: string | null;
}
export type { NasaApodData, UseNasaApodResult };