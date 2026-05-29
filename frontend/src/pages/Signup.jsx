import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import FloatingHearts from "../components/FloatingHearts";
import AnimatedCritter from "../components/AnimatedCritter";
import { authService } from "../services/api";
import { soundManager } from "../utils/sound";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 letters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1. Sign up the user (FastAPI automatically creates default pet)
      await authService.signup(email, username, password);

      // 2. Automatically log them in
      await authService.login(username, password);

      // Play level-up sound for pet creation success!
      soundManager.playSuccess();

      // Redirect directly to the dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Registration failed! Username or email might be taken",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden day-bg-overlay px-4 py-8">
      {/* Floating Hearts background */}
      <FloatingHearts count={10} />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Peek-a-boo Critter */}
        <div className="mb-[-28px] z-20 flex flex-col items-center select-none">
          <div className="bg-white border-[3px] border-cozy-dark rounded-xl px-4 py-1.5 shadow-sm text-xs font-bold text-cozy-dark mb-1 animate-bounce">
            Let's be friends!
          </div>
          <AnimatedCritter actionState="happy" className="w-28 h-28" />
        </div>

        {/* Card containing signup form */}
        <Card className="w-full border-[3px] pt-12 pb-6 px-6 md:px-8 bg-white flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-cozy-dark">
              Adopt a Companion
            </h2>
            <p className="text-xs font-medium text-cozy-dark/50 mt-1">
              Start your cozy caretaking journey
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-cozy-dark/70 ml-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="caretaker@gmail.com"
                className="w-full px-4 py-3 rounded-xl border-[2.5px] border-cozy-dark focus:border-cozy-pink font-semibold text-cozy-dark bg-[#FFFDF9] outline-none transition-colors placeholder:text-cozy-dark/20 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-cozy-dark/70 ml-1">
                CARETAKER USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cozy_caretaker"
                className="w-full px-4 py-3 rounded-xl border-[2.5px] border-cozy-dark focus:border-cozy-pink font-semibold text-cozy-dark bg-[#FFFDF9] outline-none transition-colors placeholder:text-cozy-dark/20 text-sm"
              />
              <span className="text-[10px] text-cozy-dark/40 font-bold ml-1">
                Your companion's name is magically chosen based on your
                username!
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-cozy-dark/70 ml-1">
                CREATE PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-[2.5px] border-cozy-dark focus:border-cozy-pink font-semibold text-cozy-dark bg-[#FFFDF9] outline-none transition-colors placeholder:text-cozy-dark/20 text-sm"
              />
            </div>

            <Button
              type="submit"
              variant="sky"
              disabled={loading}
              className="w-full py-3.5 text-base font-extrabold border-[3px] mt-2 shadow-cozy hover:shadow-cozy-lg"
            >
              {loading ? "Hatching your companion..." : "Adopt & Start"}
            </Button>
          </form>

          <div className="border-t-[2.5px] border-cozy-dark/5 pt-4 text-center">
            <p className="text-xs font-bold text-cozy-dark/50">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-cozy-sky hover:underline font-extrabold ml-0.5"
              >
                Login here
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

export default Signup;
