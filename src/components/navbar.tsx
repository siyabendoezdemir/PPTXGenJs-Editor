import logo from '@/../public/images/logo/icon.svg';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Github } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="w-full h-[10%] lg:flex flex-row items-center justify-between md:px-36 hidden">
            <div className=' flex items-center flex-row '>
                <Image src={logo} alt='pptxgenjs visual editor code generator logo' height={64} />
                <h1 className='text-2xl font-bold'>pptxgenjs editor <Link href={"https://siya.digital"} target='_blank' className='underline text-sm font-thin'>by siya</Link></h1>
            </div>
            <div>
                <Link href={"https://github.com/siyabendoezdemir/PPTXGenJs-Editor"} target='_blank' >
                    <Button variant="outline" size="icon">
                        <Github className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </nav>
    )
}