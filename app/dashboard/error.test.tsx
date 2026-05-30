import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardError from "@/app/dashboard/error";

describe("DashboardError", () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    // The boundary logs the error on mount; keep it out of the test output.
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => consoleError.mockRestore());

  it("renders the fallback message and logs the error", () => {
    const error = new Error("boom");
    render(<DashboardError error={error} reset={jest.fn()} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith(error);
  });

  it("shows the digest reference when present", () => {
    const error = Object.assign(new Error("boom"), { digest: "abc123" });
    render(<DashboardError error={error} reset={jest.fn()} />);
    expect(screen.getByText("Reference: abc123")).toBeInTheDocument();
  });

  it("omits the reference line when there is no digest", () => {
    render(<DashboardError error={new Error("boom")} reset={jest.fn()} />);
    expect(screen.queryByText(/Reference:/)).not.toBeInTheDocument();
  });

  it("invokes reset() when 'Try again' is clicked", async () => {
    const reset = jest.fn();
    render(<DashboardError error={new Error("boom")} reset={reset} />);

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
