"use client"

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Flame, Menu, X } from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <div>
            {/* Home Logo */}
            <motion.a
                href="/"
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                transition={{ duration: 1, delay: 1}}
            >
                <Flame size={32} className="invert absolute top-12 left-10 hover:scale-110 hover:opacity-85 transition-all z-30"/>
            </motion.a>

            {/* Mobile Screens */}
            <motion.button
                ref={buttonRef}
                onClick={toggleMenu}
                className="md:hidden text-white absolute right-10 top-12 z-50"
                whileTap={{ rotate: 180 }}
            >
                {isMenuOpen ? <X size={32}/> : <Menu size={32}/>}
            </motion.button>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.5 }}
                        className="md:hidden text-white text-3xl fixed left-0 top-0 w-full h-screen bg-[rgba(0,0,0,0.8)] z-20 overflow-hidden flex flex-col justify-center items-center z-40"
                    >
                        <motion.p
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.5, delay: 0.25 }}
                            className="md:hidden hover:opacity-85"
                        >
                            <Link href="/map">
                                MAP
                            </Link>
                        </motion.p>
                        <motion.p
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.5, delay: 0.25 }}
                            className="md:hidden mt-12 hover:opacity-85"
                        >
                            <Link href="/archive">
                                ARCHIVE
                            </Link>
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Large Screens */}
            <motion.div
                className="hidden md:flex justify-center md:gap-2 lg:gap-4 text-white text-sm lg:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1 }}
            >
                <Link href="/map" className="mt-12 hover:bg-white/5 py-2 px-6 rounded-full backdrop-blur-sm transition-all">
                    MAP
                </Link>
                <Link href="/archive" className="mt-12 hover:bg-white/5 py-2 px-6 rounded-full backdrop-blur-sm transition-all">
                    ARCHIVE
                </Link>
            </motion.div>
        </div>
    )
}

