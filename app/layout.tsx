import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Geekway to the West - Library Management System",
  description:
    "A library management/Play and Win event system designed for and by Geekway to the West.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-gwdarkblue">
      <body className={`${inter.className} min-h-screen`}>
        <Providers>{children}</Providers>
        <footer className="justify-center gap-3 text-center text-sm text-gray-500 py-4">
          <div>
            &copy; {new Date().getFullYear()} Geekway to the West and The Rules Lawyer. All rights reserved.
          </div>
          <div className="text-center">
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/poweredbybgg.png`} alt="Powered by BGG" className="h-10 inline-block" />
          </div>
        </footer>
      </body>
    </html>
  );
}
