"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ScrollCards = () => {
  const { scrollYProgress } = useScroll();

  const cardsData = [
    { id: 1, color: "#3b82f6", direction: "left", content: "Card 1" },
    { id: 2, color: "#10b981", direction: "right", content: "Card 2" },
    { id: 3, color: "#f59e0b", direction: "top", content: "Card 3" },
    { id: 4, color: "#ef4444", direction: "bottom", content: "Card 4" },
    { id: 5, color: "#8b5cf6", direction: "top-left", content: "Card 5" },
    { id: 6, color: "#ec4899", direction: "bottom-right", content: "Card 6" },
  ];

  const getDirectionTransform = (dir) => {
    switch (dir) {
      case "left": return { x: -100, y: 0 };
      case "right": return { x: 100, y: 0 };
      case "top": return { x: 0, y: -100 };
      case "bottom": return { x: 0, y: 100 };
      case "top-left": return { x: -100, y: -100 };
      case "bottom-right": return { x: 100, y: 100 };
      default: return { x: 0, y: 0 };
    }
  };

  return (
    <div style={{ height: "600vh", background: "#f3f4f6" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          perspective: 2000, // العمق
        }}
      >
        {cardsData.map((card, index) => {
          const start = index * 0.15;
          const end = start + 0.3;

          const { x: finalX, y: finalY } = getDirectionTransform(card.direction);

          const opacity = useTransform(
            scrollYProgress,
            [start, start + 0.1, end - 0.1, end],
            [0, 1, 1, 0]
          );

          const x = useTransform(scrollYProgress, [start, end], [0, finalX]);
          const y = useTransform(scrollYProgress, [start, end], [0, finalY]);
          const scale = useTransform(scrollYProgress, [start, end], [0.2, 1]);
          const z = useTransform(scrollYProgress, [start, end], [-400, 0]); // المحور Z

          return (
            <motion.div
              key={card.id}
              style={{
                position: "absolute",
                width: "200px",
                height: "200px",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
                backgroundColor: card.color,
                opacity,
                scale,
                x,
                y,
                transformStyle: "preserve-3d",
                zIndex: cardsData.length - index,
              }}
            >
              {card.content}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollCards;
