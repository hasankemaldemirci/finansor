import { motion } from 'framer-motion';

interface XPNotificationProps {
  amount: number;
  show: boolean;
}

export function XPNotification({ amount, show }: XPNotificationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg"
    >
      +{amount} XP 🌟
    </motion.div>
  );
}
