"use client";
import { generateCode } from "@/lib/code";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import PptxGenJS from "pptxgenjs";
import { Bold, MinusSquare, PlusSquare, X } from "lucide-react";
import { ToolBar } from "./toolbar";
import { EditorContext, useEditorContext } from "@/lib/editorContext";

export function Editor() {
  const editorContext = useEditorContext();

  const handleGenerate = async () => {
    const generatedCode = await generateCode(editorContext.elements);
    editorContext.setGeneratedCode(generatedCode);
  };

  const downloadPresentation = () => {
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();

    editorContext.elements.forEach((element) => {
      if (element.type === "rect") {
        slide.addShape(pptx.ShapeType.rect, {
          x: element.x / 96,
          y: element.y / 96,
          w: element.width / 96,
          h: element.height / 96,
          fill: { color: "FF0000" },
        });
      } else if (element.type === "text") {
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
      } else if (element.type === "image") {
        slide.addImage({
          data: element.src!,
          x: element.x / 96,
          y: element.y / 96,
          w: element.width / 96,
          h: element.height / 96,
        });
      }
    });

    pptx.writeFile({ fileName: "SamplePresentation.pptx" });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editorContext.focusedElement === null) return;
      let clickedElement: Element | null = event.target as Element;
      while (clickedElement) {
        if (clickedElement.classList.contains("no-deselect")) {
          return;
        }
        clickedElement = clickedElement.parentElement;
      }
      editorContext.setFocusedElement(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editorContext.focusedElement]);

  return (
    <div className="lg:flex flex-col items-center hidden">
      <ToolBar />
      <div
        className="relative bg-gray-200"
        style={{ width: "960px", height: "540px" }}
      >
        {editorContext.elements.map((el) => (
          <Rnd
            key={el.id}
            size={{ width: el.width, height: el.height }}
            position={{ x: el.x, y: el.y }}
            onResize={() => editorContext.handleEdit(el.id)}
            onDragStop={(e, d) =>
              editorContext.updateElement(
                el.id,
                d.x,
                d.y,
                el.width,
                el.height,
                el.text!,
                el.fontSize!,
                el.isBold!
              )
            }
            onResizeStop={(e, direction, ref, delta, position) => {
              editorContext.updateElement(
                el.id,
                position.x,
                position.y,
                ref.offsetWidth,
                ref.offsetHeight,
                el.text!,
                el.fontSize!,
                el.isBold!
              );
            }}
            bounds="parent"
          >
            <div className={`relative ${editorContext.isEditing && editorContext.focusedElement === el.id && el.type === "text" ? "border" : ""} border-black flex items-center justify-center no-deselect h-full w-full`}>
              {el.type === "text" ? (
                <span
                  className={`w-full h-full hover:cursor-text whitespace-pre-wrap no-deselect`}
                  onClick={() => {
                    editorContext.handleEdit(el.id);
                  }}
                  onBlur={(e) =>
                    editorContext.updateElement(
                      el.id,
                      el.x,
                      el.y,
                      el.width,
                      el.height,
                      e.target.textContent!,
                      el.fontSize!,
                      el.isBold!
                    )
                  }
                  contentEditable={
                    editorContext.isEditing &&
                    editorContext.focusedElement === el.id
                  }
                  style={{
                    fontSize: `${el.fontSize}px`,
                    fontWeight: el.isBold ? "bold" : "normal",
                  }}
                >
                  {el.text}
                </span>
              ) : el.type === "rect" ? (
                <div
                  className={`bg-black w-`}
                  onDragStart={(e) => e.preventDefault()}
                  onClick={() => editorContext.handleEdit(el.id)}
                  style={{ width: "100%", height: "100%" }} />
              ) : (
                <img
                  src={el.src}
                  alt="Uploaded"
                  onDragStart={(e) => e.preventDefault()}
                  onClick={() => editorContext.handleEdit(el.id)}
                  style={{ width: "100%", height: "100%" }}
                />
              )}
              {el.type === "text" ? (
                editorContext.focusedElement === el.id && (
                  <div className="absolute bottom-0 right-0 flex flex-row h-8 no-deselect">
                    <div className="flex flex-row no-deselect">
                      <button
                        className=" bg-black text-white px-2 h-8 no-deselect"
                        onClick={() => {
                          editorContext.decreaseFontSize(el.fontSize!);
                          editorContext.updateElement(
                            el.id,
                            el.x,
                            el.y,
                            el.width,
                            el.height,
                            el.text!,
                            editorContext.fontSize,
                            el.isBold!
                          );
                        }}
                      >
                        <MinusSquare />
                      </button>
                      <span className=" bg-black text-white px-2 h-8 flex items-center no-deselect">
                        {el.fontSize}
                      </span>
                      <button
                        className="bg-black text-white px-2 h-8 no-deselect"
                        onClick={() => {
                          editorContext.increaseFontSize(el.fontSize!);
                          editorContext.updateElement(
                            el.id,
                            el.x,
                            el.y,
                            el.width,
                            el.height,
                            el.text!,
                            editorContext.fontSize,
                            el.isBold!
                          );
                        }}
                      >
                        <PlusSquare />
                      </button>
                      <button
                        className="bg-black text-white px-2 h-8 no-deselect"
                        onClick={() => {
                          editorContext.toggleBold();
                          editorContext.updateElement(
                            el.id,
                            el.x,
                            el.y,
                            el.width,
                            el.height,
                            el.text!,
                            el.fontSize!,
                            !editorContext.isBold
                          );
                        }}
                      >
                        <Bold />
                      </button>
                    </div>
                    <button
                      className="bg-red-500 text-white px-2 h-8 no-deselect"
                      onClick={() => editorContext.deleteElement(el.id)}
                    >
                      <X />
                    </button>
                  </div>
                )
              ) : (
                editorContext.focusedElement === el.id && (
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl"
                    onClick={() => editorContext.deleteElement(el.id)}
                  >
                    &times;
                  </button>)
              )}
            </div>
          </Rnd>
        ))}
      </div>
      <div className="flex space-x-4 my-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleGenerate}
        >
          Generate Code
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={downloadPresentation}
        >
          Download Test
        </button>
      </div>
      {editorContext.generatedCode && (
        <div className="mt-4 p-4 bg-gray-100 rounded w-full max-w-2xl">
          <h3 className="text-lg font-semibold">Generated Code:</h3>
          <pre className="bg-gray-200 p-2 rounded overflow-x-auto">
            {editorContext.generatedCode}
          </pre>
        </div>
      )}
    </div>
  );
}
