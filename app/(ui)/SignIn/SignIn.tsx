"use client"

import clsx from 'clsx';
import { signin } from '../../actions/signin';
import { useActionState } from 'react';

export default function SignIn() {
  const [state, action, pending] = useActionState(signin, undefined)
  return (
    <div className="flex flex-1 flex-col">
      <form
        action={action}
        className={clsx(
          "flex",
          "flex-col",
          "bg-cyan-300",
          "text-blue-950",
          "m-8",
          "p-8"
        )}
        method='POST'
        encType='multipart/form-data'
      >
        <div className={clsx("mb-8", "flex", "gap-8", "justify-between")}>
          <label htmlFor="email">Email</label>
          <input className="border-2" id="email" name="email" placeholder="Email" />
        </div>
        {state?.errors?.email && <p>{state.errors.email}</p>}
      
        <div className={clsx("mb-8", "flex", "gap-8", "justify-between")}>
          <label htmlFor="password">Password</label>
          <input className="border-2" id="password" name="password" type="password" />
        </div>
        {state?.errors?.password && (
          <div>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        {state?.message && (
          <div>
            Неверный адрес email или пароль
          </div>
        )}
        <button className={clsx("mb-8", "flex", "gap-8")} type="submit">
          Sign In
        </button>
      </form>
    </div>
  )
}