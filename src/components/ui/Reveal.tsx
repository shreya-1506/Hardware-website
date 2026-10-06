"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

/**
 * Vertical-only offsets. A sideways offset would translate a full-width child
 * past its container and give the page a horizontal scrollbar at every
 * viewport size, so `left`/`right` differ in depth rather than direction.
 */
const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 22 },
  down: { x: 0, y: -22 },
  left: { x: 0, y: 30 },
  right: { x: 0, y: 30 },
  none: { x: 0, y: 0 },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  as?: ElementType;
  /** Re-animate every time it scrolls into view instead of only once. */
  repeat?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.55,
  direction = "up",
  as = "div",
  repeat = false,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as as keyof typeof motion] as typeof motion.div;
  const offset = reduced ? offsets.none : offsets[direction];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: !repeat, amount: 0.2, margin: "0px 0px -60px 0px" }}
      transition={{
        duration: reduced ? 0.01 : duration,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Component>
  );
}

/** Parent wrapper that staggers its `RevealItem` children. */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -80px 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
