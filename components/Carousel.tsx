"use client";
import { useState, useEffect, useRef } from "react";

const images = [
  "https://www.coderarmy.in/assets/images/dsaPaid.png",
  "https://www.bathecho.co.uk/uploads/2015/05/Level-2-IT-students-with-coding-certificates.jpg",
  "https://images.idgesg.net/images/article/2019/08/mastery_of_technology_skills_knowledge_by_metamorworks_gettyimages-1032524366_2400x1600-100807538-large.jpg?auto=webp"
];

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
      setImageError(false); // Reset error state on slide change
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
    setImageError(false);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
    setImageError(false);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX.current - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX.current > 50) prevSlide();
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image with fallback support */}
      <img
        src={imageError ? "/fallback-image.jpg" : images[index]} // Fallback image if loading fails
        alt="DSA Visualizer"
        className="w-full h-auto max-h-[500px] object-contain transition-opacity duration-500 opacity-100"
        loading="lazy"
        onError={() => setImageError(true)}
      />

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 sm:p-3 rounded-full text-white text-xl sm:text-2xl"
      >
        ◀
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 sm:p-3 rounded-full text-white text-xl sm:text-2xl"
      >
        ▶
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-white scale-125" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
