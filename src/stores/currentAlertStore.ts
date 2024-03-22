import { create } from 'zustand'

type CurrentAlertStore = {
  currentAlert: any | null,
  isShowingAlert: () => boolean,
  setCurrentAlert: (alert: any | null) => void
};

export const useCurrentAlertStore = create<CurrentAlertStore>()((set, get) => ({
  currentAlert: null,
  isShowingAlert: () => get().currentAlert !== null,
  setCurrentAlert: (alert: any | null) => set({ currentAlert: alert }),
}));