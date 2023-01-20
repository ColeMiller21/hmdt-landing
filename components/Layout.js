import React, { useEffect, useState } from "react";
import Footer from "./Sections/Footer";
import Navbar from "./Sections/Navbar";
import Modal from "./Modal";
import OSModalContent from "./OSModalContent";

const Layout = ({ children }) => {
  const [showModal, setShowModal] = useState();
  const [muted, setMuted] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleAudio = () => {
    setMuted(!muted);
  };

  useEffect(() => {
    let audio = document?.getElementById("audio");
    audio.play();
  }, []);

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
        className="invisible"
        id="audio"
        controls
        loop
        src="/loz.mp3"
        muted={muted}
      ></audio>
    </div>
  );
};

export default Layout;
