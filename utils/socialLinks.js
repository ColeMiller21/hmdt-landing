import { FaDiscord, FaGitlab, FaTwitter } from "react-icons/fa";

export const socialLinks = [
  {
    linkName: "Twitter",
    href: "https://twitter.com/HelpMeDebugThis",
    icon: <FaTwitter />,
    type: "social",
  },
  {
    linkName: "Discord",
    href: "https://discord.gg/S3Dw9zBZPQ",
    icon: <FaDiscord />,
    type: "social",
  },
  {
    linkName: "Opensea",
    href: null,
    icon: <img src="/OSLogo.png" alt="opensea logo" />,
    type: "social",
  },
  {
    linkName: "Gitbook",
    href: "https://hmdt.gitbook.io/helpmedebugthis-roadmap/",
    icon: <FaGitlab />,
    type: "social",
  },
  {
    linkName: "Opensea HMDT",
    collectionTitle: "Help Me Debug This",
    href: "https://opensea.io/collection/helpmedebugthis",
    type: "collection",
  },
  {
    linkName: "Opensea HMDTG",
    collectionTitle: "Help Me Debug This Gift",
    href: "https://opensea.io/collection/helpmegiftthis",
    type: "collection",
  },
];
