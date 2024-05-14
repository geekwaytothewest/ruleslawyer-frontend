import { SessionProvider } from "next-auth/react";
import SideBar from "../components/auth/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <div className="flex h-full min-h-screen">
          <SideBar />
          <div className="pt-5 w-full">{children}</div>
      </div>
    </SessionProvider>
  );
}
