import { motion } from "framer-motion";
// import { Github, Instagram, Linkedin } from "lucide-react"; // Import icons
import img from "../assets/img.png";

export default function AboutMe() {


  return (
    <div className="relative z-10 w-full h-screen overflow-hidden px-8 py-16 flex flex-col items-center pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl mt-16 font-extrabold tracking-tight text-neutral-900 drop-shadow-sm">
          About <span className="text-primary">Me</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-3xl mx-auto mt-8 bg-white/60 backdrop-blur-xl border border-neutral-200/80 rounded-3xl p-12 shadow-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
          className="w-32 h-32 mx-auto bg-neutral-200 rounded-full mb-6 overflow-hidden shadow-lg border-4 border-white"
        >
          <img src={img} alt="Profile" className="w-full h-full object-cover" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-neutral-800">Aditya Srivastava</h2>
        <p className="text-neutral-500 mt-2">CS Student</p>

      

        <div className="mt-8 space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="p-6 bg-white/50 rounded-2xl border border-neutral-100"
          >
            <h3 className="text-lg font-semibold text-neutral-800">CS Student</h3>
            <p className="text-neutral-600 text-sm">I code.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="p-6 bg-white/50 rounded-2xl border border-neutral-100"
          >
            <h3 className="text-lg font-semibold text-neutral-800">ASET '27'</h3>
            <p className="text-neutral-600 text-sm">Amity School of Engineering and Technology.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}