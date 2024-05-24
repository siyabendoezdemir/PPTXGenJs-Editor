"use client"
import { generateCode } from "@/lib/code";
import { ChangeEvent, useEffect, useState } from "react";
import { Rnd } from 'react-rnd';
import PptxGenJS from 'pptxgenjs';
import { Bold, MinusSquare, PlusSquare, X } from "lucide-react";

export function Editor() {
  const [elements, setElements] = useState<PptElement[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const [text, setText] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(12);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [focusedElement, setFocusedElement] = useState<number | null>(null);

  const addElement = (type: PptElement['type'], src?: string) => {
    const newElement: PptElement = { id: Date.now(), type, x: 50, y: 50, width: 100, height: 50, src, text, fontSize, isBold };
    setElements([...elements, newElement]);
  };

  const updateElement = (id: number, x: number, y: number, width: number, height: number, text: string, fontSize: number, isBold: boolean) => {
    setElements(elements.map(el => el.id === id ? { ...el, x, y, width, height, text, fontSize, isBold } : el));
  };

  const deleteElement = (id: number) => {
    setElements(elements.filter(el => el.id !== id));
  };

  const handleDoubleClick = (id: number) => {
    setIsEditing(true);
    setFocusedElement(id);
    const selectedElement = elements.find(el => el.id === id);
    if (selectedElement) {
      setFontSize(selectedElement.fontSize!);
    }
  };

  const handleBlur = (elementId: number) => {
    setIsEditing(false);
    setFocusedElement(null);
    setText(elements.filter(el => el.id === elementId)[0].text!)
  };

  const increaseFontSize = (prevFontSize: number) => {
    setFontSize((prevFontSize) => prevFontSize + 1);
  };

  const decreaseFontSize = (prevFontSize: number) => {
    setFontSize((prevFontSize) => prevFontSize - 1);
  };

  const toggleBold = () => {
    setIsBold(!isBold);
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
        slide.addText(element.text!, {
          x: element.x / 96,
          y: element.y / 96,
          w: element.width / 96,
          h: element.height / 96,
          color: "363636",
          fill: { color: "F1F1F1" },
          align: "center",
          bold: element.isBold,
          fontSize: element.fontSize,
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (focusedElement === null) return;
      let clickedElement: Element | null = event.target as Element;
      while (clickedElement) {
        if (clickedElement.classList.contains('no-deselect')) {
          return;
        }
        clickedElement = clickedElement.parentElement;
      }
      setFocusedElement(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [focusedElement]);

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
            onDragStop={(e, d) => updateElement(el.id, d.x, d.y, el.width, el.height, el.text!, el.fontSize!, el.isBold!)}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateElement(el.id, position.x, position.y, ref.offsetWidth, ref.offsetHeight, el.text!, el.fontSize!, el.isBold!)
            }}
            bounds="parent"
          >
            <div className="relative border border-black bg-white flex items-center justify-center no-deselect" style={{ width: '100%', height: '100%' }} >
              {el.type === 'text' ? <span className="w-full h-full whitespace-pre-wrap no-deselect" onDoubleClick={() => handleDoubleClick(el.id)} onBlur={(e) => updateElement(el.id, el.x, el.y, el.width, el.height, e.target.textContent!, el.fontSize!, el.isBold!)} contentEditable={isEditing && focusedElement === el.id} style={{ fontSize: `${el.fontSize}px`, fontWeight: el.isBold ? 'bold' : 'normal' }}>{el.text}</span> : el.type === 'rect' ? 'Rectangle' : <img src={el.src} alt="Uploaded" className="pointer-events-none" style={{ width: '100%', height: '100%' }} />}
              {el.type === "text" ? focusedElement === el.id && (
                <div className="absolute bottom-0 right-0 flex flex-row h-8 no-deselect">
                  <div className="flex flex-row no-deselect">
                    <button className=" bg-black text-white px-2 h-8 no-deselect" onClick={() => { decreaseFontSize(el.fontSize!); updateElement(el.id, el.x, el.y, el.width, el.height, el.text!, fontSize, el.isBold!) }}><MinusSquare /></button>
                    <span className=" bg-black text-white px-2 h-8 flex items-center no-deselect">{el.fontSize}</span>
                    <button className="bg-black text-white px-2 h-8 no-deselect" onClick={() => { increaseFontSize(el.fontSize!); updateElement(el.id, el.x, el.y, el.width, el.height, el.text!, fontSize, el.isBold!) }}><PlusSquare /></button>
                    <button className="bg-black text-white px-2 h-8 no-deselect" onClick={() => { toggleBold(); updateElement(el.id, el.x, el.y, el.width, el.height, el.text!, el.fontSize!, !isBold) }}><Bold /></button>
                  </div>
                  <button
                    className="bg-red-500 text-white px-2 h-8 no-deselect"
                    onClick={() => deleteElement(el.id)}
                  >
                    <X />
                  </button>
                </div>
              ) : <button
                className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl"
                onClick={() => deleteElement(el.id)}
              >
                &times;
              </button>}
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