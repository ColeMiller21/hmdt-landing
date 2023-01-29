import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { createImageUrl } from "../utils/imageHelper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper";

const Slider = ({ type }) => {
  const [baseUrl, setBaseUrl] = useState(null);
  const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const setBaseFromType = (type) => {
    switch (type) {
      case "hmdt":
        setBaseUrl(
          "https://opensea.io/assets/ethereum/0xdf0f0a5508aa4f506e5bdc8c45c8879e6e80d3e4/"
        );
        break;
      case "hmgt":
        setBaseUrl(
          "https://opensea.io/assets/ethereum/0x9af34c11b400e0c8498cb4721299e0501f520760/"
        );
        break;
      default:
        throw new Error("No type");
    }
  };

  useEffect(() => {
    if (type) {
      setBaseFromType(type);
    }
  }, [type]);

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
        {ids.map((id, i) => {
          return (
            <SwiperSlide key={`${id}+${i}`}>
              <img src={createImageUrl(id)} className="relative" />
              <a
                className="absolute top-[5px] left-[6px]"
                href={`${baseUrl}${id}`}
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
        })}
      </Swiper>
    </>
  );
};

export default Slider;
