import { signOut } from "@/auth";
import { VscSignOut } from "react-icons/vsc";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit" className="hover:text-gwgreen">
        <span className="text-lg">
          <VscSignOut className="inline-block" /> Sign Out
        </span>
      </button>
    </form>
  );
}
