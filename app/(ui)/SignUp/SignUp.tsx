"use client"

import { signup } from '@/app/actions/signup'
import { useActionState } from 'react'
 
export default function SignUp() {
  const [state, action, pending] = useActionState(signup, undefined)
  return (
    <div className="
        flex
        flex-col
        w-100
        bg-[rgb(255,255,100)]
        bg-[linear-gradient(rgb(255,255,178)0%,rgb(255,255,100)39.9%)]
        text-blue-950
        m-8
        py-12
        px-6
      "
    >
      <h2
        className="text-center text-[48px]"
      >
        Sign Up
      </h2>
      <p className="text-center text-[16px] my-5.25">
        Join millions of contributors & drop knowledge about your favorite songs
      </p>
      <form
        className="w-full"
        action={action}
      >
        <div className={"mb-8 flex gap-8 justify-between"}>
          <input
            className="p-3 w-full bg-transparent border-2"
            id="name"
            name="name"
            placeholder="Name"
          />
        </div>
        {state?.errors?.name && <p className="my-4">{state.errors.name}</p>}
      
        <div className={"mb-8 flex gap-8 justify-between"}>
          <input
            className="p-3 w-full bg-transparent border-2"
            id="email"
            name="email"
            placeholder="Email"
          />
        </div>
        {state?.errors?.email && <p className="my-4">{state.errors.email}</p>}
      
        <div className={"mb-4 flex gap-8 justify-between"}>
          <input
            className="p-3 w-full bg-transparent border-2"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
          />
        </div>
        {state?.errors?.password && (
          <div className="my-4">
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          className="
            gap-8
            relative
            flex
            flex-row
            items-center
            justify-center
            mx-auto
            h-8
            w-26
            bg-transparent
            px-4
            py-2
            mt-4
            rounded-2xl
            border
            border-black
            cursor-pointer
            hover:bg-black
            hover:text-white
            transition-colors
          "
          disabled={pending}
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}