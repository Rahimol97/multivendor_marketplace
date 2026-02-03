import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const offers = [
  { id: 1, img: "/offers/elctronics.jpg", title: "Up to 70% OFF Electronics" },
  { id: 2, img: "/offers/clothing.jpg", title: "Flat 50% OFF Fashion" },
  { id: 3, img: "/offers/shoes.jpg", title: "Flat 40% OFF Shoes" },
  { id: 4, img: "/offers/cosmetics.jpg", title: "Beauty Sale Up to 60% OFF" },
];

function Carousel() {
  return (
      <div className="w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        className="w-full"
      >
        {offers.map((offer) => (
          <SwiperSlide key={offer.id}>
           <div className="relative w-full h-45 sm:h-65 md:h-85 lg:h-105 overflow-hidden shadow-lg">
  <img
    src={offer.img}
    alt={offer.title}
    className="w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />

  <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white max-w-xl">
    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
      {offer.title}
    </h2>

    <p className="mt-2 text-xs sm:text-sm md:text-base opacity-90">
      Limited time offer. Grab your favorites before they’re gone!
    </p>

    <button className="mt-4 w-max bg-(--bright-teal) text-(--dark-teal) px-4 py-2 rounded-lg font-semibold text-sm md:text-base hover:scale-105 transition">
      Shop Now
    </button>
  </div>
</div>

          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Carousel;
