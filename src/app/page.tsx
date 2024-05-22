"use client"
import { generateCode } from "@/lib/code";
import { useState } from "react";
import { Rnd } from 'react-rnd';



export default function Home() {
  const [elements, setElements] = useState<PptElement[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const addElement = (type: PptElement['type']) => {
    const newElement: PptElement = { id: Date.now(), type, x: 50, y: 50, width: 100, height: 50 };
    setElements([...elements, newElement]);
  };

  const updateElement = (id: number, x: number, y: number, width: number, height: number) => {
    setElements(elements.map(el => el.id === id ? { ...el, x, y, width, height } : el));
  };

  const handleGenerate = async () => {
    const slides = elements.map(element => ({
      type: element.type,
      options: { x: element.x, y: element.y, w: element.width, h: element.height }
    }));
    const generatedCode = await generateCode(elements);

    setGeneratedCode(generatedCode);
  };

  return (
    <main className="w-screen h-screen">
      <div className="flex flex-col items-center">
        <div className="flex space-x-4 my-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => addElement('rect')}>Add Rectangle</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => addElement('text')}>Add Text</button>
        </div>
        <div className="relative bg-gray-200" style={{ width: '960px', height: '540px' }}>
          {elements.map(el => (
            <Rnd
              key={el.id}
              size={{ width: el.width, height: el.height }}
              position={{ x: el.x, y: el.y }}
              onDragStop={(e, d) => updateElement(el.id, d.x, d.y, el.width, el.height)}
              onResizeStop={(e, direction, ref, delta, position) => {
                updateElement(el.id, position.x, position.y, ref.offsetWidth, ref.offsetHeight);
              }}
              bounds="parent"
            >
              <div className="border border-black bg-white flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                {el.type === 'text' ? 'Text' : 'Rectangle'}
              </div>
            </Rnd>
          ))}
        </div>
        <button className="bg-red-500 text-white px-4 py-2 rounded my-4" onClick={handleGenerate}>Generate Code</button>
        {generatedCode && (
          <div className="mt-4 p-4 bg-gray-100 rounded w-full max-w-2xl">
            <h3 className="text-lg font-semibold">Generated Code:</h3>
            <pre className="bg-gray-200 p-2 rounded overflow-x-auto">
              {generatedCode}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
