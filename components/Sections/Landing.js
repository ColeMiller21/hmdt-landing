import { useState, useEffect } from "react";
import Image from "next/image";
import { createImageUrl } from "../../utils/imageHelper";
import { FaSearch } from "react-icons/fa";

const Landing = () => {
  const [searchedToken, setSearchedToken] = useState(
    Math.floor(Math.random() * 855) + 1
  );
  const [tokenId, setTokenId] = useState("");

  const searchToken = () => {
    if (!tokenId) {
      return;
    }
    setSearchedToken(Number(tokenId));
  };

  const onEnterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      searchToken();
    }
  };

  return (
    <section className="flex justify-center items-center min-h-full">
      <div className="flex flex-col items-center">
        <h1 className=" font-pixel typewriter text-[3.5vw] xl:text-[2.75vw]">
          Help Me Debug This
        </h1>
        <div className="w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] aspect-square relative my-[1.5rem]">
          <Image
            style={{ objectFit: "contain" }}
            src={createImageUrl(searchedToken)}
            alt={`Help Me Debug This NFT #${searchedToken}`}
            fill
            priority={true}
          />
        </div>
        <a
          href={`https://opensea.io/assets/ethereum/0xdf0f0a5508aa4f506e5bdc8c45c8879e6e80d3e4/${tokenId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer font-vcr"
        >
          Check it out on Opensea!
        </a>
        <div className="my-[1.5rem]">
          <label className="relative ">
            <input
              type="number"
              placeholder="Search by TokenId"
              className="h-[45px] w-[250px] md:w-[400px] border-2 border-slate-700 rounded pl-2 text-[#FAFAFA] bg-[#141414] overflow-hidden font-vcr"
              onChange={(e) => setTokenId(e.target.value)}
              onKeyUp={(e) => onEnterPressed(e)}
              value={tokenId}
            />
            <button
              className={
                "absolute bottom-[-60%] right-0 px-4 text-white rounded bg-slate-700 h-[43px] w-[50px] cursor-pointer"
              }
              type="submit"
              onClick={searchToken}
              disabled={tokenId === ""}
            >
              <FaSearch />
            </button>
          </label>
        </div>

        <h2 className="font-vcr text-[3.5vw] md:text-[4vw] xl:text-[2.25vw]">
          Website Coming Soon
        </h2>
      </div>
    </section>
  );
};

export default Landing;
