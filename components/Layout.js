import React, { useEffect, useState, useRef } from "react";
import Footer from "./Sections/Footer";
import Navbar from "./Sections/Navbar";
import Modal from "./Modal";
import OSModal from "./OSModal";

const Layout = ({ children }) => {
  const [showModal, setShowModal] = useState();
  const [muted, setMuted] = useState(true);
  let audio = useRef();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleAudio = () => {
    muted ? audio.current.play() : audio.current.pause();
    setMuted(!muted);
  };

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col min-w-screen overflow-x-hidden bg-[#141414] text-[#FAFAFA] min-full-page">
      <Navbar toggleAudio={toggleAudio} muted={muted} />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer toggleModal={toggleModal} />
      <OSModal onClose={() => setShowModal(false)} show={showModal} />
      <audio
        ref={audio}
        className="hidden"
        id="audio"
        controls
        loop
        src="/loz.mp3"
        muted={muted}
        autoPlay
      ></audio>
    </div>
  );
};

export default Layout;
