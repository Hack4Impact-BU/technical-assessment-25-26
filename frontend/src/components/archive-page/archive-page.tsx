"use client"

import Archive from "../archive/archive";
import Navbar from "../navbar/navbar";
import { motion } from "motion/react";

export default function ArchivePage() {
    return (
        <div className="bg-[url('/assets/earth.png')] bg-cover bg-center w-full h-screen flex flex-col">
            <Navbar/>
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.35 }}
                className="w-full flex-1 flex items-center justify-center z-0 px-4 md:px-10"
            >
                <Archive/>
            </motion.div>
        </div>
    )
}

