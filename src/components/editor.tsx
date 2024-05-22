"use client"
import { generateCode } from "@/lib/code";
import { ChangeEvent, useState } from "react";
import { Rnd } from 'react-rnd';
import PptxGenJS from 'pptxgenjs';

export function Editor() {
    const [elements, setElements] = useState<PptElement[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const addElement = (type: PptElement['type'], src?: string) => {
    const newElement: PptElement = { id: Date.now(), type, x: 50, y: 50, width: 100, height: 50, src };
    setElements([...elements, newElement]);
  };

  const updateElement = (id: number, x: number, y: number, width: number, height: number) => {
    setElements(elements.map(el => el.id === id ? { ...el, x, y, width, height } : el));
  };

  const deleteElement = (id: number) => {
    setElements(elements.filter(el => el.id !== id));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        addElement('image', src);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    const slides = elements.map(element => ({
      type: element.type,
      options: { x: element.x, y: element.y, w: element.width, h: element.height }
    }));
    const generatedCode = await generateCode(elements);

    setGeneratedCode(generatedCode);
  };

  const downloadPresentation = () => {
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();

    elements.forEach(element => {
      if (element.type === 'rect') {
        slide.addShape(pptx.ShapeType.rect, {
          x: element.x / 96,
          y: element.y / 96,
          w: element.width / 96,
          h: element.height / 96,
          fill: { color: "FF0000" }
        });
      } else if (element.type === 'text') {
        slide.addText("Sample Text", {
          x: element.x / 96,
          y: element.y / 96,
          w: element.width / 96,
          h: element.height / 96,
          color: "363636",
          fill: { color: "F1F1F1" },
          align: "center"
        });
      } else if (element.type === 'image') {
        slide.addImage({
          data: element.src!,
          x: element.x / 96,
          y: element.y / 96,
          w: element.width / 96,
          h: element.height / 96
        });
      }
    });

    pptx.writeFile({ fileName: "SamplePresentation.pptx" });
  };

    return (
        <div className="lg:flex flex-col items-center hidden">
            <div className="flex space-x-4 my-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => addElement('rect')}>Add Rectangle</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => addElement('text')}>Add Text</button>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer" />
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
                        <div className="relative border border-black bg-white flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                            {el.type === 'text' ? 'Text' : el.type === 'rect' ? 'Rectangle' : <img src={el.src} alt="Uploaded" className="pointer-events-none" style={{ width: '100%', height: '100%' }} />}
                            <button
                                className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl"
                                onClick={() => deleteElement(el.id)}
                            >
                                &times;
                            </button>
                        </div>
                    </Rnd>
                ))}
            </div>
            <div className="flex space-x-4 my-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleGenerate}>Generate Code</button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={downloadPresentation}>Download Test</button>
            </div>
            {generatedCode && (
                <div className="mt-4 p-4 bg-gray-100 rounded w-full max-w-2xl">
                    <h3 className="text-lg font-semibold">Generated Code:</h3>
                    <pre className="bg-gray-200 p-2 rounded overflow-x-auto">
                        {generatedCode}
                    </pre>
                </div>
            )}
        </div>
    );
}