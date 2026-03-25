import { motion } from 'framer-motion';

const storyParagraphs = [
  {
    text: "We met on a random chat on Emerald.",
    highlight: false
  },
  {
    text: "It started with just a simple \"hi\" — nothing special, just another conversation.",
    highlight: false
  },
  {
    text: "But somehow, it stayed.",
    highlight: true
  },
  {
    text: "We moved to Discord without thinking much of it.",
    highlight: false
  },
  {
    text: "And slowly, it became more than just random chats.",
    highlight: false
  },
  {
    text: "You became someone I go to when things don't feel right.",
    highlight: false
  },
  {
    text: "Not because you fix everything,",
    highlight: false
  },
  {
    text: "but because you understand.",
    highlight: true
  },
  {
    text: "We've had our share of fights.",
    highlight: false
  },
  {
    text: "I've said things I shouldn't have.",
    highlight: false
  },
  {
    text: "But somehow, you stayed.",
    highlight: true
  },
  {
    text: "And that means more than anything.",
    highlight: false
  },
  {
    text: "There are nights where we just sit on calls,",
    highlight: false
  },
  {
    text: "watching something,",
    highlight: false
  },
  {
    text: "barely talking.",
    highlight: false
  },
  {
    text: "And somehow, those quiet moments feel full.",
    highlight: true
  },
  {
    text: "I still remember our first movie — Terminal.",
    highlight: false
  },
  {
    text: "And that stupid thing we made ours:",
    highlight: false
  },
  {
    text: "\"bite to eat <3\"",
    highlight: true,
    special: true
  },
  {
    text: "\"eat to bite <3\"",
    highlight: true,
    special: true
  },
  {
    text: "Time has never been on our side.",
    highlight: false
  },
  {
    text: "India and Greece don't make it easy.",
    highlight: false
  },
  {
    text: "You coming home late, me waking up early.",
    highlight: false
  },
  {
    text: "Sometimes I skip things I shouldn't.",
    highlight: false
  },
  {
    text: "Sometimes I fall asleep when I shouldn't.",
    highlight: false
  },
  {
    text: "And I hate that.",
    highlight: false
  },
  {
    text: "But even with all that,",
    highlight: false
  },
  {
    text: "we still find time.",
    highlight: true
  },
  {
    text: "And I'm really glad we did.",
    highlight: true
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
};

export function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-12 md:py-20"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="text-4xl">✨</span>
          </motion.div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Our Story
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto" />
        </motion.div>

        {/* Story Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          {storyParagraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              variants={itemVariants}
              className={`leading-relaxed ${
                paragraph.special
                  ? 'font-serif text-xl md:text-2xl text-purple-300 italic text-center py-2'
                  : paragraph.highlight
                  ? 'font-serif text-lg md:text-xl text-white/90 py-1'
                  : 'text-base md:text-lg text-white/60'
              }`}
            >
              {paragraph.text}
            </motion.p>
          ))}
        </motion.div>

        {/* Footer decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="mt-20 text-center"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mx-auto mb-4" />
          <p className="text-white/30 text-sm font-light">
            a friendship that stayed
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
