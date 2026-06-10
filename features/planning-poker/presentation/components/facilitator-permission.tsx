import { AnimatePresence, motion } from "motion/react";
import { slideUp } from "../animation";

export const facilitatorPermissionMessage =
  "Only facilitators can use this control.";

type FacilitatorPermissionNoticeProps = {
  canUseFacilitatorActions: boolean;
};

export function FacilitatorPermissionNotice({
  canUseFacilitatorActions,
}: FacilitatorPermissionNoticeProps) {
  return (
    <AnimatePresence>
      {!canUseFacilitatorActions ? (
        <motion.p
          key="facilitator-notice"
          variants={slideUp}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.15 }}
          className="mt-2 text-[10px] font-medium text-slate-600 sm:text-xs"
        >
          {facilitatorPermissionMessage}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
