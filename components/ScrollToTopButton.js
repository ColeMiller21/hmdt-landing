import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { IconContext } from "react-icons";

function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <IconContext.Provider
        value={{
          color: "#fb923c",
          size: "2rem",
          className: "",
        }}
      >
        {showButton && (
          <button
            className="above-all fixed bottom-[10px] right-[10px] md:bottom-[20px] md:right-[40px] flex flex-col items-center "
            onClick={handleClick}
          >
            <FaArrowUp />
            <span className="font-vcr text-orange-400 hidden md:block">
              To Top
            </span>
          </button>
        )}
      </IconContext.Provider>
    </div>
  );
}

export default ScrollToTopButton;
