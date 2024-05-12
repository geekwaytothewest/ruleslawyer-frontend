import { SessionProvider } from "next-auth/react";
import SideBar from "../components/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <SessionProvider>
        <SideBar />
        <div className="width-5/6">{children}</div>
      </SessionProvider>
    </div>
  );
}
