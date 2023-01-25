import React from "react";

const PageTitle = ({ text }) => {
  return (
    <div className="object-contain">
      <h1 className=" font-pixel typewriter text-[4.5vw] xl:text-[2.75vw] text-center p-[1rem]">
        {text}
      </h1>
    </div>
  );
};

export default PageTitle;
