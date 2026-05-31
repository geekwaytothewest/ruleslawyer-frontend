import { render, screen, waitFor } from "@testing-library/react";
import { useParams, usePathname } from "next/navigation";
import ConventionLayout from "@/app/dashboard/convention/[conId]/layout";
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

const convention = { id: 5, name: "GeekWay 2026" };
const collection = { id: 3, name: "Strategy" };

function routeFetch() {
  fetchMock.mockImplementation((_m: string, url: string) => {
    if (url.startsWith("/con/")) return Promise.resolve({ json: async () => convention });
    if (url.startsWith("/collection/")) return Promise.resolve({ json: async () => collection });
    return Promise.resolve({ json: async () => ({}) });
  });
}

describe("ConventionLayout", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    useParamsMock.mockReset();
    usePathnameMock.mockReset();
    routeFetch();
    usePathnameMock.mockReturnValue("/dashboard/convention/5");
  });

  it("stays in a loading state until the convention resolves", () => {
    // No conId -> the convention fetch never fires.
    useParamsMock.mockReturnValue({});
    render(<ConventionLayout>child</ConventionLayout>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the convention breadcrumb and children once loaded", async () => {
    useParamsMock.mockReturnValue({ conId: "5" });
    render(<ConventionLayout>child content</ConventionLayout>);

    expect(
      await screen.findByRole("link", { name: "GeekWay 2026" })
    ).toHaveAttribute("href", "/dashboard/convention/5");
    expect(screen.getByText("child content")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("GET", "/con/5", null, "tok");
  });

  it("adds the Collections breadcrumb on a collection route", async () => {
    useParamsMock.mockReturnValue({ conId: "5" });
    usePathnameMock.mockReturnValue("/dashboard/convention/5/collections");
    render(<ConventionLayout>child</ConventionLayout>);
    expect(
      await screen.findByRole("link", { name: "Collections" })
    ).toBeInTheDocument();
  });

  it("adds the collection-name breadcrumb (and fetches it) when a colId is present", async () => {
    useParamsMock.mockReturnValue({ conId: "5", colId: "3" });
    usePathnameMock.mockReturnValue("/dashboard/convention/5/collection/3");
    render(<ConventionLayout>child</ConventionLayout>);

    expect(
      await screen.findByRole("link", { name: "Strategy" })
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith("GET", "/collection/3", null, "tok")
    );
  });
});
