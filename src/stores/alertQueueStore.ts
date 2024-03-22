import { create } from 'zustand'

export type QueuedMessage = {
  value: number,
  author: string,
  message: string,
  valueFormatted: string,
  textToSpeechAudioURL: string | null
};

type AlertQueueStore = {
  queue: QueuedMessage[],
  isPaused: boolean,
  setIsPaused: (isPaused: boolean) => void,
  push: (message: QueuedMessage) => void,
  pop: () => QueuedMessage | null
};

export const useAlertQueueStore = create<AlertQueueStore>()((set, get) => ({
  queue: [],
  isPaused: false,
  setIsPaused: (isPaused: boolean) => set(() => ({ isPaused })),
  push: (message: QueuedMessage) => {
    set((state) => ({ queue: [...state.queue, message]}));
  },
  pop: () => {
    const state = get();
    if (state.queue.length === 0)
      return null;

    const ret = state.queue[0];
    set((state) => ({ queue: state.queue.slice(1) }));
    return ret;
  }
}));