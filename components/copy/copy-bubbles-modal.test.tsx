import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CopyBubbles from "@/components/copy/copy-bubbles";
import frontendFetch from "@/utilities/frontendFetch";
import usePermissions from "@/utilities/swr/usePermissions";
import { useDisclosure } from "@/utilities/useDisclosure";
import type { GameCopy, GameWithCopies } from "@/types/models";

// Unlike copy-bubbles.test.tsx, this file mounts the REAL CopyModal: the
// regression it guards is about events travelling from the modal's fields up
// through the bubble that renders it, so stubbing the modal would hide it.
jest.mock("@/utilities/swr/useAuth", () => ({
  useAuth: () => ({ data: { token: "tok", user: { email: "u@test.dev" } } }),
}));
jest.mock("@/utilities/frontendFetch", () => jest.fn());
jest.mock("@/utilities/swr/usePermissions");
jest.mock("@/utilities/toastFetchError", () => ({
  toastSaveError: jest.fn(),
  toastNetworkError: jest.fn(),
  toastDeleteError: jest.fn(),
  toastDeleteNetworkError: jest.fn(),
}));

const fetchMock = frontendFetch as jest.Mock;
const usePermissionsMock = usePermissions as jest.Mock;

const copy = {
  id: 1,
  gameId: 10,
  dateAdded: "2026-01-01",
  barcodeLabel: "A-1",
  barcode: "0001",
  dateRetired: null,
  comments: "",
  winnable: false,
  winnerId: null,
  bggVersionOverride: null,
  collectionId: 3,
  organizationId: 7,
  checkOuts: [],
  game: { id: 10, name: "Catan" },
  collection: {
    id: 3,
    name: "Main",
    organizationId: 7,
    public: true,
    allowWinning: false,
    archived: false,
  },
} as unknown as GameCopy;

const game = { id: 10, copies: [copy] } as unknown as GameWithCopies;

// CopyBubbles only reads disclosure.onClose; a stub is enough.
const outerDisclosure = () =>
  ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() } as unknown as ReturnType<
    typeof useDisclosure
  >);

beforeEach(() => {
  fetchMock.mockReset();
  usePermissionsMock.mockReset();
  usePermissionsMock.mockReturnValue({
    permissions: {
      user: { data: { superAdmin: true } },
      organizations: { data: [] },
      conventions: { data: [] },
    },
    isLoading: false,
    isError: {},
  });
  fetchMock.mockImplementation((method: string, url: string) => {
    if (url.includes("/autocomplete")) return Promise.resolve({ json: async () => [] });
    if (url.includes("/collections"))
      return Promise.resolve({ json: async () => [{ id: 3, name: "Main" }] });
    return Promise.resolve({ ok: true, json: async () => ({ copies: [copy] }) });
  });
});

describe("CopyBubbles — modal opened from a bubble", () => {
  // Regression: the bubble is a role="button" that swallows Enter/Space with
  // preventDefault(). While CopyModal was rendered *inside* it, every keystroke
  // in the modal propagated up the React tree (portals don't stop React
  // events), so spaces never reached the copy's text fields.
  it("accepts spaces in the comments field", async () => {
    render(<CopyBubbles game={game} disclosure={outerDisclosure()} />);

    await userEvent.click(await screen.findByRole("button", { name: "Copy A-1" }));

    const comments = await screen.findByLabelText("Comments");
    await userEvent.type(comments, "needs sleeves");
    expect(comments).toHaveValue("needs sleeves");
  });

  it("accepts spaces in the game search field", async () => {
    render(<CopyBubbles game={game} disclosure={outerDisclosure()} />);

    await userEvent.click(await screen.findByRole("button", { name: "Copy A-1" }));

    // The autocomplete's label is shared with its listbox, so target the input
    // by role rather than by label text.
    const gameField = await screen.findByRole("combobox");
    await userEvent.clear(gameField);
    await userEvent.type(gameField, "Ticket to Ride");
    expect(gameField).toHaveValue("Ticket to Ride");
  });
});
