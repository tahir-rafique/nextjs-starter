import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Header from "@/components/common/Header";

/* ── Mock auth context ──────────────────────────────────────── */
const mockLogout = jest.fn();
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user:    { id: "1", name: "Jane Doe", email: "jane@example.com", image: null, role: "user" },
    logout:  mockLogout,
    isAuthenticated: true,
  }),
}));

/* ── Mock Redux dispatch ────────────────────────────────────── */
const mockDispatch = jest.fn();
jest.mock("@/store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (s: unknown) => unknown) =>
    selector({ ui: { sidebarOpen: true, theme: "light" } }),
}));

/* ── Mock next-themes ───────────────────────────────────────── */
jest.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: jest.fn() }),
}));

describe("Header", () => {
  it("renders the app name", () => {
    render(<Header />);
    // NEXT_PUBLIC_APP_NAME is not set in test env, so fallback shows
    expect(screen.getByText(/app/i)).toBeInTheDocument();
  });

  it("renders user initials when no image", () => {
    render(<Header />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("calls logout on sign-out click", async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByText(/sign out/i));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("dispatches toggleSidebar when hamburger is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByLabelText(/toggle sidebar/i));
    expect(mockDispatch).toHaveBeenCalled();
  });
});
