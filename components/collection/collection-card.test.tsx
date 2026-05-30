import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CollectionCard from "@/components/collection/collection-card";
import frontendFetch from "@/utilities/frontendFetch";
import usePermissions from "@/utilities/swr/usePermissions";
import type { CollectionWithCount } from "@/types/models";

jest.mock("@/utilities/swr/useAuth", () => ({
  useAuth: () => ({ data: { token: "tok", user: { email: "u@test.dev" } } }),
}));
jest.mock("@/utilities/frontendFetch", () => jest.fn());
jest.mock("@/utilities/swr/usePermissions");
jest.mock("@/components/collection/collection-modal", () => ({ __esModule: true, default: () => null }));

const fetchMock = frontendFetch as jest.Mock;
const usePermissionsMock = usePermissions as jest.Mock;

function mockPermissions(opts: { superAdmin?: boolean } = {}) {
  usePermissionsMock.mockReturnValue({
    permissions: {
      user: { data: { superAdmin: opts.superAdmin ?? false } },
      organizations: { data: [] },
      conventions: { data: [] },
    },
    isLoading: false,
    isError: {},
  });
}

function makeCollection(over: Partial<CollectionWithCount> = {}): CollectionWithCount {
  return {
    id: 1,
    name: "Strategy Games",
    organizationId: 7,
    public: true,
    allowWinning: false,
    archived: false,
    _count: { copies: 0, conventions: 0 },
    conventions: [],
    ...over,
  };
}

describe("CollectionCard — display", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    usePermissionsMock.mockReset();
    mockPermissions();
  });

  it("renders the collection name and copy count", async () => {
    render(
      <CollectionCard
        collectionIn={makeCollection({ _count: { copies: 12, conventions: 0 } })}
        onDeleted={jest.fn()}
      />
    );
    expect(await screen.findByText("Strategy Games")).toBeInTheDocument();
    expect(screen.getByText("Copies: 12")).toBeInTheDocument();
  });

  it("falls back to a placeholder name when empty", async () => {
    render(<CollectionCard collectionIn={makeCollection({ name: "" })} onDeleted={jest.fn()} />);
    expect(await screen.findByText("[unknown collection]")).toBeInTheDocument();
  });

  it("marks archived collections with a lock and no edit button", async () => {
    mockPermissions({ superAdmin: true });
    render(<CollectionCard collectionIn={makeCollection({ archived: true })} onDeleted={jest.fn()} />);
    expect(await screen.findByLabelText("Archived collection")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Edit/ })).not.toBeInTheDocument();
  });

  it("shows a trophy when the collection allows winning", async () => {
    render(<CollectionCard collectionIn={makeCollection({ allowWinning: true })} onDeleted={jest.fn()} />);
    expect(await screen.findByLabelText("Allows winning copies")).toBeInTheDocument();
  });
});

describe("CollectionCard — routing", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    usePermissionsMock.mockReset();
  });

  it("links read-only viewers to the public collection route", async () => {
    mockPermissions({ superAdmin: false });
    render(<CollectionCard collectionIn={makeCollection({ id: 9 })} onDeleted={jest.fn()} />);
    await screen.findByText("Strategy Games");
    expect(screen.getByRole("link")).toHaveAttribute("href", "/dashboard/collection/9");
  });

  it("links editors to the org-scoped collection route", async () => {
    mockPermissions({ superAdmin: true });
    render(
      <CollectionCard collectionIn={makeCollection({ id: 9, organizationId: 7 })} onDeleted={jest.fn()} />
    );
    await screen.findByText("Strategy Games");
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/dashboard/organization/7/collection/9"
    );
  });
});

describe("CollectionCard — admin actions", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    usePermissionsMock.mockReset();
    mockPermissions({ superAdmin: true });
  });

  it("offers the edit button to editors of a non-archived collection", async () => {
    render(<CollectionCard collectionIn={makeCollection()} onDeleted={jest.fn()} />);
    expect(await screen.findByRole("button", { name: "Edit Strategy Games" })).toBeInTheDocument();
  });

  it("only allows deletion of an empty collection", async () => {
    const { rerender } = render(
      <CollectionCard
        collectionIn={makeCollection({ _count: { copies: 3, conventions: 0 } })}
        onDeleted={jest.fn()}
      />
    );
    await screen.findByText("Strategy Games");
    expect(screen.queryByRole("button", { name: /^Delete/ })).not.toBeInTheDocument();

    rerender(
      <CollectionCard
        collectionIn={makeCollection({ _count: { copies: 0, conventions: 0 } })}
        onDeleted={jest.fn()}
      />
    );
    expect(await screen.findByRole("button", { name: "Delete Strategy Games" })).toBeInTheDocument();
  });

  it("deletes a collection after confirmation and notifies the parent", async () => {
    fetchMock.mockResolvedValue({ ok: true });
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);
    const onDeleted = jest.fn();

    render(<CollectionCard collectionIn={makeCollection({ id: 9 })} onDeleted={onDeleted} />);
    await userEvent.click(await screen.findByRole("button", { name: "Delete Strategy Games" }));

    expect(fetchMock).toHaveBeenCalledWith("DELETE", "/collection/9", {}, "tok");
    await waitFor(() => expect(onDeleted).toHaveBeenCalledTimes(1));
    confirmSpy.mockRestore();
  });

  it("detaches a collection from its convention when a conventionId is given", async () => {
    fetchMock.mockResolvedValue({ ok: true });
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);
    const onDeleted = jest.fn();

    render(
      <CollectionCard
        collectionIn={makeCollection({ id: 9 })}
        conventionId={4}
        onDeleted={onDeleted}
      />
    );
    await userEvent.click(await screen.findByRole("button", { name: "Detach Strategy Games" }));

    expect(fetchMock).toHaveBeenCalledWith(
      "DELETE",
      "/con/4/conventionCollection/9",
      {},
      "tok"
    );
    await waitFor(() => expect(onDeleted).toHaveBeenCalledTimes(1));
    confirmSpy.mockRestore();
  });
});
