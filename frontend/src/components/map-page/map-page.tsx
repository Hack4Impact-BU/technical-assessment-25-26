"use client"

import Navbar from "../navbar/navbar";
import dynamic from "next/dynamic";
import { motion } from "motion/react";

const MapClient = dynamic(() => import("../map-client/map-client"), { ssr: false });

export default function MapPage() {
    return (
        <div className="bg-[url('/assets/earth.png')] bg-cover bg-center w-full h-screen flex flex-col">
            <Navbar/>
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.35 }}
                className="w-full flex-1 flex items-center justify-center z-0 px-4 md:px-10"
            >
                <MapClient/>
            </motion.div>
        </div>
    )
}

