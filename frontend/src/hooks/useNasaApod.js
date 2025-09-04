'use client';
import { useState, useEffect } from 'react';

const useNasaApod = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatData = (rawData) => {
    if (!rawData) return null;

    const formatDate = (dateString) => {
      if (!dateString) return '';

      // Extract only the date part (YYYY-MM-DD) if time is included, removes timezone shift to local time
      const dateOnly = dateString.split('T')[0];
      const [year, month, day] = dateOnly.split('-');
      return new Date(year, month - 1, day).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return {
      title: rawData.title || 'Untitled',
      explanation: rawData.explanation || 'No description available.',
      date: formatDate(rawData.date) || '',
      url: rawData.url || '',
      hdurl: rawData.hdurl || ''
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

        const formattedData = formatData(rawResult);
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

  // Function to refetch data if needed
  const refetch = () => {
    fetchNasaApod();
  };

  return { data, loading, error };
};

export default useNasaApod;