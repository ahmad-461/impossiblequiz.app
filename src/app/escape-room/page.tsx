import { Metadata } from "next";
import EscapeRoomClient from "./EscapeRoomClient";

export const metadata: Metadata = {
  title: "Corrupted System Code Escape Room — The Impossible Quiz",
  description: "Navigate exactly 8 firewalled narrative chambers of increasing difficulty. Hack your way out under a shared 5-minute countdown clock. Maximum of 3 room failures allowed.",
  keywords: ["programming escape room", "code puzzle room", "retro code hack", "terminal game"],
  authors: [{ name: "Muhammad Ahmad Khan" }],
  openGraph: {
    title: "Corrupted System Code Escape Room — The Impossible Quiz",
    description: "Infiltrate 8 encrypted chambers under a 5-minute global countdown. Can you bypass all the system firewall locks?",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corrupted System Code Escape Room — The Impossible Quiz",
    description: "8 rooms, 5 minutes, 3 locks allowed to fail. Play the hardcore code escape sequence now.",
  },
};

export default function Page() {
  return <EscapeRoomClient />;
}
