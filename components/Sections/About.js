import React from "react";
import MainButton from "../MainButton";
import PageSelection from "./PageSelection";

const About = () => {
  return (
    <section className="py-[5rem] h-auto flex flex-col gap-[2rem] items-center">
      <h1 className=" font-pixel text-[4.5vw] xl:text-[2.75vw] p-[1rem] text-orange-400">
        About HMDT
      </h1>
      <p className="font-vcr w-[90%] md:w-[70%] text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <p className="font-vcr w-[90%] md:w-[70%] text-center">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <PageSelection />
    </section>
  );
};

export default About;
