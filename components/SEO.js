import React from "react";
import { NextSeo } from "next-seo";

const baseUrl = "https://hmdt-landing.vercel.app/";

const SEO = () => {
  return (
    <NextSeo
      title="Help Me Debug This"
      description="Something is fundamentally wrong. H3lp M3 D3bu8 Th15! This is the website for the Genesis Collection for the !Debog Universe"
      canonical={baseUrl}
      openGraph={{
        url: baseUrl,
        title: "Help Me Debug This",
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
        site: "@site",
        cardType: "summary_large_image",
      }}
      additionalLinkTags={[{ rel: "icon", href: "/favicon.ico" }]}
      additionalMetaTags={[
        { name: "viewport", content: "width=device-width, initial-scale=1" },
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
