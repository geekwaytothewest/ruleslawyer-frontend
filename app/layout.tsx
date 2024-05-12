import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={`${inter.className} bg-gwdarkblue bg-fixed`}>{children}</body>
    </html>
  );
}
