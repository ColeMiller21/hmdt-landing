import Image from "next/image";

const ResponsiveBannerImage = () => {
  return (
    <div className="relative w-full h-64 bg-gray-300 overflow-hidden rounded-lg z-10">
      <Image
        src="/hmdtbanner.jpeg"
        alt="Banner"
        fill
        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
      />
    </div>
  );
};

export default ResponsiveBannerImage;
