import { render, screen } from "@testing-library/react";
import UserGrid from "@/components/user/user-grid";
import frontendFetch from "@/utilities/frontendFetch";
import usePermissions from "@/utilities/swr/usePermissions";
import type { UserPermissionRow } from "@/types/models";

jest.mock("@/utilities/swr/useAuth", () => ({
  useAuth: () => ({ data: { token: "tok", user: { email: "u@test.dev" } } }),
}));
jest.mock("@/utilities/frontendFetch", () => jest.fn());
jest.mock("@/utilities/swr/usePermissions");
jest.mock("@/components/user/user-modal", () => ({ __esModule: true, default: () => null }));
// Stub UserCard so we can observe order without its own fetch/permission logic.
jest.mock("@/components/user/user-card", () => ({
  __esModule: true,
  default: ({ userIn }: { userIn: UserPermissionRow }) => (
    <div data-testid="user-card">{userIn.user.name}</div>
  ),
}));

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

function makeUser(id: number, name: string): UserPermissionRow {
  return {
    id,
    userId: id,
    organizationId: 7,
    admin: false,
    geekGuide: false,
    user: { id, name, email: `${name}@test.dev` },
  } as UserPermissionRow;
}

describe("UserGrid", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    usePermissionsMock.mockReset();
    mockPermissions();
  });

  it("sorts users alphabetically by name", () => {
    const users = [makeUser(1, "Charlie"), makeUser(2, "Alice"), makeUser(3, "Bob")];
    render(<UserGrid usersIn={users} organizationId={7} userType="organization" />);

    const names = screen.getAllByTestId("user-card").map((n) => n.textContent);
    expect(names).toEqual(["Alice", "Bob", "Charlie"]);
  });

  it("renders one card per user", () => {
    const users = [makeUser(1, "Alice"), makeUser(2, "Bob")];
    render(<UserGrid usersIn={users} organizationId={7} userType="organization" />);
    expect(screen.getAllByTestId("user-card")).toHaveLength(2);
  });

  it("hides the add-user button from read-only viewers", () => {
    mockPermissions({ superAdmin: false });
    render(<UserGrid usersIn={[]} organizationId={7} userType="organization" />);
    expect(screen.queryByRole("button", { name: "Add User" })).not.toBeInTheDocument();
  });

  it("shows the add-user button to super admins", () => {
    mockPermissions({ superAdmin: true });
    render(<UserGrid usersIn={[]} organizationId={7} userType="organization" />);
    expect(screen.getByRole("button", { name: "Add User" })).toBeInTheDocument();
  });

  it("fetches organization users when none are passed in", async () => {
    fetchMock.mockResolvedValue({ json: async () => [makeUser(1, "Alice")] });
    render(<UserGrid organizationId={7} userType="organization" />);

    expect(await screen.findByTestId("user-card")).toHaveTextContent("Alice");
    expect(fetchMock).toHaveBeenCalledWith(
      "GET",
      "/userOrgPerm/organization/7",
      null,
      "tok"
    );
  });
});
