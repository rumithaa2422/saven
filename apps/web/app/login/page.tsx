import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="grid w-full max-w-5xl grid-cols-[1.1fr_0.9fr] overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <div className="ai-gradient p-10">
          <div className="flex items-center gap-3 text-slate-950">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white"><ShieldCheck className="h-6 w-6" /></div>
            <div>
              <div className="font-bold">Saven InfraOps</div>
              <div className="text-xs text-slate-500">Command Center</div>
            </div>
          </div>
          <h1 className="mt-16 max-w-md text-4xl font-bold tracking-tight text-slate-950">AI-first operations control for Admin, Infra, DevOps, and InfoSec.</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">Use custom Saven login or Microsoft login. Connect real auth in the API configuration before shared use.</p>
        </div>
        <div className="p-10">
          <h2 className="text-2xl font-bold text-slate-950">Sign in</h2>
          <form className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">Email</label>
              <input className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-300" defaultValue="admin@saven.in" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Password</label>
              <input className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-300" type="password" defaultValue="Admin@12345" />
            </div>
            <button className="h-12 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white" type="button">Custom Saven Login</button>
            <button className="h-12 w-full rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700" type="button">Continue with Microsoft</button>
          </form>
        </div>
      </section>
    </main>
  );
}
