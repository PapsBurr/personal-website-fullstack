"use client";
import RoundedImage from "./RoundedImage";
import useNasaApod from "../../hooks/useNasaApod";

const NasaApod = () => {
  const { data, loading, error } = useNasaApod();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-4 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return <div className="text-gray-500">No data available</div>;
  }

  const title = data.title || data.text?.title || "Untitled";
  const explanation = data.explanation || "No description available";
  const date = data.date || "";
  const url = data.url || "";
  const hdurl = data.hdurl || data.media?.hasHdVersion ? data.hdurl : null;

  if (data.hdurl) {
    return (
      <div>
        <h3 className="text-8xl font-bold text-center mb-4 text-gray-800">
          Nasa's Picture of the Day
        </h3>
        <h4 className="text-xl font-bold text-center mb-4 text-gray-800">
          {data.title}
        </h4>
        <p className="text-center text-gray-600 mb-6">{data.date}</p>
        <div className="flex gap-16 justify-center my-8">
          <RoundedImage src={data.url} alt={data.title} width={800} />
        </div>
        <p className="!text-base text-gray-600 mb-6">{data.explanation}</p>
      </div>
    );
  }

  return (
    <div>
        <h3 className="text-8xl font-bold text-center mb-4 text-gray-800">
          Nasa's Picture of the Day
        </h3>
        <h4 className="text-xl font-bold text-center mb-4 text-gray-800">
          {data.title}
        </h4>
        <p className="text-center text-gray-600 mb-6">{data.date}</p>
        <RoundedImage src={data.url} alt={data.title} width={800} />
        <p className="text-center text-gray-800 mb-6">{data.explanation}</p>
      </div>
  );
};

export default NasaApod;
