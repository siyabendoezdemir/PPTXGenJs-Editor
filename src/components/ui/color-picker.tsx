'use client'

import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'

const solids = [
    '#E2E2E2',
    '#ff75c3',
    '#ffa647',
    '#ffe83f',
    '#9fff5b',
    '#70e2ff',
    '#cd93ff',
    '#09203f',
]


export function ColorPicker({ color, onColorChange }: { color: string, onColorChange?: (color: string) => void }) {
    const [background, setBackground] = useState(`${color}`)

    useEffect(() => {
        if (onColorChange) {
            onColorChange(background);
        }
    }, [background])

    return (
        <div
            className="w-full h-64 justify-end flex flex-col rounded !bg-cover !bg-center transition-all"
            style={{ background }}
        >
            <div className='h-fit bg-white pt-6'>
                <div className='w-full flex flex-row justify-between'>
                    {solids.map((s) => (
                        <div
                            key={s}
                            style={{ background: s }}
                            className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                            onClick={() => setBackground(s)}
                        />
                    ))}
                </div>

                <Input
                    id="custom"
                    value={background}
                    className="col-span-2 h-8 mt-4"
                    onChange={(e) => setBackground(e.currentTarget.value)}
                />
            </div>
        </div>
    )
}
