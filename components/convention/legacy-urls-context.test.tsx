import { render, screen } from "@testing-library/react";
import {
  LegacyUrlsProvider,
  useLegacyUrls,
} from "@/components/convention/legacy-urls-context";

// Probe component that surfaces the context values as text so we can assert on
// what useLegacyUrls() returned.
function Probe() {
  const urls = useLegacyUrls();
  return (
    <ul>
      <li>admin:{urls.adminUrl}</li>
      <li>librarian:{urls.librarianUrl}</li>
      <li>playPrize:{urls.playPrizeEntryUrl}</li>
    </ul>
  );
}

describe("legacy-urls-context", () => {
  it("returns empty-string defaults when no provider wraps the consumer", () => {
    render(<Probe />);
    expect(screen.getByText("admin:")).toBeInTheDocument();
    expect(screen.getByText("librarian:")).toBeInTheDocument();
    expect(screen.getByText("playPrize:")).toBeInTheDocument();
  });

  it("supplies the provided URLs to consumers", () => {
    render(
      <LegacyUrlsProvider
        value={{
          adminUrl: "https://admin.test",
          librarianUrl: "https://lib.test",
          playPrizeEntryUrl: "https://prize.test",
        }}
      >
        <Probe />
      </LegacyUrlsProvider>
    );
    expect(screen.getByText("admin:https://admin.test")).toBeInTheDocument();
    expect(screen.getByText("librarian:https://lib.test")).toBeInTheDocument();
    expect(screen.getByText("playPrize:https://prize.test")).toBeInTheDocument();
  });
});
