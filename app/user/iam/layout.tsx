import type { Metadata } from "next";
import { Geist, Geist_Mono, MedievalSharp } from "next/font/google";
import "../../globals.css";
import { Suspense } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <Suspense>
        {children}
      </Suspense>
    </section>
  );
}
