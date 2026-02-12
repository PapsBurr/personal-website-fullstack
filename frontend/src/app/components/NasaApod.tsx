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
        {/* Skeleton for subtitle */}
        <div className="h-6 bg-slate-700 animate-pulse rounded mb-4 mx-auto w-1/2"></div>
        {/* Skeleton for date */}
        <div className="h-4 bg-slate-700 animate-pulse rounded m-6 mx-auto w-1/4"></div>
        {/* Skeleton for image */}
        <div className="flex justify-center my-8">
          <div className="w-800 h-100 bg-slate-700 animate-pulse rounded-[20px] shadow-md/40"></div>
        </div>
        {/* Skeleton for explanation (multiple lines) */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-slate-700 animate-pulse rounded w-full"></div>
          <div className="h-4 bg-slate-700 animate-pulse rounded w-5/6"></div>
          <div className="h-4 bg-slate-700 animate-pulse rounded w-4/5"></div>
          <div className="h-4 bg-slate-700 animate-pulse rounded w-3/4"></div>
        </div>
        <hr />
      </>
    );
  }

  if (error) {
    return (
      <>
        <h3 className="text-8xl font-bold text-center mb-4 text-gray-800">
          Nasa's Picture of the Day
        </h3>
        <div className="flex justify-center text-red-900 whitespace-pre-wrap">
          An error occurred while fetching the image.{"\n"}Please try again
          later.
        </div>
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
  const isFallback = date === "Oct 1, 2025";
  return (
    <>
      <div>
        <h3 className="text-8xl font-bold text-center mb-4">
          Nasa's Picture of the Day
        </h3>
        <h4 className="text-xl font-bold text-center mb-4">{title}</h4>
        <p className="text-center text-slate-100/80 mb-6">{date}</p>
        <div className="flex gap-16 justify-center my-8">
          <RoundedImage src={imageUrl} alt={title} width={800} />
        </div>
        <p className="!text-base text-slate-100/80 mb-6">{explanation}</p>
        {isFallback && (
          <div className="flex justify-center mb-4">
            <p
              className="text-center p-4 mb-4 text-sm rounded-lg border border-yellow-500 bg-yellow-200 text-yellow-700"
              role="alert"
            >
              <img
                src="/info-icon.svg"
                alt="Info"
                className="inline w-4 h-4 mr-4"
              />
              <span className="font-medium">
                Note: NASA's Astronomy Picture of the Day is currently
                unavailable. {"\n"}This is a fallback image.
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default NasaApod;
