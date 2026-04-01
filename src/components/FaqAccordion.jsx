import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

function FaqAccordion({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="glass-panel overflow-hidden rounded-[28px] shadow-card">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <div>
                {item.category && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                    {item.category}
                  </p>
                )}
                <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
              </div>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <p className="border-t border-white/60 px-6 py-5 text-sm leading-7 text-slate-600">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default FaqAccordion;