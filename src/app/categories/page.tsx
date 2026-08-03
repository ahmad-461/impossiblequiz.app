import { Metadata } from "next";
import CategoriesClient from "./CategoriesClient";

export const metadata: Metadata = {
  title: "Select Category Sector — The Impossible Quiz",
  description: "Explore the diagnostic quiz domains including Programming (12 languages), Business, English, Logic/Algorithms, Data Analytics, and CS Fundamentals. Select your tech battleground.",
  keywords: ["quiz categories", "programming quiz", "business strategy trivia", "data analytics test", "logic puzzle"],
  authors: [{ name: "Muhammad Ahmad Khan" }],
  openGraph: {
    title: "Select Category Sector — The Impossible Quiz",
    description: "Choose your professional domain vector. Real-time adaptive evaluation for engineers and developers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Select Category Sector — The Impossible Quiz",
    description: "Choose your domain and begin. Evaluate your skills against the adaptive mainframe.",
  },
};

export default function Page() {
  return <CategoriesClient />;
}
