import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Volume2, VolumeX, LogOut, Plus, 
  Trash2, User, Sparkles, Heart, HelpCircle 
} from 'lucide-react';

import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import FloatingHearts from '../components/FloatingHearts';
import CritterAvatar from '../components/CritterAvatar';
import StatBar from '../components/StatBar';
import DialogueBubble from '../components/DialogueBubble';
import { critterService, authService } from '../services/api';
import { soundManager } from '../utils/sound';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Game states
  const [critters, setCritters] = useState([]);
  const [activeCritter, setActiveCritter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState('idle'); // idle, feed, play, sleep
  const [dialogue, setDialogue] = useState('');
  const [actionError, setActionError] = useState('');
  
  // Custom toggles
  const [nightMode, setNightMode] = useState(localStorage.getItem('cozy_night_mode') === 'true');
  const [muted, setMuted] = useState(soundManager.getMuteState());

  // Adoption modal
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSpecies, setNewSpecies] = useState('Bunny');
  const [newDescription, setNewDescription] = useState('');
  const [adoptLoading, setAdoptLoading] = useState(false);
  const [adoptError, setAdoptError] = useState('');

  // Fetch initial pets list
  const fetchCritters = async (selectId = null) => {
    try {
      const data = await critterService.getAll();
      setCritters(data);
      
      if (data.length > 0) {
        // If an ID was requested, find it, otherwise default to the first pet
        const defaultPet = selectId 
          ? data.find(p => p.id === selectId) || data[0]
          : data[0];
        setActiveCritter(defaultPet);
        updateDialogueBasedOnStats(defaultPet);
      } else {
        setActiveCritter(null);
        setDialogue("I don't have any pets yet! Click the '+' button to adopt a companion! 🐾");
      }
    } catch (err) {
      console.error("Failed to load critters", err);
      setActionError("Unable to load pet database! 🥺");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchCritters();
  }, [navigate]);

  // Update background settings
  const toggleNightMode = () => {
    const nextState = !nightMode;
    setNightMode(nextState);
    localStorage.setItem('cozy_night_mode', nextState);
    soundManager.playClick();
  };

  const toggleMute = () => {
    const nextState = soundManager.toggleMute();
    setMuted(nextState);
    soundManager.playClick();
  };

  // Generate dynamic pet lines based on physical status
  const updateDialogueBasedOnStats = (pet) => {
    if (!pet) return;
    
    // Check night time first
    if (nightMode) {
      if (pet.energy < 40) {
        setDialogue("Yawn... the stars are so pretty but I'm ready to cuddle up and sleep! 😴🌙");
        return;
      }
      setDialogue("Look at the night sky! Are there shooting stars? ⭐️✨");
      return;
    }

    // Daytime metrics
    if (pet.energy < 30) {
      setDialogue("I'm so exhausted... I need a warm cozy nap. Let's sleep! 😴");
    } else if (pet.hunger > 70) {
      setDialogue("Tummy rumbles! 😫 Can I have a delicious apple? 🍎");
    } else if (pet.happiness < 40) {
      setDialogue("I feel a little lonely... let's play fetch with the tennis ball! 🥺🎾");
    } else {
      const randomPhrases = [
        "You are my favorite caretaker! 🥰🌸",
        "Look! A beautiful butterfly just flew past! 🦋✨",
        "Snuggle time? I love cozy soft blankets! ☁️❤️",
        "Munching snacks is my absolute favorite thing! 🍉",
        "I love exploring the sunny flower gardens! 🌻✨",
        "Shall we sing a sweet chiptune song? 🎵🐾",
      ];
      setDialogue(randomPhrases[pet.id % randomPhrases.length]);
    }
  };

  // Keep pet text updated on night theme toggle
  useEffect(() => {
    if (activeCritter && actionState === 'idle') {
      updateDialogueBasedOnStats(activeCritter);
    }
  }, [nightMode, activeCritter]);

  // Action handlers
  const handleFeed = async () => {
    if (!activeCritter || actionState !== 'idle') return;
    setActionError('');
    setActionState('feed');
    soundManager.playEat();
    
    const responses = [
      "Munch munch... oh! This is incredibly yummy! 🍎😋",
      "Delicious apple! Crunch crunch... thank you! 🍏✨",
      "Yum! My tummy is warm and full now! 🥰"
    ];
    setDialogue(responses[Math.floor(Math.random() * responses.length)]);

    try {
      const updatedPet = await critterService.feed(activeCritter.id);
      setTimeout(() => {
        setActiveCritter(updatedPet);
        setActionState('idle');
        updateDialogueBasedOnStats(updatedPet);
        // Refresh local items
        setCritters(prev => prev.map(c => c.id === updatedPet.id ? updatedPet : c));
      }, 1500);
    } catch (err) {
      console.error(err);
      setActionState('idle');
      const errMsg = err.response?.data?.detail || "Could not feed critter! 🥺";
      setActionError(errMsg);
      setDialogue("Oh no... I couldn't eat that snack! 🥺");
    }
  };

  const handlePlay = async () => {
    if (!activeCritter || actionState !== 'idle') return;
    setActionError('');
    setActionState('play');
    soundManager.playBoing();
    
    const responses = [
      "Wheee! Bouncing high is so much fun! 🎾✨",
      "Look at me jump! Yay, let's play forever! 🤸‍♂️🌸",
      "Chasing balls is the best game ever! 🥰🐾"
    ];
    setDialogue(responses[Math.floor(Math.random() * responses.length)]);

    try {
      const updatedPet = await critterService.play(activeCritter.id);
      setTimeout(() => {
        setActiveCritter(updatedPet);
        setActionState('idle');
        updateDialogueBasedOnStats(updatedPet);
        setCritters(prev => prev.map(c => c.id === updatedPet.id ? updatedPet : c));
      }, 1800);
    } catch (err) {
      console.error(err);
      setActionState('idle');
      const errMsg = err.response?.data?.detail || "Could not play! 🥺";
      setActionError(errMsg);
      setDialogue("Aww... I'm too tired to play right now! 😴");
    }
  };

  const handleSleep = async () => {
    if (!activeCritter || actionState !== 'idle') return;
    setActionError('');
    setActionState('sleep');
    soundManager.playSnore();
    
    setDialogue("Shh... closing my eyes... sweet dreams of starry skies... 😴⭐️🌙");

    try {
      const updatedPet = await critterService.sleep(activeCritter.id);
      
      // Let them nap for 2 seconds
      setTimeout(() => {
        setActiveCritter(updatedPet);
        setActionState('idle');
        updateDialogueBasedOnStats(updatedPet);
        setCritters(prev => prev.map(c => c.id === updatedPet.id ? updatedPet : c));
      }, 2500);
    } catch (err) {
      console.error(err);
      setActionState('idle');
      const errMsg = err.response?.data?.detail || "Could not sleep! 🥺";
      setActionError(errMsg);
      setDialogue("I couldn't sleep... the blanket is missing! 🥺");
    }
  };

  // Adopt new critter
  const handleAdopt = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setAdoptError("Your pet needs a cute name! 🥺");
      return;
    }
    
    setAdoptError('');
    setAdoptLoading(true);

    try {
      const newPet = await critterService.create(newName, newSpecies, newDescription);
      soundManager.playSuccess();
      setShowAdoptModal(false);
      
      // Reset forms
      setNewName('');
      setNewDescription('');
      setNewSpecies('Bunny');
      
      // Refresh database list and select the newly adopted pet
      await fetchCritters(newPet.id);
    } catch (err) {
      console.error(err);
      setAdoptError(err.response?.data?.detail || "Adoption failed! Try another name. 🥺");
    } finally {
      setAdoptLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden transition-colors duration-1000 p-4 md:p-6 ${nightMode ? 'pastel-gradient-night text-white night-bg-overlay' : 'pastel-gradient-day text-cozy-dark day-bg-overlay'}`}>
      
      {/* Background drifting items */}
      <FloatingHearts count={12} nightMode={nightMode} />

      {/* Top Navbar */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex justify-between items-center bg-white/40 backdrop-blur-md border-[2.5px] border-cozy-dark/15 rounded-3xl p-3 md:px-6 shadow-sm">
        <div className="flex items-center gap-2 select-none cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl animate-pulse">🐾</span>
          <span className="text-lg font-black tracking-tight text-cozy-dark">CozyCritters</span>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button 
            onClick={toggleMute} 
            title={muted ? "Unmute Sounds" : "Mute Sounds"}
            className="p-2 border-[2.5px] border-cozy-dark rounded-xl bg-white hover:bg-neutral-50 active:scale-95 transition-all text-cozy-dark shadow-sm"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleNightMode} 
            title={nightMode ? "Switch to Day Mode" : "Switch to Night Mode"}
            className="p-2 border-[2.5px] border-cozy-dark rounded-xl bg-white hover:bg-neutral-50 active:scale-95 transition-all text-cozy-dark shadow-sm"
          >
            {nightMode ? <Sun size={18} className="text-cozy-yellow" /> : <Moon size={18} className="text-cozy-violet" />}
          </button>

          {/* Profile link */}
          <button 
            onClick={() => navigate('/profile')} 
            title="User Profile"
            className="p-2 border-[2.5px] border-cozy-dark rounded-xl bg-white hover:bg-neutral-50 active:scale-95 transition-all text-cozy-dark shadow-sm flex items-center gap-1.5 font-bold text-xs"
          >
            <User size={18} />
            <span className="hidden sm:inline">Profile</span>
          </button>

          {/* Logout */}
          <button 
            onClick={handleLogout} 
            title="Sign Out"
            className="p-2 border-[2.5px] border-cozy-dark rounded-xl bg-cozy-pink hover:bg-[#FFA5A0] active:scale-95 transition-all text-cozy-dark shadow-sm"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Game Screen */}
      <main className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center py-4">
        
        {/* Left Side: Pets List Navigation */}
        <div className="lg:col-span-3 flex flex-col gap-3 max-h-[300px] lg:max-h-[500px] overflow-y-auto pr-1">
          <div className="flex justify-between items-center px-1">
            <h3 className={`text-xs font-black uppercase tracking-wider ${nightMode ? 'text-white/60' : 'text-cozy-dark/60'}`}>
              My Companions 🐹
            </h3>
            
            <button
              onClick={() => { soundManager.playClick(); setShowAdoptModal(true); }}
              className="p-1 border-2 border-cozy-dark rounded-lg bg-cozy-green hover:bg-[#B7DBB8] active:scale-90 text-cozy-dark transition-all shadow-sm flex items-center justify-center"
              title="Adopt new pet"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-6 text-xs font-bold opacity-60">
              Gathering pets... ⏳
            </div>
          ) : critters.length === 0 ? (
            <div className="bg-white/40 border-2 border-dashed border-cozy-dark/20 rounded-2xl p-4 text-center text-xs font-bold opacity-70">
              No pets adopted yet! Click '+' above to start! 🥺
            </div>
          ) : (
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {critters.map((pet) => {
                const isSelected = activeCritter && activeCritter.id === pet.id;
                const petSpeciesEmoji = {
                  bunny: '🐰', kitty: '🐱', bear: '🐻', frog: '🐸', critter: '🐹'
                }[pet.species.toLowerCase()] || '🐹';

                return (
                  <button
                    key={pet.id}
                    onClick={() => {
                      if (actionState !== 'idle') return;
                      soundManager.playClick();
                      setActiveCritter(pet);
                      updateDialogueBasedOnStats(pet);
                      setActionError('');
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-[2.5px] border-cozy-dark font-bold text-sm text-left transition-all shadow-bubble active:shadow-bubble-active active:translate-y-0.5 shrink-0 select-none ${
                      isSelected 
                        ? 'bg-cozy-yellow text-cozy-dark border-[3px] scale-102 shadow-none translate-y-[2px]' 
                        : 'bg-white hover:bg-neutral-50 text-cozy-dark'
                    }`}
                  >
                    <span className="text-xl">{petSpeciesEmoji}</span>
                    <div className="flex flex-col">
                      <span className="truncate max-w-[80px] lg:max-w-[120px] leading-tight">{pet.name}</span>
                      <span className="text-[10px] text-cozy-dark/45 font-semibold capitalize">{pet.species}</span>
                    </div>
                    {isSelected && <span className="ml-auto text-xs animate-pulse">⭐</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Center Sandbox: Animated Virtual Pet & Speech bubble */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4 relative min-h-[320px]">
          
          {/* Action Warnings Toast Above Pet */}
          <AnimatePresence>
            {actionError && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: -8, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="absolute top-0 z-30 bg-[#FFDADA] border-[2.5px] border-[#D35D57] rounded-xl px-4 py-2 text-xs font-bold text-[#D35D57] text-center shadow-md flex items-center gap-1.5"
              >
                <span>⚠️</span>
                <span>{actionError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dialogue text bubble */}
          {activeCritter && (
            <div className="h-16 flex items-end justify-center">
              <DialogueBubble message={dialogue} />
            </div>
          )}

          {/* Core Interactive Avatar */}
          {activeCritter ? (
            <CritterAvatar 
              species={activeCritter.species} 
              actionState={actionState} 
              className="w-56 h-56 md:w-60 md:h-60"
            />
          ) : (
            <div className="w-56 h-56 flex flex-col items-center justify-center text-center gap-4">
              <span className="text-6xl animate-bounce">🥚</span>
              <p className="text-sm font-bold opacity-60">Adopt your very first virtual companion!</p>
              <Button variant="green" onClick={() => setShowAdoptModal(true)} className="px-4 py-2 text-xs border-2">
                Adopt Now! 🐾
              </Button>
            </div>
          )}

          {/* Pet Name & Mood Indicator Badge */}
          {activeCritter && (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white/80 backdrop-blur-sm border-[2.5px] border-cozy-dark px-5 py-1.5 rounded-full text-cozy-dark font-black text-sm shadow-sm flex items-center gap-2 select-none"
            >
              <span className="capitalize">{activeCritter.name} the {activeCritter.species}</span>
              <span className="bg-cozy-peach/40 border border-cozy-dark/10 px-2 py-0.5 rounded-full text-xs font-semibold">
                {activeCritter.status || '😐 Neutral'}
              </span>
            </motion.div>
          )}
        </div>

        {/* Right Side: Caretaking Controls & Stats Dashboard */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {activeCritter ? (
            <Card className="border-[3px] p-5 md:p-6 bg-white/95 backdrop-blur-sm flex flex-col gap-6">
              
              {/* Pet Stats */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black text-cozy-dark/60 uppercase tracking-wide border-b border-cozy-dark/5 pb-2">
                  Pet Vitality 📊
                </h3>
                
                {/* 1. Fullness Bar (representing 100 - hunger) */}
                <StatBar
                  label="Fullness"
                  value={100 - activeCritter.hunger}
                  icon="🍎"
                  color="yellow"
                />

                {/* 2. Happiness Bar */}
                <StatBar
                  label="Happiness"
                  value={activeCritter.happiness}
                  icon="💖"
                  color="pink"
                />

                {/* 3. Energy Bar */}
                <StatBar
                  label="Energy"
                  value={activeCritter.energy}
                  icon="⚡"
                  color="green"
                />
              </div>

              {/* Action Buttons Panel */}
              <div className="flex flex-col gap-3.5 pt-2">
                <h3 className="text-sm font-black text-cozy-dark/60 uppercase tracking-wide border-b border-cozy-dark/5 pb-2">
                  Care Actions 🎮
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {/* Feed Button */}
                  <Button
                    variant="yellow"
                    onClick={handleFeed}
                    disabled={actionState !== 'idle'}
                    className="flex-col py-3 border-[2.5px] rounded-2xl text-xs gap-1"
                    title="Feed Pet (-30 Hunger, -5 Energy)"
                  >
                    <span className="text-xl">🍎</span>
                    <span>Feed</span>
                  </Button>

                  {/* Play Button */}
                  <Button
                    variant="pink"
                    onClick={handlePlay}
                    disabled={actionState !== 'idle'}
                    className="flex-col py-3 border-[2.5px] rounded-2xl text-xs gap-1"
                    title="Play with Pet (+25 Happiness, +15 Hunger, -20 Energy)"
                  >
                    <span className="text-xl">🎾</span>
                    <span>Play</span>
                  </Button>

                  {/* Sleep Button */}
                  <Button
                    variant="green"
                    onClick={handleSleep}
                    disabled={actionState !== 'idle'}
                    className="flex-col py-3 border-[2.5px] rounded-2xl text-xs gap-1"
                    title="Sleep Pet (+40 Energy, +5 Hunger)"
                  >
                    <span className="text-xl">😴</span>
                    <span>Sleep</span>
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="border-[3px] p-6 text-center bg-white/70">
              <HelpCircle size={40} className="mx-auto text-cozy-dark/30 mb-2" />
              <p className="text-sm font-bold opacity-60">Adopt or select a pet to access caretaking stats and controls!</p>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs font-semibold opacity-40 py-2">
        <p>🐾 Keep your critters happy and full! Day/Night cycles affect their sleeping mood 🌙</p>
      </footer>

      {/* ================= ADOPTION MODAL ================= */}
      <AnimatePresence>
        {showAdoptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-cozy-dark/40 backdrop-blur-sm select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="w-full max-w-md bg-white border-[4px] border-cozy-dark rounded-[2.5rem] p-6 shadow-cozy relative overflow-hidden"
            >
              {/* Cute sparkles inside modal */}
              <div className="absolute top-2 right-2 text-xl opacity-60">✨</div>
              <div className="absolute bottom-2 left-2 text-xl opacity-60">🌸</div>

              <div className="text-center mb-5">
                <h3 className="text-2xl font-black text-cozy-dark">Adopt Companion 🥚🐾</h3>
                <p className="text-xs text-cozy-dark/50 font-bold mt-1">Select a species and give them a wonderful name!</p>
              </div>

              {adoptError && (
                <div className="bg-cozy-pink/20 border-2 border-cozy-pink rounded-xl p-3 text-center text-xs font-bold text-[#D35D57] mb-4 flex items-center justify-center gap-1.5">
                  <span>⚠️</span>
                  <span>{adoptError}</span>
                </div>
              )}

              <form onSubmit={handleAdopt} className="flex flex-col gap-4">
                {/* 1. Name Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-cozy-dark/70 ml-1">COMPANION'S NAME</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Bouncy, Sparky, Fluffy..."
                    maxLength={15}
                    className="w-full px-4 py-3 rounded-xl border-[2.5px] border-cozy-dark focus:border-cozy-pink font-semibold text-cozy-dark bg-[#FFFDF9] outline-none text-sm"
                  />
                </div>

                {/* 2. Species Grid Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-cozy-dark/70 ml-1">SPECIES VARIETY</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { name: 'Bunny', emoji: '🐰' },
                      { name: 'Kitty', emoji: '🐱' },
                      { name: 'Bear', emoji: '🐻' },
                      { name: 'Frog', emoji: '🐸' },
                      { name: 'Critter', emoji: '🐹' },
                    ].map((sp) => {
                      const isSelected = newSpecies === sp.name;
                      return (
                        <button
                          key={sp.name}
                          type="button"
                          onClick={() => { soundManager.playClick(); setNewSpecies(sp.name); }}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 border-cozy-dark transition-all ${
                            isSelected 
                              ? 'bg-cozy-peach scale-105 border-[2.5px]' 
                              : 'bg-white hover:bg-neutral-50'
                          }`}
                        >
                          <span className="text-xl">{sp.emoji}</span>
                          <span className="text-[9px] font-bold text-cozy-dark/60 leading-none">{sp.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Description Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-cozy-dark/70 ml-1">PET BIO / MEMO</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="A cozy companion who loves apple slices and sweet afternoon naps..."
                    maxLength={100}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border-[2.5px] border-cozy-dark focus:border-cozy-pink font-semibold text-cozy-dark bg-[#FFFDF9] outline-none text-xs resize-none"
                  />
                </div>

                {/* 4. Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="white"
                    onClick={() => { soundManager.playClick(); setShowAdoptModal(false); }}
                    disabled={adoptLoading}
                    className="py-3 text-xs border-[2.5px] rounded-xl shadow-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="green"
                    disabled={adoptLoading}
                    className="py-3 text-xs border-[2.5px] rounded-xl shadow-none"
                  >
                    {adoptLoading ? 'Adopting... ⏳' : 'Adopt Pet! 🐾'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
