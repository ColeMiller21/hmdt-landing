import React from "react";
import Footer from "./Sections/Footer";
import Navbar from "./Sections/Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-w-screen overflow-x-hidden min-full-page bg-[#141414] text-[#FAFAFA]">
      <Navbar />
      <main className="flex-grow flex justify-center items-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
