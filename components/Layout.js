import React, { useState } from "react";
import Footer from "./Sections/Footer";
import Navbar from "./Sections/Navbar";
import Modal from "./Modal";
import OSModalContent from "./OSModalContent";

const Layout = ({ children }) => {
  const [showModal, setShowModal] = useState();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="flex flex-col min-w-screen overflow-x-hidden min-full-page bg-[#141414] text-[#FAFAFA]">
      <Navbar toggleModal={toggleModal} />
      <main className="flex-grow flex justify-center items-center">
        {children}
      </main>
      <Footer />
      <Modal onClose={() => setShowModal(false)} show={showModal}>
        <OSModalContent />
      </Modal>
    </div>
  );
};

export default Layout;
