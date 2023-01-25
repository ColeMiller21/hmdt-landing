import React from "react";
import { SyncLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full lg:min-h-full">
      <div className="p-[2.5rem] flex flex-col items-center gap-[1rem]">
        <SyncLoader color="#FAFAFA" />
        <span className="font-pixel">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
