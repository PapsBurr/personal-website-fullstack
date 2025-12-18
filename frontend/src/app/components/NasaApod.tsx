"use client";
import RoundedImage from "./RoundedImage";
import useNasaApod from "../../hooks/useNasaApod";
import { UseNasaApodResult } from "../../types/nasa";

const NasaApod: React.FC = () => {
  const { data, loading, error }: UseNasaApodResult = useNasaApod();

  if (loading) {
    return (
      <>
        <h3 className="text-8xl font-bold text-center mb-4 text-gray-800">
          Nasa's Picture of the Day
        </h3>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
          <span className="ml-4 text-gray-600">Loading...</span>
        </div>
        <hr></hr>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex justify-center text-red-900 whitespace-pre-wrap">An error occurred while fetching the image.{"\n"}Please try again later.</div>
        <hr></hr>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <div className="text-gray-500">No data available</div>
        <hr></hr>
      </>
    );
  }

  const title = data.title || "Untitled Image";
  const explanation = data.explanation || "No description available";
  const date = data.date || "";
  const url = data.url;
  const hdurl = data.hdurl;

  const imageUrl = hdurl || url || "";
  const isFallback = (date === "Oct 1, 2025");
  return (
    <>
      <div>
        <h3 className="text-8xl font-bold text-center mb-4 text-gray-800">
          Nasa's Picture of the Day
        </h3>
        <h4 className="text-xl font-bold text-center mb-4 text-gray-800">
          {title}
        </h4>
        <p className="text-center text-gray-600 mb-6">{date}</p>
        <div className="flex gap-16 justify-center my-8">
          {/* TEMPORARY FALLBACK SET TO BASE IMAGE WHILE DEBUGGING*/}
          <RoundedImage src={imageUrl} alt={title} width={800} />
        </div>
        <p className="!text-base text-gray-600 mb-6">{explanation}</p>
        {isFallback && (
          <div className="flex justify-center mb-4">
            <p className="text-center p-4 mb-4 text-sm rounded-lg border border-yellow-500 bg-yellow-200 text-yellow-700" role="alert">
              <img src="/info-icon.svg" alt="Info" className="inline w-4 h-4 mr-4" />
              <span className="font-medium">Note: NASA's Astronomy Picture of the Day is currently unavailable. {"\n"}This is a fallback image.</span>
            </p>
          </div>
        )}
      </div>
      <hr></hr>
    </>
  );
};

export default NasaApod;
