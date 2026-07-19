"use client";

import React, { useEffect } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";

type Props = {
  value: number | string;
  duration?: number;
  format?: (v: number) => string;
};

export default function AnimatedNumber({ value, duration = 2, format }: Props) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 100, damping: 30 });
  const [display, setDisplay] = React.useState<string>("0");

  useEffect(() => {
    const v = typeof value === "string" ? parseFloat(value) || 0 : value;
    motionVal.set(0);
    motionVal.set(v);
    const unsub = spring.onChange((latest) => {
      const n = format ? format(Number(latest)) : Number(latest).toLocaleString();
      setDisplay(n);
    });

    return () => unsub();
  }, [value, format, motionVal, spring]);

  return <span>{display}</span>;
}
