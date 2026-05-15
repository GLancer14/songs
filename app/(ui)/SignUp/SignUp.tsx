"use client"

import { signup } from '@/app/actions/signup'
import { useActionState } from 'react'
import s from "./SignUp.module.scss";
import clsx from 'clsx';
 
export default function SignUp() {
  const [state, action, pending] = useActionState(signup, undefined)
  return (
    <div className="flex flex-1 flex-col">
      <form className={clsx(
          "flex",
          "flex-col",
          "bg-cyan-300",
          "text-blue-950",
          "m-8",
          "p-8"
        )} action={action}
      >
        <div className={clsx("mb-8", "flex", "gap-8", "justify-between")}>
          <label htmlFor="name">Name</label>
          <input className="border-2" id="name" name="name" placeholder="Name" />
        </div>
        {state?.errors?.name && <p>{state.errors.name}</p>}
      
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
        <button className={clsx("mb-8", "flex", "gap-8")} disabled={pending} type="submit">
          Sign Up
        </button>
      </form>
    </div>
    
  )
}