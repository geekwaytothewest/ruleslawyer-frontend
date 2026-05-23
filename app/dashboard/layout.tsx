import { Auth0Provider } from "@auth0/nextjs-auth0";
import SideBar from "@/components/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Auth0Provider>
      <div className="flex h-full min-h-screen">
        <SideBar />
        <div className="pt-5 pr-10 w-full">{children}</div>
      </div>
    </Auth0Provider>
  );
}
