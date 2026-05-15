"use server"

import Footer from '../(ui)/Footer/Footer';
import Header from '../(ui)/Header/Header';
import SignUp from '../(ui)/SignUp/SignUp';
import userIam from '../actions/userIam';
 
export default async function Page() {
  const user = await userIam();

  return (
    <>
      <Header user={user} />
      <SignUp />
      <Footer />
    </>
  )
}