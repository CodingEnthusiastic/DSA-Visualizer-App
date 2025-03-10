"use client";

import { useEffect, useState } from "react";

export default function StreakTracker() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const lastVisit = localStorage.getItem("lastVisit");
    const today = new Date().toDateString();

    if (lastVisit === today) return;

    const newStreak = (localStorage.getItem("streak") ? parseInt(localStorage.getItem("streak")!) : 0) + 1;
    setStreak(newStreak);
    
    localStorage.setItem("lastVisit", today);
    localStorage.setItem("streak", newStreak.toString());
  }, []);

  return (
    <div className="bg-gradient-to-r from-yellow-200 to-yellow-200 text-white p-6 rounded-lg text-center my-8 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl" id="streak">
      <h2 className="text-3xl font-bold text-black flex items-center justify-center gap-2">
        🔥 Your Streak: 
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-orange-700 animate-pulse">
          {streak} Days
        </span> 
        🏅
      </h2>
      <p className="text-lg mt-2 text-black">Keep learning every day and earn rewards!</p>
    </div>
  );
}
