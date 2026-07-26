import { create } from "zustand";

interface GroupState {
  currentGroupId: string | null; // 현재 그룹 ID
  setCurrentGroupId: (groupId: string | null) => void; // 그룹 ID를 변경함수
}

export const useGroupStore = create<GroupState>((set) => ({
  currentGroupId: null,
  setCurrentGroupId: (groupId) => set({ currentGroupId: groupId }),
}));
