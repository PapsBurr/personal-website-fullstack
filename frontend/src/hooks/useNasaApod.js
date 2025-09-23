'use client';
import { useState, useEffect } from 'react';

const useNasaApod = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const checkIfValidImage = async (url) => {
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

  const formatData = async (rawData) => {
    if (!rawData) return null;

    const formatDate = (dateString) => {
      if (!dateString) return '';

      // Extract only the date part (YYYY-MM-DD) if time is included, removes timezone shift to local time
      const dateOnly = dateString.split('T')[0];
      const [year, month, day] = dateOnly.split('-');
      return new Date(year, month - 1, day).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const isHdurlValid = await checkIfValidImage(rawData.hdurl);
    const isUrlValid = await checkIfValidImage(rawData.url);

    let imageUrl = null;
    if (isHdurlValid) {
      imageUrl = rawData.hdurl;
    } else if (isUrlValid) {
      imageUrl = rawData.url;
    }

    return {
      title: decodeHtmlEntities(rawData.title || 'Untitled'),
      explanation: decodeHtmlEntities(rawData.explanation || 'No description available.'),
      date: formatDate(rawData.date) || '',
      url: isUrlValid ? rawData.url : null,
      hdurl: isHdurlValid ? rawData.hdurl : null
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

        const formattedData = await formatData(rawResult);
        setData(formattedData);

      } catch (err) {
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