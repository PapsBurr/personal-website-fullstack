"use client";
import Image from "next/image";

// TODO: the height variable doesn't work and the current setup causes warnings in the console log

interface RoundedImageProps {
  src: string;
  alt: string;
  width: number;
  height?: number;
}

const RoundedImage = ({ src, alt, width, height=500 }: RoundedImageProps) => {
  return (
    <Image 
      className="rounded-[20px] shadow-md/40"
      src = {src}
      alt = {alt}
      width = {width}
      height = {height}
    />
  )
}

export default RoundedImage;