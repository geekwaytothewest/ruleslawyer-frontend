import { render, screen, waitFor } from "@testing-library/react";
import { useParams, usePathname } from "next/navigation";
import OrganizationLayout from "@/app/dashboard/organization/[orgId]/layout";
import frontendFetch from "@/utilities/frontendFetch";

jest.mock("@/utilities/swr/useAuth", () => ({
  useAuth: () => ({ data: { token: "tok", user: { email: "u@test.dev" } } }),
}));
jest.mock("@/utilities/frontendFetch", () => jest.fn());
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  usePathname: jest.fn(),
}));

const fetchMock = frontendFetch as jest.Mock;
const useParamsMock = useParams as jest.Mock;
const usePathnameMock = usePathname as jest.Mock;

const org = { id: 7, name: "GeekWay" };
const convention = { id: 5, name: "GeekWay 2026" };
const collection = { id: 3, name: "Strategy" };

// Resolve each entity by the URL the layout requests.
function routeFetch() {
  fetchMock.mockImplementation((_m: string, url: string) => {
    if (url.startsWith("/org/")) return Promise.resolve({ json: async () => org });
    if (url.startsWith("/con/")) return Promise.resolve({ json: async () => convention });
    if (url.startsWith("/collection/")) return Promise.resolve({ json: async () => collection });
    return Promise.resolve({ json: async () => ({}) });
  });
}

describe("OrganizationLayout", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    useParamsMock.mockReset();
    usePathnameMock.mockReset();
    routeFetch();
    usePathnameMock.mockReturnValue("/dashboard/organization/7");
  });

  it("shows a loading state until the organization resolves", () => {
    // No orgId param -> the org fetch never fires, so it stays loading.
    useParamsMock.mockReturnValue({});
    render(<OrganizationLayout>child</OrganizationLayout>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the org breadcrumb and children once loaded", async () => {
    useParamsMock.mockReturnValue({ orgId: "7" });
    render(<OrganizationLayout>child content</OrganizationLayout>);

    expect(await screen.findByRole("link", { name: "GeekWay" })).toHaveAttribute(
      "href",
      "/dashboard/organization/7"
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("GET", "/org/7", null, "tok");
  });

  it("adds the Users breadcrumb on a users route", async () => {
    useParamsMock.mockReturnValue({ orgId: "7" });
    usePathnameMock.mockReturnValue("/dashboard/organization/7/users");
    render(<OrganizationLayout>child</OrganizationLayout>);
    expect(await screen.findByRole("link", { name: "Users" })).toBeInTheDocument();
  });

  it("adds the Conventions and Games breadcrumbs on matching routes", async () => {
    useParamsMock.mockReturnValue({ orgId: "7" });
    usePathnameMock.mockReturnValue("/dashboard/organization/7/games");
    render(<OrganizationLayout>child</OrganizationLayout>);
    expect(await screen.findByRole("link", { name: "Games" })).toBeInTheDocument();
  });

  it("adds the convention breadcrumb (and fetches it) when a conId is present", async () => {
    useParamsMock.mockReturnValue({ orgId: "7", conId: "5" });
    usePathnameMock.mockReturnValue(
      "/dashboard/organization/7/convention/5"
    );
    render(<OrganizationLayout>child</OrganizationLayout>);

    expect(
      await screen.findByRole("link", { name: "GeekWay 2026" })
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith("GET", "/con/5", null, "tok")
    );
  });

  it("adds the collection breadcrumb (and fetches it) when a colId is present", async () => {
    useParamsMock.mockReturnValue({ orgId: "7", colId: "3" });
    usePathnameMock.mockReturnValue(
      "/dashboard/organization/7/collection/3"
    );
    render(<OrganizationLayout>child</OrganizationLayout>);

    expect(
      await screen.findByRole("link", { name: "Strategy" })
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith("GET", "/collection/3", null, "tok")
    );
  });
});
