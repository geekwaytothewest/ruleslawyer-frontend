import { SessionProvider } from "next-auth/react";
import SideBar from "../components/sidebar";
import { SWRConfig } from "swr";
import frontendFetch from "@/utilities/frontendFetch";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <div className="flex h-full min-h-screen">
        <SideBar />
        <div className="pt-5 pr-10 w-full">{children}</div>
      </div>
    </SessionProvider>
  );
}
