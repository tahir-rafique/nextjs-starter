import "@testing-library/jest-dom";

/* ── Global mocks ──────────────────────────────────────── */

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter:       jest.fn(() => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() })),
  usePathname:     jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  redirect:        jest.fn(),
}));

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession:      jest.fn(() => ({ data: null, status: "unauthenticated" })),
  signIn:          jest.fn(),
  signOut:         jest.fn(),
  // Avoid JSX in setup file — use createElement so no React import is needed
  SessionProvider: ({ children }: { children: unknown }) => children,
}));

// Mock next/image — use createElement to avoid JSX/React scope issues
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: Record<string, any>) => {
    const { createElement } = require("react");
    // eslint-disable-next-line jsx-a11y/alt-text
    return createElement("img", props);
  },
}));

// Mock next/font/google
jest.mock("next/font/google", () => ({
  Inter: () => ({ className: "mock-inter", variable: "--font-sans" }),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe:    jest.fn(),
  unobserve:  jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe:    jest.fn(),
  unobserve:  jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches:         false,
    media:           query,
    onchange:        null,
    addListener:     jest.fn(),
    removeListener:  jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent:   jest.fn(),
  })),
});
