"use client"

import clsx from 'clsx';
import { signin } from '../../actions/signin';
import { useActionState } from 'react';

export default function SignIn() {
  const [state, action, pending] = useActionState(signin, undefined)
  return (
    <div
      className="
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
        Sign In
      </h2>
      <p className="text-center text-[16px] my-5.25">
        Sign in with email
      </p>
      <form
        className='w-full'
        action={action}
        method='POST'
        encType='multipart/form-data'
      >
        <div className={"mb-8 flex gap-8 justify-between"}>
          <input
            className="p-3 w-full bg-transparent border-2"
            id="email"
            name="email"
            placeholder="Email"
          />
        </div>
        {state?.errors?.email && <p>{state.errors.email}</p>}
      
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
        {state?.message && (
          <div>
            Неверный адрес email или пароль
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
          type="submit"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}