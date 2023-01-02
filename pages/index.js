import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      <SEO />
      <main className="flex justify-center items-center min-h-full">
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
      </main>
    </>
  );
}
