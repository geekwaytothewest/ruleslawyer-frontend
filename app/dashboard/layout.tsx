import { Auth0Provider } from "@auth0/nextjs-auth0";
import { cookies } from "next/headers";
import SideBar from "@/components/sidebar";
import { SIDEBAR_STORAGE_KEY } from "@/utilities/constants";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialCollapsed =
    (await cookies()).get(SIDEBAR_STORAGE_KEY)?.value === "true";

  return (
    <Auth0Provider>
      <div className="flex h-full min-h-screen">
        <SideBar initialCollapsed={initialCollapsed} />
        <div className="pt-5 pr-10 w-full">{children}</div>
      </div>
    </Auth0Provider>
  );
}
