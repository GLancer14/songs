"use server"

import Footer from '../(ui)/Footer/Footer';
import Header from '../(ui)/Header/Header';
import SignIn from '../(ui)/SignIn/SignIn';
import userIam from '../actions/userIam';
 
export default async function Page() {
  const user = await userIam();

  return (
    <>
      <Header user={user} />
      <SignIn />
      <Footer />
    </>
  )
}