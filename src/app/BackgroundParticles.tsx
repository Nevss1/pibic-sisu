"use client";

import { motion } from "framer-motion";

const PARTICLES = [
  { left: "10%",  top: "15%", size: 5, duration: 4.0, delay: 0.5 },
  { left: "83%",  top: "10%", size: 3, duration: 5.5, delay: 1.2 },
  { left: "76%",  top: "74%", size: 4, duration: 4.8, delay: 0.0 },
  { left: "17%",  top: "80%", size: 3, duration: 6.0, delay: 2.0 },
  { left: "90%",  top: "46%", size: 5, duration: 5.0, delay: 0.8 },
  { left: "50%",  top: "5%",  size: 3, duration: 5.2, delay: 1.6 },
  { left: "5%",   top: "50%", size: 6, duration: 4.3, delay: 0.3 },
  { left: "35%",  top: "90%", size: 4, duration: 5.8, delay: 1.0 },
  { left: "62%",  top: "88%", size: 3, duration: 4.6, delay: 2.4 },
  { left: "93%",  top: "25%", size: 4, duration: 5.3, delay: 0.7 },
  { left: "28%",  top: "8%",  size: 5, duration: 4.9, delay: 1.8 },
  { left: "68%",  top: "30%", size: 3, duration: 6.2, delay: 0.4 },
  { left: "45%",  top: "95%", size: 4, duration: 4.4, delay: 1.4 },
  { left: "3%",   top: "72%", size: 3, duration: 5.7, delay: 2.2 },
  { left: "58%",  top: "55%", size: 5, duration: 3.8, delay: 0.9 },
  { left: "22%",  top: "40%", size: 3, duration: 5.1, delay: 1.7 },
  { left: "40%",  top: "22%", size: 4, duration: 4.7, delay: 3.0 },
  { left: "72%",  top: "52%", size: 3, duration: 5.9, delay: 0.6 },
  { left: "8%",   top: "33%", size: 5, duration: 4.2, delay: 2.8 },
  { left: "55%",  top: "78%", size: 4, duration: 5.4, delay: 1.3 },
  { left: "87%",  top: "62%", size: 3, duration: 6.1, delay: 0.2 },
  { left: "31%",  top: "60%", size: 6, duration: 4.5, delay: 2.1 },
  { left: "65%",  top: "18%", size: 3, duration: 5.6, delay: 1.9 },
  { left: "14%",  top: "92%", size: 4, duration: 3.9, delay: 0.1 },
  { left: "96%",  top: "82%", size: 3, duration: 5.3, delay: 2.7 },
  { left: "42%",  top: "48%", size: 5, duration: 4.1, delay: 1.1 },
  { left: "78%",  top: "38%", size: 3, duration: 6.3, delay: 3.2 },
  { left: "25%",  top: "25%", size: 4, duration: 4.6, delay: 0.6 },
  { left: "53%",  top: "65%", size: 3, duration: 5.0, delay: 2.5 },
  { left: "7%",   top: "88%", size: 5, duration: 4.8, delay: 1.5 },
  { left: "88%",  top: "90%", size: 3, duration: 5.5, delay: 3.5 },
  { left: "37%",  top: "35%", size: 4, duration: 4.3, delay: 0.4 },
  { left: "60%",  top: "42%", size: 3, duration: 5.8, delay: 2.9 },
  { left: "19%",  top: "55%", size: 5, duration: 3.7, delay: 1.3 },
  { left: "73%",  top: "95%", size: 3, duration: 6.0, delay: 0.3 },
  { left: "47%",  top: "12%", size: 4, duration: 4.9, delay: 2.3 },
  { left: "2%",   top: "15%", size: 3, duration: 5.4, delay: 1.0 },
  { left: "95%",  top: "68%", size: 5, duration: 4.2, delay: 3.1 },
  { left: "33%",  top: "72%", size: 3, duration: 5.7, delay: 0.8 },
  { left: "81%",  top: "48%", size: 4, duration: 4.5, delay: 2.6 },
];

export default function BackgroundParticles() {
  return (
    <>
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, backgroundColor: "rgba(118,36,60,0.3)" }}
          animate={{ y: [0, -18, 0], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </>
  );
}
