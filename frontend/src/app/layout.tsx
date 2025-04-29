"use client"

import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Poppins } from 'next/font/google';
import { useEffect } from "react";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "600", "700"], // Add whatever weights you need
    variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    useEffect(() => {
        // Lock scrolling globally
        document.body.style.overflow = "hidden";
        
        return () => {
            // Restore scroll when the component is unmounted
            document.body.style.overflow = "auto";
        };
    }, []);

  return (
    <html lang="en" className={poppins.variable}>
      <body style={{ fontFamily: 'var(--font-poppins)' }}>
        {children}
      </body>
    </html>
  );
}
