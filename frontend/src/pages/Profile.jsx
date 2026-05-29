import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, Trash2, Edit2, ArrowLeft, Shield } from 'lucide-react';

import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import FloatingHearts from '../components/FloatingHearts';
import CritterAvatar from '../components/CritterAvatar';
import { authService, critterService } from '../services/api';
import { soundManager } from '../utils/sound';

const Profile = () => {
  const navigate = useNavigate();

  // Profile data states
  const [user, setUser] = useState(null);
  const [critters, setCritters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing and releasing states
  const [editingPet, setEditingPet] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [releasingPet, setReleasingPet] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProfileData = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
      
      const petList = await critterService.getAll();
      setCritters(petList);
    } catch (err) {
      console.error(err);
      setError("Could not retrieve caretaker records! 🥺");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchProfileData();
  }, [navigate]);

  // Rename pet
  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setError("Please input a valid pet name! 🥺");
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedPet = await critterService.update(editingPet.id, {
        name: editName,
        description: editDesc,
      });
      
      soundManager.playSuccess();
      setSuccess(`${editingPet.name} is now known as ${updatedPet.name}! ✨`);
      setEditingPet(null);
      
      // Refresh profile data
      await fetchProfileData();
    } catch (err) {
      console.error(err);
      setError("Failed to rename your companion! 🥺");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete pet (let go)
  const handleReleaseSubmit = async () => {
    if (!releasingPet) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await critterService.delete(releasingPet.id);
      soundManager.playSuccess();
      setSuccess(`You gently let ${releasingPet.name} go back to the wild fields. 🕊️🌾`);
      setReleasingPet(null);
      
      // Refresh profile data
      await fetchProfileData();
    } catch (err) {
      console.error(err);
      setError("Failed to release companion! 🥺");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden day-bg-overlay px-4 py-8 text-cozy-dark">
      {/* Background Hearts */}
      <FloatingHearts count={8} />

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col gap-6">
        
        {/* Navigation back */}
        <header className="flex justify-between items-center px-1">
          <Button 
            variant="white" 
            onClick={() => { soundManager.playClick(); navigate('/dashboard'); }}
            className="px-4 py-2 border-[2.5px] rounded-xl shadow-none hover:-translate-y-0.5 active:translate-y-0.5 text-xs flex items-center gap-1.5 font-bold"
          >
            <ArrowLeft size={16} />
            Back to Garden
          </Button>
          
          <h2 className="text-xl font-black">Caretaker Office 🐾</h2>
        </header>

        {loading ? (
          <div className="text-center py-20 text-sm font-bold opacity-60">
            Consulting caretaker files... ⏳
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Side: Caretaker Profile Card */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <Card className="border-[3px] bg-white p-5 flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 rounded-full border-3 border-cozy-dark bg-cozy-yellow flex items-center justify-center text-3xl shadow-sm select-none">
                  🧑‍🌾
                </div>

                <div className="flex flex-col gap-0.5">
                  <h3 className="text-lg font-black">{user?.username}</h3>
                  <span className="text-xs bg-cozy-green px-2 py-0.5 rounded-full border border-cozy-dark/10 font-bold">
                    Official Caretaker
                  </span>
                </div>

                <div className="w-full border-t border-cozy-dark/5 pt-4 flex flex-col gap-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-cozy-dark/70">
                    <Mail size={15} className="text-cozy-dark/40" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-cozy-dark/70">
                    <Shield size={15} className="text-cozy-dark/40" />
                    <span>ID: #{user?.id}</span>
                  </div>
                </div>

                <Button 
                  variant="pink" 
                  onClick={() => {
                    authService.logout();
                    navigate('/');
                  }} 
                  className="w-full text-xs py-2 border-2 rounded-xl shadow-none"
                >
                  Log Out
                </Button>
              </Card>
            </div>

            {/* Right Side: Pets Inventory Summary */}
            <div className="md:col-span-8 flex flex-col gap-4">
              
              {/* Notifications Toast */}
              {error && (
                <div className="bg-cozy-pink/20 border-2 border-cozy-pink rounded-xl p-3 text-center text-xs font-bold text-[#D35D57] flex items-center justify-center gap-1.5">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-cozy-green/20 border-2 border-cozy-green rounded-xl p-3 text-center text-xs font-bold text-[#4B794E] flex items-center justify-center gap-1.5">
                  <span>✨</span>
                  <span>{success}</span>
                </div>
              )}

              <Card className="border-[3px] bg-white/95 p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-cozy-dark/5 pb-3">
                  <h3 className="text-sm font-black text-cozy-dark/60 uppercase tracking-wide">
                    Companion Roster ({critters.length})
                  </h3>
                </div>

                {critters.length === 0 ? (
                  <div className="text-center py-10 text-xs font-bold opacity-60 flex flex-col items-center gap-2">
                    <span className="text-4xl">🥚</span>
                    <span>No pets are currently in your care.</span>
                    <Button variant="green" onClick={() => navigate('/dashboard')} className="mt-2 px-4 py-2 text-xs border-2">
                      Adopt Companion!
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {critters.map((pet) => {
                      const petSpeciesEmoji = {
                        bunny: '🐰', kitty: '🐱', bear: '🐻', frog: '🐸', critter: '🐹'
                      }[pet.species.toLowerCase()] || '🐹';

                      return (
                        <div 
                          key={pet.id}
                          className="flex items-center justify-between p-3 border-2 border-cozy-dark/15 rounded-2xl bg-white hover:bg-neutral-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{petSpeciesEmoji}</span>
                            <div className="flex flex-col">
                              <span className="font-black text-sm capitalize">{pet.name}</span>
                              <span className="text-[10px] text-cozy-dark/50 font-bold truncate max-w-[150px] sm:max-w-[280px]">
                                {pet.description || `A friendly little ${pet.species}.`}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {/* Rename Pet */}
                            <button
                              onClick={() => {
                                soundManager.playClick();
                                setEditingPet(pet);
                                setEditName(pet.name);
                                setEditDesc(pet.description || '');
                              }}
                              className="p-2 border-2 border-cozy-dark rounded-xl bg-cozy-yellow hover:bg-[#F3CFA8] active:scale-95 text-cozy-dark transition-all shadow-sm"
                              title="Rename Companion"
                            >
                              <Edit2 size={14} />
                            </button>

                            {/* Release Pet */}
                            <button
                              onClick={() => {
                                soundManager.playClick();
                                setReleasingPet(pet);
                              }}
                              className="p-2 border-2 border-cozy-dark rounded-xl bg-cozy-pink hover:bg-[#FFA5A0] active:scale-95 text-cozy-dark transition-all shadow-sm"
                              title="Release Companion"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs font-semibold opacity-30 py-4">
        <p>🌸 Thank you for keeping our animals safe and cozy! 🌾</p>
      </footer>

      {/* ================= EDIT MODAL ================= */}
      <AnimatePresence>
        {editingPet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-cozy-dark/40 backdrop-blur-sm select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="w-full max-w-md bg-white border-[4px] border-cozy-dark rounded-[2.5rem] p-6 shadow-cozy"
            >
              <div className="text-center mb-5">
                <h3 className="text-xl font-black text-cozy-dark">Rename Companion ✏️</h3>
                <p className="text-xs text-cozy-dark/50 font-bold mt-1">Provide a new identity for {editingPet.name}!</p>
              </div>

              <form onSubmit={handleRenameSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-cozy-dark/70 ml-1">NEW NAME</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={15}
                    className="w-full px-4 py-3 rounded-xl border-[2.5px] border-cozy-dark focus:border-cozy-pink font-semibold text-cozy-dark bg-[#FFFDF9] outline-none text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-cozy-dark/70 ml-1">NEW PET BIO</label>
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    maxLength={100}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border-[2.5px] border-cozy-dark focus:border-cozy-pink font-semibold text-cozy-dark bg-[#FFFDF9] outline-none text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="white"
                    onClick={() => { soundManager.playClick(); setEditingPet(null); }}
                    disabled={actionLoading}
                    className="py-3 text-xs border-[2.5px] rounded-xl shadow-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="yellow"
                    disabled={actionLoading}
                    className="py-3 text-xs border-[2.5px] rounded-xl shadow-none"
                  >
                    {actionLoading ? 'Updating... ⏳' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= RELEASE MODAL ================= */}
      <AnimatePresence>
        {releasingPet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-cozy-dark/40 backdrop-blur-sm select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="w-full max-w-sm bg-white border-[4px] border-cozy-dark rounded-[2.5rem] p-6 shadow-cozy text-center flex flex-col gap-4"
            >
              <div className="text-5xl animate-bounce">🕊️🌾</div>
              
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-black text-cozy-dark">Release {releasingPet.name}?</h3>
                <p className="text-xs text-cozy-dark/50 font-semibold leading-relaxed">
                  Are you sure you want to say goodbye to {releasingPet.name}? They will go back to live happily in the wild fields, and their progress records will be cleared. 
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="white"
                  onClick={() => { soundManager.playClick(); setReleasingPet(null); }}
                  disabled={actionLoading}
                  className="py-3 text-xs border-[2.5px] rounded-xl shadow-none"
                >
                  Keep Pet 💖
                </Button>
                <Button
                  onClick={handleReleaseSubmit}
                  disabled={actionLoading}
                  variant="pink"
                  className="py-3 text-xs border-[2.5px] rounded-xl shadow-none"
                >
                  {actionLoading ? 'Releasing... ⏳' : 'Release 🕊️'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
