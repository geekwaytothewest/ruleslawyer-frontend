import Image from "next/image";
import geekgayLogo from "@/public/geekgay.png";
import Profile from "@/components/profile";

export default async function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 p-8 md:p-24">
      <Image
        src={geekgayLogo}
        width={500}
        height={436}
        alt="Geekway to the West Pride Logo"
        className="h-auto w-full max-w-[500px]"
      ></Image>

      <Profile />
    </main>
  );
}
