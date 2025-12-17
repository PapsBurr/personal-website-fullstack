'use client';
import { useState, useEffect } from 'react';
import { NasaApodData, UseNasaApodResult } from '../types/nasa';

const useNasaApod = (): UseNasaApodResult => {
  const [data, setData] = useState<NasaApodData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const checkIfValidImage = async (url?: string | null): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!url) {
        resolve(false);
        return;
      }

      const img = new Image();

      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);

      setTimeout(() => {
        resolve(false);
      }, 5000);

      img.src = url;
    });
  }

  const formatData = async (rawData: NasaApodData): Promise<NasaApodData | null> => {
    if (!rawData) return null;

    const formatDate = (dateString: string): string => {
      if (!dateString) return '';

      // Extract only the date part (YYYY-MM-DD) if time is included, removes timezone shift to local time
      const dateOnly = dateString.split('T')[0];
      const [year, month, day] = dateOnly.split('-');
      return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const isHdurlValid = await checkIfValidImage(rawData.hdurl);
    const isUrlValid = await checkIfValidImage(rawData.url);

    let imageUrl: string | undefined = undefined;
    if (isHdurlValid) {
      imageUrl = rawData.hdurl;
    } else if (isUrlValid) {
      imageUrl = rawData.url;
    } else {
      imageUrl = '/WitchBroom_Meyers_1080.jpg'
    }

    return {
      title: decodeHtmlEntities(rawData.title || 'Untitled'),
      explanation: decodeHtmlEntities(rawData.explanation || 'No description available.'),
      date: formatDate(rawData.date) || '',
      url: isUrlValid ? rawData.url ?? undefined : undefined,
      hdurl: isHdurlValid ? rawData.hdurl ?? undefined : undefined
    }
  }

  useEffect(() => {
    const fetchNasaApod = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/nasa/apod`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const rawResult = await response.json();

        const formattedData = await formatData(rawResult as NasaApodData);
        setData(formattedData);

      } catch (err: any) {
        console.error('Error fetching NASA APOD:', err);
        setError(err.message);
        
      } finally {
        setLoading(false);
      }
    };

    fetchNasaApod();
  }, []);

  return { data, loading, error };
};

export default useNasaApod;