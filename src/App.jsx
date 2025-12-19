import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// ================= WHATSAPP CONFIG =================
const WHATSAPP_NUMBER = "254705131816"; // country code, no "+"
const SUCCESS_MESSAGE =
  "Okayyy. I tried to escape but failed successfully. Guess it's official now!";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  SUCCESS_MESSAGE
)}`;
// ===================================================

function App() {
  const [answered, setAnswered] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const [hoverCount, setHoverCount] = useState(0);
  const [countdown, setCountdown] = useState(5);

  const MAX_HOVER_COUNT = 12;

  const blobVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 90, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  // ✅ SAFELY opens WhatsApp
  const openWhatsApp = () => {
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  const handleYes = () => {
    setAnswered(true);
    setCountdown(5);
    fireConfetti();
  };

  // Countdown timer effect
  useEffect(() => {
    if (answered && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [answered, countdown]);

  const moveNoButton = () => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    setNoBtnPosition({ x, y });
    setHoverCount((prev) => prev + 1);
  };

  const handleNoClick = () => {
    if (hoverCount >= MAX_HOVER_COUNT) {
      handleYes();
    } else {
      moveNoButton();
    }
  };

  const getNoButtonText = () => {
    const phrases = [
      "No 🛑",
      "Are you sure? 🤔",
      "Really? 😬",
      "This feels risky 😅",
      "Don't do this 💔",
      "Please reconsider 🙏",
      "Okay now you're testing fate 😭",
      "Wrong button bestie 🙅‍♀️",
      "That's not the vibe 😐",
      "You're playing games now 🤡",
      "Okay I surrender 😩",
      "Just click YES already 😌💖",
    ];
    return phrases[Math.min(hoverCount, phrases.length - 1)];
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden
                    bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                    flex items-center justify-center">

      {/* Background Blobs */}
      <motion.div
        variants={blobVariants}
        animate="animate"
        className="absolute top-1/4 left-1/4 w-72 h-72
                   bg-purple-300 rounded-full mix-blend-multiply blur-xl opacity-70"
      />
      <motion.div
        variants={blobVariants}
        animate="animate"
        transition={{ delay: 2 }}
        className="absolute top-1/3 right-1/4 w-72 h-72
                   bg-yellow-300 rounded-full mix-blend-multiply blur-xl opacity-70"
      />
      <motion.div
        variants={blobVariants}
        animate="animate"
        transition={{ delay: 4 }}
        className="absolute bottom-1/4 left-1/3 w-72 h-72
                   bg-pink-300 rounded-full mix-blend-multiply blur-xl opacity-70"
      />

      <div className="relative z-10 flex justify-center w-full">
        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              key="question"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/30 backdrop-blur-lg rounded-3xl
                         shadow-2xl p-8 md:p-12 text-center
                         w-[90%] max-w-lg"
            >
              <motion.div
                className="mb-6 text-7xl md:text-8xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💖
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Will You Be My Lil Mama😉😘?
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8">
                Every moment with you is magic ✨ <br />
                I want to make it official!
              </p>

              <div className="relative h-32 flex justify-center items-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleYes}
                  className="px-10 py-3 bg-gradient-to-r
                             from-green-400 to-emerald-600
                             text-white text-xl font-bold rounded-full shadow-lg"
                >
                  YES 😍
                </motion.button>

                <motion.button
                  animate={noBtnPosition}
                  onHoverStart={moveNoButton}
                  onClick={handleNoClick}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute px-10 py-3 bg-white/20
                             text-white text-xl font-bold rounded-full
                             backdrop-blur-sm cursor-pointer"
                >
                  {getNoButtonText()}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/30 backdrop-blur-lg rounded-3xl
                         shadow-2xl p-8 md:p-12 text-center
                         w-[90%] max-w-lg"
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                💑
              </motion.div>

              <h2 className="text-5xl font-black text-white mb-6">
                WOHOOO! 🎉
              </h2>

              <p className="text-xl text-white/90 mb-8">
                 Get ready for a lot of love, snacks, and annoying selfies! 📸
              </p>

              {countdown > 0 ? (
                <div className="mb-6">
                  <p className="text-white/80 text-lg mb-2">
                    Get ready to send your message in...
                  </p>
                  <motion.div
                    key={countdown}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl font-black text-white"
                  >
                    {countdown}
                  </motion.div>
                </div>
              ) : (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openWhatsApp}
                  className="mb-6 px-10 py-4 bg-gradient-to-r from-green-400 to-emerald-600
                             text-white text-xl font-bold rounded-full shadow-lg
                             hover:shadow-2xl transition-shadow"
                >
                  📱 Send WhatsApp Message
                </motion.button>
              )}

              <button
                onClick={() => {
                  setAnswered(false);
                  setHoverCount(0);
                  setNoBtnPosition({ x: 0, y: 0 });
                  setCountdown(5);
                }}
                className="px-8 py-3 bg-white/20 text-white rounded-full
                           hover:bg-white/40 font-semibold"
              >
                ↺ Replay
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;