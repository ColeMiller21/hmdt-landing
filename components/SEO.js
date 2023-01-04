import React from "react";
import { NextSeo } from "next-seo";

const baseUrl = "https://www.helpmedebugthis.com/";

const SEO = ({ title, description, imagePath, path }) => {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={path ? `${baseUrl}/${path}` : baseUrl}
      openGraph={{
        url: path ? `${baseUrl}/${path}` : baseUrl,
        title,
        description: "Something is fundamentally wrong. H3lp M3 D3bu8 Th15",
        images: [
          {
            url: "https://fafz.mypinata.cloud/ipfs/QmS3g1MArz2x45SNjYmADoeVdrP7wkH9qAZGksEAQrSKJk/530.png",
            width: 800,
            height: 600,
            alt: "Og Image Alt",
            type: "image/jpeg",
          },
          {
            url: "https://fafz.mypinata.cloud/ipfs/QmS3g1MArz2x45SNjYmADoeVdrP7wkH9qAZGksEAQrSKJk/530.png",
            width: 900,
            height: 800,
            alt: "Og Image Alt Second",
            type: "image/jpeg",
          },
        ],
        site_name: "HelpMeDebugThis",
      }}
      twitter={{
        handle: "@HelpMeDebugThis",
        site: baseUrl,
        cardType: "summary_large_image",
      }}
      additionalLinkTags={[{ rel: "icon", href: "/favicon.ico" }]}
      additionalMetaTags={[
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "keywords",
          content:
            "help me debug this, debug, nft, nft collection, debug nfts, pixel, pixel nfts, help me debug this nft",
        },
      ]}
      robotsProps={{
        nosnippet: true,
        notranslate: true,
        noimageindex: true,
        noarchive: true,
      }}
    />
  );
};

export default SEO;
