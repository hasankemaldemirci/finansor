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
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-6 py-3 rounded-full shadow-lg font-semibold"
    >
      +{amount} XP 🌟
    </motion.div>
  );
}

