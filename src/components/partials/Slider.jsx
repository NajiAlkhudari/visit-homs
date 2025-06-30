"use client";
import { useState , useEffect} from "react";

const images = [
  "/a1.avif",
    "/a2.avif",
  "/a3.avif",


];

export default function Slider() {
  const [current, setCurrent] = useState(0);


    useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000); 

    return () => clearInterval(interval); 
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full mx-auto overflow-hidden rounded-xl shadow-lg">
      <img
        src={images[current]}
        alt={`slide ${current}`}
        className="w-full h-64 object-cover transition-opacity duration-500"
      />

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
      >
        ▶
      </button>

      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-4 h-1 rounded-full ${
              index === current ? "bg-rose-800" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}




