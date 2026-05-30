import { render, screen } from "@testing-library/react";
import GameCard from "@/components/game/game-card";
import usePermissions from "@/utilities/swr/usePermissions";
import type { CoverArtData, GameWithCopies } from "@/types/models";

jest.mock("@/utilities/swr/useAuth", () => ({
  useAuth: () => ({ data: { token: "tok", user: { email: "u@test.dev" } } }),
}));
jest.mock("@/utilities/frontendFetch", () => jest.fn());
// Isolate GameCard from its (heroui / fetch heavy) children.
jest.mock("@/components/game/game-modal", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/copy/copy-bubbles", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/boardgamegeek/board-game-geek", () => ({ __esModule: true, default: () => null }));
jest.mock("@/utilities/swr/usePermissions");

const usePermissionsMock = usePermissions as jest.Mock;

// Build the permissions shape GameCard reads: user.data.superAdmin and
// organizations.data[].{organizationId, admin}.
function mockPermissions(opts: {
  superAdmin?: boolean;
  orgAdmin?: { organizationId: number; admin: boolean }[];
} = {}) {
  usePermissionsMock.mockReturnValue({
    permissions: {
      user: { data: { superAdmin: opts.superAdmin ?? false } },
      organizations: { data: opts.orgAdmin ?? [] },
      conventions: { data: [] },
    },
    isLoading: false,
    isError: {},
  });
}

function makeGame(over: Partial<GameWithCopies> = {}): GameWithCopies {
  return {
    id: 1,
    organizationId: 7,
    name: "Catan",
    copies: [],
    coverArt: null,
    bggId: null,
    ...over,
  } as unknown as GameWithCopies;
}

describe("GameCard — readOnly access logic", () => {
  beforeEach(() => usePermissionsMock.mockReset());

  it("labels the card 'View' for an archived game even for an admin", async () => {
    mockPermissions({ superAdmin: true });
    render(<GameCard gameIn={makeGame()} gameId={1} archived />);
    expect(
      await screen.findByRole("button", { name: "View Catan" })
    ).toBeInTheDocument();
  });

  it("labels the card 'Edit' for a super admin", async () => {
    mockPermissions({ superAdmin: true });
    render(<GameCard gameIn={makeGame()} gameId={1} />);
    expect(
      await screen.findByRole("button", { name: "Edit Catan" })
    ).toBeInTheDocument();
  });

  it("labels the card 'Edit' for an admin of the game's organization", async () => {
    mockPermissions({ orgAdmin: [{ organizationId: 7, admin: true }] });
    render(<GameCard gameIn={makeGame({ organizationId: 7 })} gameId={1} />);
    expect(
      await screen.findByRole("button", { name: "Edit Catan" })
    ).toBeInTheDocument();
  });

  it("labels the card 'View' for a non-admin of the game's organization", async () => {
    mockPermissions({ orgAdmin: [{ organizationId: 7, admin: false }] });
    render(<GameCard gameIn={makeGame({ organizationId: 7 })} gameId={1} />);
    expect(
      await screen.findByRole("button", { name: "View Catan" })
    ).toBeInTheDocument();
  });
});

describe("GameCard — rendering", () => {
  beforeEach(() => mockPermissions({ superAdmin: true }));

  it("falls back to a placeholder name when the game name is empty", async () => {
    render(<GameCard gameIn={makeGame({ name: "" })} gameId={1} />);
    expect(await screen.findByText("[unknown name]")).toBeInTheDocument();
    // Empty name also feeds the "game" word into the aria-label.
    expect(screen.getByRole("button", { name: "Edit game" })).toBeInTheDocument();
  });

  it("renders the library icon (no img) when there is no cover art", async () => {
    render(<GameCard gameIn={makeGame({ coverArt: null })} gameId={1} />);
    await screen.findByRole("button", { name: "Edit Catan" });
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("GameCard — cover art decoding", () => {
  beforeEach(() => mockPermissions({ superAdmin: true }));

  it("renders a string cover art straight through as the img src", async () => {
    const coverArt: CoverArtData = "https://cdn.test/cover.png";
    render(<GameCard gameIn={makeGame({ coverArt })} gameId={1} />);
    const img = await screen.findByRole("img", { name: "Catan" });
    expect(img).toHaveAttribute("src", "https://cdn.test/cover.png");
  });

  it("decodes a {type:'Buffer'} payload, sniffing JPEG by magic bytes", async () => {
    // 0xFF 0xD8 is the JPEG start-of-image marker -> default image/jpeg.
    const coverArt: CoverArtData = { type: "Buffer", data: [0xff, 0xd8, 0x01] };
    render(<GameCard gameIn={makeGame({ coverArt })} gameId={1} />);
    const img = await screen.findByRole("img", { name: "Catan" });
    expect(img.getAttribute("src")).toMatch(/^data:image\/jpeg;base64,/);
  });

  it("sniffs PNG magic bytes from a numeric-keyed payload", async () => {
    // 0x89 0x50 ("\x89P") is the PNG signature start.
    const coverArt: CoverArtData = { "0": 0x89, "1": 0x50, "2": 0x4e };
    render(<GameCard gameIn={makeGame({ coverArt })} gameId={1} />);
    const img = await screen.findByRole("img", { name: "Catan" });
    expect(img.getAttribute("src")).toMatch(/^data:image\/png;base64,/);
  });

  it("renders no img for an empty byte payload", async () => {
    const coverArt: CoverArtData = { type: "Buffer", data: [] };
    render(<GameCard gameIn={makeGame({ coverArt })} gameId={1} />);
    await screen.findByRole("button", { name: "Edit Catan" });
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
