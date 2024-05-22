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
      <div className="flex flex-col items-center justify-center h-screen lg:hidden">
        <h1 className="text-2xl font-bold">PPTXGenJS Visual Editor Code Generator</h1>
        <span className="text-sm font-light">You need a bigger screen to use this app</span>
      </div>

    </main>
  );
}
