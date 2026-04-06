'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        gap: "20px"
      }}
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: { duration: 1, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          width: "50px",
          height: "50px",
          border: "4px solid #F1F5F9",
          borderTopColor: "#E31B23", // Kayparts Red
          borderRadius: "50%",
        }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: "12px",
          fontWeight: "700",
          letterSpacing: "2px",
          color: "#1E293B",
          textTransform: "uppercase"
        }}
      >
        Cargando Sistema Kayparts...
      </motion.p>
    </div>
  );
}
