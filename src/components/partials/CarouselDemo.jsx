// "use client";

// import Image from "next/image";
// import { useEffect } from "react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselPrevious,
//   CarouselNext,
// } from "@/components/ui/carousel";
// import { useGallery } from "@/store/galleryStore";



// const CarouselDemo = () => {

//   const { getGallery, galleries } = useGallery();

//   useEffect(() => {
//     getGallery();
//   }, []);

//   return (
//     <div className="w-full max-w-7xl mx-auto py-10">
//       <Carousel>
//         <CarouselContent>
// {galleries.map((image, index) => (
//   <CarouselItem key={index}>
//     <div className="relative h-96 w-full overflow-hidden rounded-lg">
//       {image?.imageUrl ? (
//         <Image
//           src={`${process.env.NEXT_PUBLIC_API_URL}${image.imageUrl}`}
//           alt={image.title || "Gallery Image"}
//           fill
// className="relative h-[500px] w-full overflow-hidden rounded-lg"      />
//       ) : (
//         <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
//           الصورة غير متوفرة
//         </div>
//       )}
//     </div>
//   </CarouselItem>
// ))}

//         </CarouselContent>

//         <CarouselPrevious />
//         <CarouselNext />
//       </Carousel>
//     </div>
//   );
// }
// export default CarouselDemo



"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useGallery } from "@/store/galleryStore";

const CarouselDemo = () => {
  const { getGallery, galleries } = useGallery();

  useEffect(() => {
    getGallery();
  }, []);

  return (
    <div className="w-full max-w-[1550px] mx-auto ">
      <Carousel>
        <CarouselContent>
          {galleries.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[600px] w-full overflow-hidden rounded-lg">
                {image?.imageUrl ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${image.imageUrl.replace(/^\/+/, "")}`}
                    alt={image.title || "Gallery Image"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                    الصورة غير متوفرة
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CarouselDemo;
