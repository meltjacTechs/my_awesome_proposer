import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

function App() {
  const [answered, setAnswered] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const [hoverCount, setHoverCount] = useState(0);

  // Define the maximum index for the phrases (length of 13, so index 12 is the last)
  const MAX_HOVER_COUNT = 12;

  const blobVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 90, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const handleYes = () => {
    setAccepted(true);
    setAnswered(true);
    fireConfetti();
  };

  const moveNoButton = () => {
    // Constrained movement to keep the button within the central area
    const x = Math.random() * 200 - 100; 
    const y = Math.random() * 200 - 100;
    setNoBtnPosition({ x, y });
    setHoverCount(prev => prev + 1);
  };

  // Logic for the 'No' button click/touch
  const handleNoClick = () => {
    if (hoverCount >= MAX_HOVER_COUNT) {
      // If the user persists until the final phrase, they are forced to 'Yes'
      handleYes();
    } else {
      // Otherwise, the button just runs away and increments the count
      moveNoButton();
    }
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
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const getNoButtonText = () => {
    const phrases = [
      "No 🛑",
      "Are you sure? 🤔",
      "Really? 😬",
      "Don't do this! 💔",
      "Click Yes! 🙏",
      "Last chance! ⏳",
      "No 😐",
      "Wait… what? 🤯",
      "You sure about that? 👀",
      "This feels illegal 😭",
      "Wrong choice bestie 🙅‍♀️",
      "Okay now you’re playing 🤡",
      "Just click YES 😌💖"
    ];
    return phrases[Math.min(hoverCount, phrases.length - 1)];
  };

  return (
    /* FULL VIEWPORT CENTERING & BACKGROUND */
    <div className="relative h-screen w-screen overflow-hidden
                    bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                    flex items-center justify-center">

      {/* Animated Background Blobs */}
      <motion.div
        variants={blobVariants}
        animate="animate"
        className="absolute top-1/4 left-1/4 w-72 h-72
                   bg-purple-300 rounded-full mix-blend-multiply
                   filter blur-xl opacity-70"
      />
      <motion.div
        variants={blobVariants}
        animate="animate"
        transition={{ delay: 2 }}
        className="absolute top-1/3 right-1/4 w-72 h-72
                   bg-yellow-300 rounded-full mix-blend-multiply
                   filter blur-xl opacity-70"
      />
      <motion.div
        variants={blobVariants}
        animate="animate"
        transition={{ delay: 4 }}
        className="absolute bottom-1/4 left-1/3 w-72 h-72
                   bg-pink-300 rounded-full mix-blend-multiply
                   filter blur-xl opacity-70"
      />

      {/* CENTER LOCK - Card Container */}
      <div className="relative z-10 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              key="question"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-white/30 backdrop-blur-lg
                         rounded-3xl
                         shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
                         p-8 md:p-12 text-center
                         w-[90%] max-w-lg mx-auto"
            >
              <motion.div
                className="mb-6 text-7xl md:text-8xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💖
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-md">
                Will You Be My Lil Mama😉😘?
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-sm">
                Every moment with you is magic ✨ <br />
                I want to make it official!
              </p>

              <div className="flex flex-col md:flex-row gap-6 justify-center items-center h-32 relative w-full">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleYes}
                  className="px-10 py-3 bg-gradient-to-r
                             from-green-400 to-emerald-600
                             text-white text-xl font-bold
                             rounded-full shadow-lg" 
                >
                  YES! 😍
                </motion.button>

                <motion.button
                  animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
                  onHoverStart={moveNoButton}
                  onClick={handleNoClick}
                  // FIX APPLIED: Added onTouchStart to trigger running logic immediately on mobile touch
                  onTouchStart={handleNoClick} 
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="px-10 py-3 bg-white/20 text-white
                             text-xl font-bold rounded-full
                             backdrop-blur-sm
                             hover:bg-rose-500 hover:border-rose-500 absolute cursor-pointer" 
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
              className="bg-white/30 backdrop-blur-lg
                         rounded-3xl
                         shadow-2xl p-8 md:p-12 text-center
                         w-[90%] max-w-lg mx-auto"
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                💑
              </motion.div>

              <h2 className="text-5xl font-black text-white mb-6 drop-shadow-lg">
                WOHOOO! 🎉
              </h2>

              <p className="text-2xl text-white font-bold mb-6">
                Best. Decision. Ever.
              </p>

              <p className="text-lg text-white/90 mb-8">
                Get ready for a lot of love, snacks, and annoying selfies! 📸
              </p>

              <button
                onClick={() => {
                  setAnswered(false);
                  setAccepted(false);
                  setHoverCount(0);
                  setNoBtnPosition({ x: 0, y: 0 });
                }}
                className="px-8 py-3 bg-white/20 text-white
                           rounded-full hover:bg-white/40 font-semibold"
              >
                ↺ Replay The Moment
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;