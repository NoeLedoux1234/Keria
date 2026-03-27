import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { LoadingScreenProvider } from "@/components/loading-screen-provider";
import { Navigation } from "@/components/navigation";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KERIA - Trouvez le point de rencontre parfait",
  description:
    "Trouvez le point de rencontre le plus équitable entre plusieurs personnes. Simple, intelligent et élégant.",
  keywords: ["point de rencontre", "meetpoint", "équitable", "rendez-vous", "localisation"],
  openGraph: {
    title: "KERIA - Trouvez le point de rencontre parfait",
    description:
      "Trouvez le point de rencontre le plus équitable entre plusieurs personnes. Simple, intelligent et élégant.",
    type: "website",
    locale: "fr_FR",
    siteName: "KERIA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${GeistSans.variable} ${GeistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <Providers>
          <LoadingScreenProvider>
            <Navigation />
            {children}
          </LoadingScreenProvider>
        </Providers>
      </body>
    </html>
  );
}
