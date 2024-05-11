import Image from "next/image";
import Profile from "@/app/components/profile";
import Link from "next/link";

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image src='/geekgay.png' width={500} height={436} alt="Geekway to the West Pride Logo"></Image>
      <Link href="/dashboard">Dashboard</Link>
      <Profile />
    </main>
  );
}
