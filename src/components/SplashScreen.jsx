import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 bg-background flex flex-col justify-center items-center z-50"
    >
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
        className="w-32 h-32 bg-primary rounded-full flex items-center justify-center"
      >
        <Flame className="w-16 h-16 text-primary-foreground" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-4xl font-bold mt-6 text-primary"
      >
        CalorieTrack
      </motion.h1>
    </motion.div>
  );
};

export default SplashScreen;