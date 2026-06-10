import { motion } from "motion/react";
import { slideUp } from "../animation";

export type FeedbackTone = "error" | "warning" | "info";

const feedbackToneClassNames: Record<FeedbackTone, string> = {
  error: "border-rose-400/30 bg-rose-500/10 text-rose-100",
  warning: "border-amber-400/30 bg-amber-500/10 text-amber-100",
  info: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100",
};

type FeedbackMessageProps = {
  tone: FeedbackTone;
  message: string;
};

export function FeedbackMessage({ tone, message }: FeedbackMessageProps) {
  return (
    <motion.p
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`rounded-xl border px-3 py-2 text-sm ${feedbackToneClassNames[tone]}`}
      role={tone === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {message}
    </motion.p>
  );
}
