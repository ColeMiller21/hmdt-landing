import React, { useEffect, useState, useRef } from "react";
import Footer from "./Sections/Footer";
import Navbar from "./Sections/Navbar";
import Modal from "./Modal";
import OSModalContent from "./OSModalContent";

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
    <div className="flex flex-col min-w-screen overflow-x-hidden min-full-page bg-[#141414] text-[#FAFAFA]">
      <Navbar
        toggleModal={toggleModal}
        toggleAudio={toggleAudio}
        muted={muted}
      />
      <main className="flex-grow flex">{children}</main>
      <Footer />
      <Modal onClose={() => setShowModal(false)} show={showModal}>
        <OSModalContent />
      </Modal>
      <audio
        ref={audio}
        className="invisible"
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
