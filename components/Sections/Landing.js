import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { createImageUrl } from "../../utils/imageHelper";

const Landing = ({ ids }) => {
  console.log(ids);
  const [imageURL, setImageURL] = useState(createImageUrl(ids[0]));
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((currentId) => {
        console.log({ currentId });
        const nextId = (currentId % ids.length) + 1;
        console.log({ nextId });
        return nextId;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex justify-center items-center min-h-full">
      <div className="flex flex-col items-center">
        <h1 className=" font-pixel typewriter text-[3.5vw] xl:text-[2.75vw]">
          Help Me Debug This
        </h1>
        <div className="w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] aspect-square relative my-[1.5rem]">
          <Image
            style={{ objectFit: "contain" }}
            src={"/gif1.gif"}
            alt="Help Me Debug This NFT Gif"
            fill
            priority={true}
          />
        </div>

        <h2 className="font-vcr text-[3.5vw] md:text-[4vw] xl:text-[2.25vw]">
          Website Coming Soon
        </h2>
      </div>
    </section>
  );
};

export default Landing;
