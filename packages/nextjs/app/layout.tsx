import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import { ScaffoldEthApp } from "~~/components/ScaffoldEthApp";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;
const imageUrl = `${baseUrl}/thumbnail.jpg`;

export const metadata: Metadata = {
  title: "EcoCred - Blockchain-Powered Sustainable Actions",
  description: "Earn EcoCred tokens and grow your EcoPet companion through sustainable actions on the blockchain",
  openGraph: {
    title: "EcoCred - Built with ChatAndBuild",
    description: "Blockchain-powered platform rewarding sustainable actions with EcoCred tokens and EcoPet NFAs",
    images: [
      {
        url: "https://cdn.chatandbuild.com/images/preview.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoCred - Built with ChatAndBuild",
    description: "Blockchain-powered platform rewarding sustainable actions with EcoCred tokens and EcoPet NFAs",
    images: ["https://cdn.chatandbuild.com/images/preview.png"],
    site: "@chatandbuild",
  },
  keywords: "no-code, app builder, conversation-driven development, blockchain, sustainability, web3",
  icons: {
    icon: "/favicon.png",
  },
};

const ScaffoldEthAppWithProviders = () => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthApp />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthAppWithProviders;
