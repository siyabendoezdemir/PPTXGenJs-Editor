"use client"
import { useState } from "react";

export const useEditorLogic = () => {
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
        console.log(elements)
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

    return {
        elements,
        generatedCode,
        text,
        fontSize,
        isBold,
        isEditing,
        focusedElement,
        addElement,
        updateElement,
        deleteElement,
        handleDoubleClick,
        handleBlur,
        increaseFontSize,
        decreaseFontSize,
        toggleBold,
        setElements,
        setGeneratedCode,
        setText,
        setFontSize,
        setIsBold,
        setIsEditing,
        setFocusedElement,
    };
};