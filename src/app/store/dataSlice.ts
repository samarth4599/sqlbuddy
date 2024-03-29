// dataStore.ts
import { StateCreator } from "zustand";
import { ThemeSlice } from "./themeSlice";
import { TScreenState, TTableData } from "../constants/interfaces";

// Define the store state
export interface DataSlice {
  data: TTableData;
  setData: (data: TTableData) => void;
  history: string[];
  setHistory: (text: string) => void;
  clearHistory: () => void;
  state: TScreenState;
  setState: (state: TScreenState) => void;
}

const createDataSlice: StateCreator<
  DataSlice & ThemeSlice,
  [],
  [],
  DataSlice
> = (set) => ({
  data: [],
  setData: (data: TTableData) => set({ data }),
  history: [],
  setHistory: (text: string) =>
    set((state) => ({
      history: state.history.includes(text)
        ? state.history
        : [text, ...state.history],
    })),
  clearHistory: () => set({ history: [] }),
  state: "success",
  setState: (state: TScreenState) => set({ state }),
});

export default createDataSlice;
