import { create } from "zustand";

// 유저 정보
interface User {
  phoneNumber: string;
  nickname: string;
  profileImageUrl?: string;
}

interface AuthState {
  //로그인된 유저 정보
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;

  // 회원가입 진행 상태
  signupProgress: {
    phoneNumber: string;
    isVerified: boolean;
    profileImage: string | null;
    profileFile: File | null; // 🎯 추가
    nickname: string;
  };

  setSignupPhone: (phone: string) => void;
  setSignupVerified: (verified: boolean) => void;
  setSignupProfile: (imageUrl: string | null, file?: File | null) => void; // 🎯 file 인자 추가
  setSignupNickname: (nickname: string) => void;
  clearSignupProgress: () => void;

  login: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  // 회원가입 임시 초기값
  signupProgress: {
    phoneNumber: "",
    isVerified: false,
    profileImage: null,
    profileFile: null, // 🎯 추가
    nickname: "",
  },

  setSignupPhone: (phone) =>
    set((state) => ({
      signupProgress: { ...state.signupProgress, phoneNumber: phone },
    })),

  setSignupVerified: (verified) =>
    set((state) => ({
      signupProgress: { ...state.signupProgress, isVerified: verified },
    })),

  setSignupProfile: (imageUrl, file = null) =>
    set((state) => ({
      signupProgress: {
        ...state.signupProgress,
        profileImage: imageUrl,
        profileFile: file, // 🎯 File 객체도 같이 저장
      },
    })),

  setSignupNickname: (nickname) =>
    set((state) => ({ signupProgress: { ...state.signupProgress, nickname } })),

  clearSignupProgress: () =>
    set({
      signupProgress: {
        phoneNumber: "",
        isVerified: false,
        profileImage: null,
        profileFile: null, // 🎯 추가
        nickname: "",
      },
    }),

  login: (user, token, refreshToken) => {
    localStorage.setItem("accessToken", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    set({ user, token, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, token: null, isLoggedIn: false });
  },
}));