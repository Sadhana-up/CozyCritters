import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import FloatingHearts from "../components/FloatingHearts";
import AnimatedCritter from "../components/AnimatedCritter";
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden day-bg-overlay px-4 py-8">
      {/* Floating Hearts background */}
      <FloatingHearts count={10} />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Peek-a-boo Critter */}
        <div className="mb-[-28px] z-20 flex flex-col items-center select-none">
          <div className="bg-white border-[3px] border-cozy-dark rounded-xl px-4 py-1.5 shadow-sm text-xs font-bold text-cozy-dark mb-1 animate-bounce">
            Welcome back!
          </div>
          <AnimatedCritter actionState="idle" className="w-28 h-28" />
        </div>

        {/* Card containing login form */}
        <Card className="w-full border-[3px] pt-12 pb-6 px-6 md:px-8 bg-white flex flex-col gap-6">
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
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cozy_caretaker"
                className="w-full px-4 py-3 rounded-xl border-[2.5px] border-cozy-dark focus:border-cozy-pink font-semibold text-cozy-dark bg-[#FFFDF9] outline-none transition-colors placeholder:text-cozy-dark/20 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-cozy-dark/70 ml-1">
                PASSWORD
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
              variant="pink"
              disabled={loading}
              className="w-full py-3.5 text-base font-extrabold border-[3px] mt-2 shadow-cozy hover:shadow-cozy-lg"
            >
              {loading ? "Entering your cozy world..." : "Enter"}
            </Button>
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
