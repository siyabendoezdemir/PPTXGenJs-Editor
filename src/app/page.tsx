"use client"

import { Editor } from "@/components/editor";
import { Navbar } from "@/components/navbar";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  

  return (
    <main className="w-screen h-screen flex flex-col items-center">
      <Navbar />
      <Separator className="w-11/12" />
      <Editor />
    </main>
  );
}
