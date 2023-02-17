import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { createImageUrl } from "../utils/imageHelper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper";
import Loader from "./Loader";

const Slider = ({ data, loading }) => {
  return (
    <>
      <Swiper
        spaceBetween={30}
        navigation={true}
        modules={[Navigation, Pagination]}
        // pagination={{
        //   type: "fraction",
        // }}
        breakpoints={{
          // when window width is >= 640px
          640: {
            width: 640,
            slidesPerView: 1,
          },
          // when window width is >= 768px
          768: {
            width: 768,
            slidesPerView: 3,
          },
        }}
        className="mySwiper"
      >
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            {data.map((d, i) => {
              return (
                <SwiperSlide key={`${d.edition}+${i}`}>
                  <img src={d.image} className="relative" />
                  <a
                    className="absolute top-[5px] left-[6px]"
                    href={d.openSea}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/OSLogo.png"
                      className="w-[10%] aspect-square cursor-pointer"
                    />
                  </a>
                </SwiperSlide>
              );
            })}{" "}
          </>
        )}
      </Swiper>
    </>
  );
};

export default Slider;
