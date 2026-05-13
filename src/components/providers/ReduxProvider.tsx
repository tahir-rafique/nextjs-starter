"use client";

import { useRef } from "react";
import { Provider } from "react-redux";

import { store } from "@/store";

/**
 * Wraps the app in the Redux store Provider.
 * Uses a ref to ensure the store is only created once per render tree.
 */
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef(store);
  return <Provider store={storeRef.current}>{children}</Provider>;
}
