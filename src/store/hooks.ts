/**
 * Typed Redux hooks — always import from here, not from react-redux directly.
 */
import { useDispatch, useSelector, useStore } from "react-redux";

import type { AppDispatch, RootState } from "./index";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore    = useStore.withTypes<ReturnType<typeof import("./index").store.getState>>();
