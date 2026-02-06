"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GoldenDustEffectProps {
    show?: boolean;
    onComplete?: () => void;
}

export const GoldenDustEffect = ({ show = true, onComplete }: GoldenDustEffectProps) => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        if (show) {
            // Create golden dust particles
            const count = 50;
            const newParticles = Array.from({ length: count }).map((_, i) => ({
                id: i,
                x: 50 + (Math.random() - 0.5) * 30, // Center burst effect
                y: 50 + (Math.random() - 0.5) * 30,
                size: Math.random() * 4 + 2,
                duration: 1 + Math.random() * 1.5,
                delay: Math.random() * 0.3,
                angle: (Math.PI * 2 * i) / count, // Circular pattern
            }));
            setParticles(newParticles);

            // Trigger onComplete after animation
            if (onComplete) {
                setTimeout(onComplete, 2500);
            }
        }
    }, [show, onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
                >
                    {/* Glow effect */}
                    <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 2 }}
                        style={{
                            background: "radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.2), transparent 70%)",
                        }}
                    />

                    {/* Particles */}
                    {particles.map((p) => {
                        const distance = 200 + Math.random() * 300;
                        const endX = p.x + Math.cos(p.angle) * distance;
                        const endY = p.y + Math.sin(p.angle) * distance;

                        return (
                            <motion.div
                                key={p.id}
                                className="absolute rounded-full"
                                style={{
                                    left: `${p.x}%`,
                                    top: `${p.y}%`,
                                    width: p.size,
                                    height: p.size,
                                    background: "linear-gradient(135deg, #fcd34d, #fbbf24, #f59e0b)",
                                    boxShadow: "0 0 15px rgba(251, 191, 36, 0.8)",
                                }}
                                initial={{
                                    x: 0,
                                    y: 0,
                                    scale: 0,
                                    opacity: 0,
                                }}
                                animate={{
                                    x: endX - p.x + "%",
                                    y: endY - p.y + "%",
                                    scale: [0, 1.5, 0],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: p.duration,
                                    delay: p.delay,
                                    ease: "easeOut",
                                }}
                            />
                        );
                    })}

                    {/* Center explosion */}
                    <motion.div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: [0, 1.5, 2],
                            opacity: [0, 0.6, 0],
                        }}
                        transition={{ duration: 1.5 }}
                    >
                        <div
                            className="w-40 h-40 rounded-full"
                            style={{
                                background: "radial-gradient(circle, rgba(251, 191, 36, 0.6), transparent)",
                            }}
                        />
                    </motion.div>

                    {/* Success icon */}
                    <motion.div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1], rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-[#4a044e] to-[#701a75] rounded-full flex items-center justify-center shadow-2xl border-4 border-gold">
                            <svg
                                className="w-12 h-12 text-gold"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <motion.path
                                    d="M5 13l4 4L19 7"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                />
                            </svg>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
