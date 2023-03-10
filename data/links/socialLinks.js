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
    href: "https://discord.gg/helpmedebugthis",
    icon: <FaDiscord />,
    type: "social",
  },
  {
    linkName: "Opensea",
    href: null,
    icon: (
      <img
        src="/OSLogo.png"
        alt="opensea logo"
        style={{ height: "25px", width: "25px" }}
      />
    ),
    type: "social",
  },
  {
    linkName: "Gitbook",
    href: "https://hmdt.gitbook.io/helpmedebugthis-roadmap/",
    icon: <FaGitlab />,
    type: "social",
  },
  {
    linkName: "HMDT Opensea",
    collectionTitle: "Help Me Debug This",
    href: "https://opensea.io/collection/helpmedebugthis",
    type: "collection",
  },
  {
    linkName: "HMGT Opensea",
    collectionTitle: "Help Me Gift This",
    href: "https://opensea.io/collection/helpmegiftthis",
    type: "collection",
  },
];
