import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignIn } from "@/components/auth/signin";
import { SignOut } from "@/components/auth/signout-client";

// jsdom 26 makes window.location non-configurable, so the href assignment in
// these handlers can't be observed (it's silently swallowed). We still click to
// exercise the handler body — it must run without throwing.

describe("SignIn", () => {
  it("renders a sign-in control", () => {
    render(<SignIn />);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("runs its navigation handler on click without throwing", async () => {
    render(<SignIn />);
    await userEvent.click(screen.getByRole("button"));
    // Button is still present afterwards; the handler executed cleanly.
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

describe("SignOut", () => {
  it("shows the 'Sign Out' label when expanded", () => {
    render(<SignOut />);
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("hides the label text when collapsed", () => {
    render(<SignOut collapsed />);
    // The visible label is gone, but the button is still reachable by aria-label.
    expect(screen.queryByText("Sign Out")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Out" })).toBeInTheDocument();
  });

  it("runs its navigation handler on click without throwing", async () => {
    render(<SignOut />);
    await userEvent.click(screen.getByRole("button", { name: "Sign Out" }));
    expect(screen.getByRole("button", { name: "Sign Out" })).toBeInTheDocument();
  });
});
