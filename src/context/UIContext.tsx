"use client";

/**
 * UIContext — lightweight global UI state (modal, drawers, etc.)
 * Complements the Redux ui slice for component-level UI state.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

interface ModalConfig {
  title?:     string;
  content:    ReactNode;
  onConfirm?: () => void;
  onCancel?:  () => void;
}

interface UIContextValue {
  isModalOpen:   boolean;
  modalConfig:   ModalConfig | null;
  openModal:     (config: ModalConfig) => void;
  closeModal:    () => void;
  isDrawerOpen:  boolean;
  openDrawer:    () => void;
  closeDrawer:   () => void;
}

/* ── State & reducer ────────────────────────────────────────── */
interface UIState {
  modal:  { open: boolean; config: ModalConfig | null };
  drawer: { open: boolean };
}

type UIAction =
  | { type: "OPEN_MODAL"; payload: ModalConfig }
  | { type: "CLOSE_MODAL" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" };

const initialState: UIState = {
  modal:  { open: false, config: null },
  drawer: { open: false },
};

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case "OPEN_MODAL":  return { ...state, modal: { open: true,  config: action.payload } };
    case "CLOSE_MODAL": return { ...state, modal: { open: false, config: null } };
    case "OPEN_DRAWER": return { ...state, drawer: { open: true } };
    case "CLOSE_DRAWER":return { ...state, drawer: { open: false } };
    default:            return state;
  }
}

/* ── Context ────────────────────────────────────────────────── */
const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const openModal   = useCallback((config: ModalConfig) => dispatch({ type: "OPEN_MODAL", payload: config }), []);
  const closeModal  = useCallback(() => dispatch({ type: "CLOSE_MODAL" }), []);
  const openDrawer  = useCallback(() => dispatch({ type: "OPEN_DRAWER" }), []);
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), []);

  const value = useMemo<UIContextValue>(
    () => ({
      isModalOpen:  state.modal.open,
      modalConfig:  state.modal.config,
      openModal,
      closeModal,
      isDrawerOpen: state.drawer.open,
      openDrawer,
      closeDrawer,
    }),
    [state, openModal, closeModal, openDrawer, closeDrawer]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within <UIProvider>");
  return ctx;
}

export default UIContext;
