"use client"
import { ChangeEvent, ReactNode, createContext, useContext, useState } from 'react';

interface EditorContextType {
    elements: PptElement[];
    generatedCode: string;
    text: string;
    fontSize: number;
    isBold: boolean;
    isEditing: boolean;
    focusedElement: number | null;
    addElement: (type: PptElement['type'], options?: { imageSrc?: string, placeholderText?: string }) => void;
    updateElement: (id: number, x: number, y: number, width: number, height: number, text: string, fontSize: number, isBold: boolean) => void;
    deleteElement: (id: number) => void;
    handleEdit: (id: number) => void;
    handleBlur: (event: any, elementId: number) => void;
    handleColorChange: (color: string) => void;
    increaseFontSize: (prevFontSize: number) => void;
    decreaseFontSize: (prevFontSize: number) => void;
    toggleBold: () => void;
    setElements: (elements: PptElement[]) => void;
    setGeneratedCode: (code: string) => void;
    setText: (text: string) => void;
    setFontSize: (size: number) => void;
    setIsBold: (bold: boolean) => void;
    setIsEditing: (editing: boolean) => void;
    setFocusedElement: (id: number | null) => void;
}

export const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
    const [elements, setElements] = useState<PptElement[]>([]);
    const [generatedCode, setGeneratedCode] = useState<string>('');
    const [text, setText] = useState<string>('text');
    const [fontSize, setFontSize] = useState<number>(12);
    const [isBold, setIsBold] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [focusedElement, setFocusedElement] = useState<number | null>(null);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const src = e.target?.result as string;
                addElement('image', { imageSrc: src });
            };
            reader.readAsDataURL(file);
        }
    };

    const addElement = (type: PptElement['type'], options?: { imageSrc?: string, placeholderText?: string }) => {
        const newElement: PptElement = { id: Date.now(), type, x: 50, y: 50, width: 100, height: 50, src: options?.imageSrc, text, fontSize, isBold };
        setElements([...elements, newElement]);
    };

    const updateElement = (id: number, x: number, y: number, width: number, height: number, text: string, fontSize: number, isBold: boolean) => {
        setElements(elements.map(el => el.id === id ? { ...el, x, y, width, height, text, fontSize, isBold } : el));
    };

    const deleteElement = (id: number) => {
        setElements(elements.filter(el => el.id !== id));
    };

    const handleEdit = (id: number) => {
        setIsEditing(true);
        setFocusedElement(id);
        const selectedElement = elements.find(el => el.id === id);
        if (selectedElement) {
            setFontSize(selectedElement.fontSize!);
        }
    };

    const handleColorChange = (color: string) => {
        if (focusedElement !== null) {
            const selectedElement = elements.find(el => el.id === focusedElement);
            if (selectedElement) {
                selectedElement.color = color;
            }
        }
    }

    const handleBlur = (event: any, elementId: number) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsEditing(false);
            setFocusedElement(null);
            setText(elements.filter(el => el.id === elementId)[0].text!);
        }
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

    return (
        <EditorContext.Provider value={{
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
            handleEdit,
            handleBlur,
            handleColorChange,
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
        }}>
            {children}
        </EditorContext.Provider>
    );
};

// Custom hook to use the EditorContext
export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditorContext must be used within an EditorProvider');
    }
    return context;
};