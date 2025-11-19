import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Modal = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="relative w-full max-w-lg rounded-xl bg-buttonBg border border-black/20 p-4">
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


