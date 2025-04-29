"use client"

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { DateTime } from "luxon";

export default function Archive() {
    type Log = {
      sunrise: string
      sunset: string
      similarLocation: string
      timestamp: string
    }

    const [items, setItems] = useState<Log[]>([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getItems() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs`);
                if (!res.ok) {
                    throw new Error(`Server error: ${res.status}`);
                }
                const data = await res.json();
                setItems(data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error("Fetch failed:", err);
                setError(err.message);
            }
        }
        getItems();
    }, [])

    if (error) {
        return <div>Error loading logs: {error}</div>;
    }

    return (
        <div className="bg-gray-300/40 rounded-3xl p-6 flex flex-col justify-center items-center gap-6
            w-full max-w-[1200px] max-h-[75vh] aspect-[3/1.8] text-center">
            <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white [-webkit-text-stroke:2px_black]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
            >
                Archive of Logs
            </motion.h1>
              {items.length === 0 ? (
                <p>No logs found.</p>
              ) : (
                <motion.ul
                        className="flex flex-col gap-2 overflow-y-auto max-h-[50vh] w-full px-6 "
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    delayChildren: 0.75,
                                    staggerChildren: 0.2
                                }
                            }
                        }}
                >
                  {items.map((log, i) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const formattedTimestamp = DateTime.fromISO(log.timestamp).toLocaleString(DateTime.DATETIME_MED);
                    return (
                    <motion.li
                        key={i}
                        className="text-base md:text-lg bg-white/60 border border-black rounded-3xl sm:rounded-full p-6 flex flex-col sm:flex-row justify-center items-center gap-4"
                        variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                        transition={{ duration: 1 }}
                    >
                      <strong>🌅 Sunrise:</strong> {log.sunrise} |{" "}
                      <strong>🌇 Sunset:</strong> {log.sunset} |{" "}
                      <strong>🌍 Location:</strong> {log.similarLocation}
                      {/*<strong>🕰️ Timestamp:</strong> {formattedTimestamp}*/}
                    </motion.li>
                    )
                  })}
                </motion.ul>
            )}
        </div>
    )
}

