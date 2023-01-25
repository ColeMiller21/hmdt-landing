import { useState, useEffect } from "react";
import Image from "next/image";
import { createImageUrl } from "../../utils/imageHelper";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import OSModal from "../OSModal";
import MainButton from "../MainButton";

const gifPath = "/welcome.gif";

const Landing = () => {
  const [searchedTokenUrl, setSearchedTokenUrl] = useState(null);
  const [searchedTokenId, setSearchedTokenId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [errorText, setErrorText] = useState("");

  const searchToken = () => {
    if (!tokenId || tokenId.trim() === "") {
      setErrorText(``);
      setSearchedTokenId(null);
      setSearchedTokenUrl(null);
      return;
    } else if (tokenId < 0 || tokenId > 855) {
      setErrorText(`No token for tokenId: ${tokenId}`);
      setSearchedTokenId(null);
      setSearchedTokenUrl(null);
      return;
    }
    setSearchedTokenId(tokenId);
    setSearchedTokenUrl(createImageUrl(Number(tokenId)));
  };

  const onEnterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      searchToken();
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <section className="flex min-h-full w-screen justify-center border-slate-700">
      <div className="flex flex-col items-center justify-center h-full p-[2rem]">
        <div className="object-contain">
          <h1 className=" font-pixel typewriter text-[4.5vw] xl:text-[2.75vw] text-center p-[1rem]">
            Help Me Debug This
          </h1>
        </div>
        <p className="font-vcr text-center mt-[1rem]">A simple tag line </p>
        <div className="w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] aspect-square relative my-[2rem]">
          <img
            src={searchedTokenId ? searchedTokenUrl : gifPath}
            alt={`${
              searchedTokenId ? `HMDT #${searchedTokenId}` : "Welcome Gif"
            }`}
            className="w-full min-h-full"
          />
          <div className="glitch__layers">
            <div
              className="glitch__layer"
              style={{
                backgroundImage: `url(${
                  searchedTokenId ? searchedTokenUrl : gifPath
                })`,
              }}
            ></div>
            <div
              className="glitch__layer"
              style={{
                backgroundImage: `url(${
                  searchedTokenId ? searchedTokenUrl : gifPath
                })`,
              }}
            ></div>
            <div
              className="glitch__layer"
              style={{
                backgroundImage: `url(${
                  searchedTokenId ? searchedTokenUrl : gifPath
                })`,
              }}
            ></div>
          </div>
        </div>
        {searchedTokenId ? (
          <a
            href={`https://opensea.io/assets/ethereum/0xdf0f0a5508aa4f506e5bdc8c45c8879e6e80d3e4/${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer font-vcr"
          >
            <span className="font-vcr">
              Check out HMDT #{searchedTokenId} on Opensea
            </span>
          </a>
        ) : (
          <span className="text-red-500 font-vcr">{errorText}</span>
        )}
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
                "absolute bottom-0 right-0  text-white rounded bg-slate-700 h-[43px] w-[50px] cursor-pointer"
              }
              type="submit"
              onClick={searchToken}
              disabled={tokenId === ""}
              aria-label="Search Token"
            >
              <span className="w-full flex justify-center">
                <FaSearch />
              </span>
            </button>
          </label>
        </div>
        <MainButton onClick={toggleModal} width="w-[250px] md:w-[400px]">
          Check out Collections
        </MainButton>
      </div>
      <OSModal onClose={() => setShowModal(false)} show={showModal} />
    </section>
  );
};

export default Landing;
