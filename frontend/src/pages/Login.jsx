import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import FloatingHearts from "../components/FloatingHearts";
import AnimatedCritter from "../components/AnimatedCritter";
import DreamyBackground from "../components/DreamyBackground";
import Jelly3DButton from "../components/Jelly3DButton";
import { authService } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await authService.login(username, password);
      // Success! Play chime and redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Incorrect username or password. Please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF0E6] via-[#FFFDF9] to-[#FFEAE5] px-4 py-8">
      {/* Dreamy background */}
      <DreamyBackground />

      {/* Floating Hearts background */}
      <FloatingHearts count={12} />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Peek-a-boo Critter */}
        <motion.div
          className="mb-[-28px] z-20 flex flex-col items-center select-none"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-gradient-to-r from-cozy-pink to-cozy-purple border-[3px] border-cozy-dark rounded-xl px-4 py-1.5 shadow-sm text-xs font-bold text-white mb-1"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Welcome back!
          </motion.div>
          <AnimatedCritter actionState="idle" className="w-28 h-28" />
        </motion.div>

        {/* Card containing login form */}
        <Card className="w-full border-[3px] pt-12 pb-6 px-6 md:px-8 bg-gradient-to-br from-white to-cozy-pink/5 flex flex-col gap-6 shadow-cozy-lg">
          <div className="text-center">
            <h2 className="text-2xl font-black text-cozy-dark">Sign In</h2>
            <p className="text-xs font-medium text-cozy-dark/50 mt-1">
              Rejoin your companions
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-cozy-pink/20 border-2 border-cozy-pink rounded-xl p-3 text-center text-xs font-bold text-[#D35D57] flex items-center justify-center gap-1.5"
            >
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-cozy-dark/70 ml-1">
                USERNAME
              </label>
              <motion.input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cozy_caretaker"
                whileFocus={{ scale: 1.02 }}
                className="w-full px-4 py-3.5 rounded-xl border-[2.5px] border-cozy-dark focus:border-cozy-pink font-semibold text-cozy-dark bg-gradient-to-br from-[#FFFDF9] to-cozy-pink/10 outline-none transition-all placeholder:text-cozy-dark/20 text-sm shadow-sm focus:shadow-cozy-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-cozy-dark/70 ml-1">
                PASSWORD
              </label>
              <motion.input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                whileFocus={{ scale: 1.02 }}
                className="w-full px-4 py-3.5 rounded-xl border-[2.5px] border-cozy-dark focus:border-cozy-pink font-semibold text-cozy-dark bg-gradient-to-br from-[#FFFDF9] to-cozy-pink/10 outline-none transition-all placeholder:text-cozy-dark/20 text-sm shadow-sm focus:shadow-cozy-sm"
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="submit"
                variant="pink"
                disabled={loading}
                className="w-full py-4 text-base font-extrabold border-[3px] mt-2 shadow-cozy hover:shadow-cozy-lg transition-all bg-gradient-to-r from-cozy-pink to-rose-300"
              >
                {loading ? "Entering your cozy world..." : "Enter"}
              </Button>
            </motion.div>
          </form>

          <div className="border-t-[2.5px] border-cozy-dark/5 pt-4 text-center">
            <p className="text-xs font-bold text-cozy-dark/50">
              New to CozyCritters?{" "}
              <Link
                to="/signup"
                className="text-cozy-pink hover:underline font-extrabold ml-0.5"
              >
                Adopt a companion
              </Link>
            </p>
          </div>
        </Card>

        {/* Back Link */}
        <Link
          to="/"
          className="mt-4 text-xs font-bold text-cozy-dark/40 hover:text-cozy-dark transition-colors"
        >
          ← Back to Title
        </Link>
      </div>
    </div>
  );
};

export default Login;
