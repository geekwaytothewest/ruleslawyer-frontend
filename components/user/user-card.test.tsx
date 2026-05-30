import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserCard from "@/components/user/user-card";
import frontendFetch from "@/utilities/frontendFetch";
import usePermissions from "@/utilities/swr/usePermissions";
import type { UserPermissionRow } from "@/types/models";

jest.mock("@/utilities/swr/useAuth", () => ({
  useAuth: () => ({ data: { token: "tok", user: { email: "u@test.dev" } } }),
}));
jest.mock("@/utilities/frontendFetch", () => jest.fn());
jest.mock("@/utilities/swr/usePermissions");
jest.mock("@/components/user/user-modal", () => ({ __esModule: true, default: () => null }));

const fetchMock = frontendFetch as jest.Mock;
const usePermissionsMock = usePermissions as jest.Mock;

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

function makeUser(over: Partial<UserPermissionRow> = {}): UserPermissionRow {
  return {
    id: 1,
    userId: 1,
    organizationId: 7,
    admin: false,
    geekGuide: false,
    readOnly: false,
    attendee: false,
    user: { id: 1, name: "Ada Lovelace", email: "ada@test.dev" },
    conventions: [],
    ...over,
  } as UserPermissionRow;
}

describe("UserCard — display", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    usePermissionsMock.mockReset();
    mockPermissions();
  });

  it("renders the user's name and email", async () => {
    render(<UserCard userIn={makeUser()} onDeleted={jest.fn()} userType="organization" />);
    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("ada@test.dev")).toBeInTheDocument();
  });

  it("falls back to placeholders for an empty name and email", async () => {
    render(
      <UserCard
        userIn={makeUser({ user: { id: 1, name: "", email: "" } as UserPermissionRow["user"] })}
        onDeleted={jest.fn()}
        userType="organization"
      />
    );
    expect(await screen.findAllByText("[unknown user]")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Edit user" })).toBeInTheDocument();
  });

  it("composes organization role labels joined by pipes", async () => {
    render(
      <UserCard
        userIn={makeUser({ admin: true, geekGuide: true, readOnly: true })}
        onDeleted={jest.fn()}
        userType="organization"
      />
    );
    expect(await screen.findByText("Admin | Geek Guide | Read Only")).toBeInTheDocument();
  });

  it("includes the Attendee label for convention users", async () => {
    render(
      <UserCard
        userIn={makeUser({ admin: false, attendee: true, geekGuide: true })}
        onDeleted={jest.fn()}
        userType="convention"
      />
    );
    expect(await screen.findByText("Attendee | Geek Guide")).toBeInTheDocument();
  });
});

describe("UserCard — delete action", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    usePermissionsMock.mockReset();
  });

  it("hides the delete button when the viewer is read-only", async () => {
    mockPermissions({ superAdmin: false });
    render(<UserCard userIn={makeUser()} onDeleted={jest.fn()} userType="organization" />);
    await screen.findByText("Ada Lovelace");
    expect(screen.queryByRole("button", { name: /Delete/ })).not.toBeInTheDocument();
  });

  it("deletes an organization user after confirmation and notifies the parent", async () => {
    mockPermissions({ superAdmin: true });
    fetchMock.mockResolvedValue({ ok: true });
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);
    const onDeleted = jest.fn();

    render(<UserCard userIn={makeUser({ id: 55 })} onDeleted={onDeleted} userType="organization" />);
    await userEvent.click(await screen.findByRole("button", { name: "Delete Ada Lovelace" }));

    expect(fetchMock).toHaveBeenCalledWith("DELETE", "/userOrgPerm/55", {}, "tok");
    await waitFor(() => expect(onDeleted).toHaveBeenCalledTimes(1));
    confirmSpy.mockRestore();
  });

  it("does not delete when the confirmation is dismissed", async () => {
    mockPermissions({ superAdmin: true });
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);
    const onDeleted = jest.fn();

    render(<UserCard userIn={makeUser()} onDeleted={onDeleted} userType="organization" />);
    await userEvent.click(await screen.findByRole("button", { name: "Delete Ada Lovelace" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(onDeleted).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it("targets the convention endpoint for convention users", async () => {
    mockPermissions({ superAdmin: true });
    fetchMock.mockResolvedValue({ ok: true });
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<UserCard userIn={makeUser({ id: 88 })} onDeleted={jest.fn()} userType="convention" />);
    await userEvent.click(await screen.findByRole("button", { name: "Delete Ada Lovelace" }));

    expect(fetchMock).toHaveBeenCalledWith("DELETE", "/userConPerm/88", {}, "tok");
    confirmSpy.mockRestore();
  });
});
