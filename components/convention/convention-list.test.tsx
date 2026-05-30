import { render, screen } from "@testing-library/react";
import ConventionList from "@/components/convention/convention-list";
import usePermissions from "@/utilities/swr/usePermissions";
import type { Convention } from "@/types/models";

jest.mock("@/utilities/swr/useAuth", () => ({
  useAuth: () => ({ data: { token: "tok", user: { email: "u@test.dev" } } }),
}));
jest.mock("@/utilities/frontendFetch", () => jest.fn());
jest.mock("@/utilities/swr/usePermissions");
// ConventionInfo fetches its own data; the list only cares about which item is open.
jest.mock("@/components/convention/convention-info", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/convention/convention-modal", () => ({ __esModule: true, default: () => null }));

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

const DAY = 24 * 60 * 60 * 1000;
function isoOffset(days: number): string {
  return new Date(Date.now() + days * DAY).toISOString();
}

function makeConvention(over: { id: number; name: string; start: number; end: number }): Convention {
  return {
    id: over.id,
    name: over.name,
    theme: "Theme",
    startDate: isoOffset(over.start),
    endDate: isoOffset(over.end),
  } as Convention;
}

// heroui renders each AccordionItem as a button carrying aria-expanded.
function expandedNames(): string[] {
  return screen
    .getAllByRole("button")
    .filter((b) => b.getAttribute("aria-expanded") === "true")
    .map((b) => b.textContent ?? "");
}

describe("ConventionList — active convention selection", () => {
  beforeEach(() => {
    usePermissionsMock.mockReset();
    mockPermissions();
  });

  it("opens the convention that is currently running", () => {
    const conventions = [
      makeConvention({ id: 1, name: "PastCon", start: -20, end: -19 }),
      makeConvention({ id: 2, name: "LiveCon", start: -1, end: 1 }),
      makeConvention({ id: 3, name: "FutureCon", start: 10, end: 11 }),
    ];
    render(<ConventionList conventionsIn={conventions} organizationId={7} />);

    expect(expandedNames().join()).toMatch(/LiveCon/);
  });

  it("falls back to a future convention when none are running", () => {
    const conventions = [
      makeConvention({ id: 1, name: "PastCon", start: -20, end: -19 }),
      makeConvention({ id: 2, name: "SoonCon", start: 5, end: 6 }),
    ];
    render(<ConventionList conventionsIn={conventions} organizationId={7} />);

    expect(expandedNames().join()).toMatch(/SoonCon/);
  });

  it("leaves every item collapsed when all conventions are in the past", () => {
    const conventions = [
      makeConvention({ id: 1, name: "OldCon", start: -20, end: -19 }),
      makeConvention({ id: 2, name: "OlderCon", start: -40, end: -39 }),
    ];
    render(<ConventionList conventionsIn={conventions} organizationId={7} />);

    expect(expandedNames()).toHaveLength(0);
  });
});

describe("ConventionList — create button", () => {
  beforeEach(() => usePermissionsMock.mockReset());

  it("hides the create button from read-only viewers", () => {
    mockPermissions({ superAdmin: false });
    render(<ConventionList conventionsIn={[]} organizationId={7} />);
    expect(screen.queryByRole("button", { name: "Create Convention" })).not.toBeInTheDocument();
  });

  it("shows the create button to super admins", () => {
    mockPermissions({ superAdmin: true });
    render(<ConventionList conventionsIn={[]} organizationId={7} />);
    expect(screen.getByRole("button", { name: "Create Convention" })).toBeInTheDocument();
  });
});
