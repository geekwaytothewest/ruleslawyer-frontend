import { redirect } from "next/navigation";
import { VscSignOut } from "react-icons/vsc";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        redirect("/auth/logout");
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
