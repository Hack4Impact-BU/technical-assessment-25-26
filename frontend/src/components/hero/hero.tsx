"use client"

import {motion} from "motion/react";

export default function Hero() {
    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            justify-self-center flex flex-col items-center text-center justify-center gap-8">
        <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-linear-to-r from-white to-yellow-200 bg-clip-text text-transparent [-webkit-text-stroke:2px_black] mx-6"
            initial={{ y: 70, opacity: 0 }}
            animate={{
                y: 0,
                opacity: 1,
                backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"], // Animate background gradient position
            }}
            transition={{
                y: { duration: 1 },
                opacity: { duration: 0.75 },
                duration: 3, // Animation duration
                ease: "easeInOut",
                repeat: Infinity, // Loop infinitely
            }}
            style={{
                backgroundSize: "200% 200%", // To allow smooth scrolling of the gradient
            }}
        >
                WELCOME TO TWINLIGHT
        </motion.h1>
            <motion.a
                className="bg-[#D9D9D9] rounded-full p-2 px-8 md:px-12 md:text-lg xl:text-xl
                    shadow-[0_0_8px_2px_rgba(217,217,217,0.7)] hover:shadow-[0_0_12px_4px_rgba(217,217,217,0.9)] transition-shadow ease-in-out duration-200"
                href="/map"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.35 }}
            >
                Try it now!
            </motion.a>
        </div>
    )
}

