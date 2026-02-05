import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoldSprinkles } from "@/components/GoldSprinkles";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stayra | Luxury Stays, Optimized Prices",
  description: "The intelligent hotel aggregator that finds you the perfect stay at the lowest price across every booking platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          data-noptimize="1"
          data-cfasync="false"
          data-wpfc-render="false"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                  var script = document.createElement("script");
                  script.async = 1;
                  script.src = 'https://emrldtp.cc/NDk1NDQ0.js?t=495444';
                  document.head.appendChild(script);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="fixed inset-0 z-0 pointer-events-none">
            <GoldSprinkles />
          </div>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
