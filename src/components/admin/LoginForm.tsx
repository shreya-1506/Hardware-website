"use client";

import { AlertCircle, Loader2, LogIn } from "lucide-react";
import { useActionState, useState } from "react";

import { loginAction, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = { status: "idle" };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );
  // React resets an uncontrolled form once its action settles, which would
  // clear the email after a failed attempt. Controlling it keeps the address
  // on screen so only the password has to be retyped.
  const [email, setEmail] = useState("");

  return (
    <form action={formAction} className="grid gap-4">
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <label
          htmlFor="admin-email"
          className="mb-1.5 block text-[13px] font-semibold text-navy-800"
        >
          Email address
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@industrialprime.in"
          className="w-full rounded-md border border-steel-300 bg-white px-3.5 py-2.5 text-[15px] text-navy-900 outline-none transition placeholder:text-steel-400 focus:border-navy-400 focus:ring-2 focus:ring-navy-500/15"
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="mb-1.5 block text-[13px] font-semibold text-navy-800"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-md border border-steel-300 bg-white px-3.5 py-2.5 text-[15px] text-navy-900 outline-none transition placeholder:text-steel-400 focus:border-navy-400 focus:ring-2 focus:ring-navy-500/15"
        />
      </div>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.4} />
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-navy-800 text-[15px] font-semibold text-white transition hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
            Signing in…
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" strokeWidth={2.4} />
            Sign in to dashboard
          </>
        )}
      </button>
    </form>
  );
}
