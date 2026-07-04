import { AppLayout } from "./layouts/AppLayout";

function App() {
  return (
    <AppLayout>
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-brand-main">V_O 프로젝트 세팅</h1>
        <p className="mt-2 text-sm text-slate-500">모바일 dvh 프레임 및 보라색 테마</p>
        <button className="mt-6 w-full rounded-xl bg-brand-main py-3 font-semibold text-white hover:bg-brand-dark transition-colors">
          공동 보라색 버튼 샘플
        </button>
      </div>
    </AppLayout>
  );
}

export default App;