import { useState, useEffect } from 'react';
import { EcoPet } from '../types';

interface MoodData {
  mood: string;
  message: string;
  emoji: string;
  color: string;
}

export const useEcoPet = () => {
  const [ecoPet, setEcoPet] = useState<EcoPet | null>(null);
  const [moodData, setMoodData] = useState<MoodData>({ mood: 'Happy', message: "I'm feeling great!", emoji: '😊', color: 'text-green-400' });

  const getMoodData = (lastActionTimestamp: number): MoodData => {
    const now = Date.now();
    const timeDiff = now - lastActionTimestamp;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (daysDiff <= 3) {
      return {
        mood: 'Happy',
        message: "I'm feeling great today!",
        emoji: '😊',
        color: 'text-green-400'
      };
    } else if (daysDiff <= 7) {
      return {
        mood: 'Neutral',
        message: "I'm doing okay...",
        emoji: '😐',
        color: 'text-yellow-400'
      };
    } else {
      return {
        mood: 'Sad',
        message: "Where have you been?",
        emoji: '😢',
        color: 'text-red-400'
      };
    }
  };

  const updateMood = (lastActionTimestamp?: number) => {
    if (!ecoPet) return;
    
    const timestamp = lastActionTimestamp || ecoPet.lastActionTimestamp || Date.now();
    const newMoodData = getMoodData(timestamp);
    setMoodData(newMoodData);
  };

  const createEcoPet = () => {
    const now = Date.now();
    const newPet: EcoPet = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'EcoFriend',
      level: 1,
      xp: 0,
      image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop&crop=center',
      traits: ['Curious', 'Eco-Friendly'],
      lastActionTimestamp: now,
      recentActions: [now],
      mood: 'Happy'
    };
    
    setEcoPet(newPet);
    setMoodData(getMoodData(now));
    localStorage.setItem('ecoPet', JSON.stringify(newPet));
    localStorage.setItem('petMood', JSON.stringify(getMoodData(now)));
  };

  const addXP = (xp: number) => {
    if (!ecoPet) return;
    
    const now = Date.now();
    const newXP = ecoPet.xp + xp;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    // Update recent actions (keep last 5)
    const newRecentActions = [now, ...ecoPet.recentActions.slice(0, 4)];
    
    // Determine new image based on XP thresholds
    let newImage = ecoPet.image;
    let newTraits = [...ecoPet.traits];
    
    if (newXP <= 699) {
      newImage = 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop&crop=center';
    } else if (newXP <= 1699) {
      newImage = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop&crop=center';
      if (!newTraits.includes('Adventurous')) {
        newTraits.push('Adventurous');
      }
    } else {
      newImage = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&crop=center';
      if (!newTraits.includes('Wise')) {
        newTraits.push('Wise', 'Leader');
      }
    }
    
    const updatedPet: EcoPet = {
      ...ecoPet,
      xp: newXP,
      level: newLevel,
      image: newImage,
      traits: newTraits,
      lastActionTimestamp: now,
      recentActions: newRecentActions,
      mood: 'Happy' // Always happy after gaining XP
    };
    
    setEcoPet(updatedPet);
    setMoodData(getMoodData(now));
    localStorage.setItem('ecoPet', JSON.stringify(updatedPet));
    localStorage.setItem('petMood', JSON.stringify(getMoodData(now)));
  };

  const performAction = (xp: number) => {
    // This method combines recordAction and addXP for action completion
    if (!ecoPet) {
      // Create pet if it doesn't exist
      createEcoPet();
      return;
    }
    
    const now = Date.now();
    const newXP = ecoPet.xp + xp;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    // Update recent actions (keep last 5)
    const newRecentActions = [now, ...ecoPet.recentActions.slice(0, 4)];
    
    // Determine new image based on XP thresholds
    let newImage = ecoPet.image;
    let newTraits = [...ecoPet.traits];
    
    if (newXP <= 699) {
      newImage = 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop&crop=center';
    } else if (newXP <= 1699) {
      newImage = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop&crop=center';
      if (!newTraits.includes('Adventurous')) {
        newTraits.push('Adventurous');
      }
    } else {
      newImage = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&crop=center';
      if (!newTraits.includes('Wise')) {
        newTraits.push('Wise', 'Leader');
      }
    }
    
    const updatedPet: EcoPet = {
      ...ecoPet,
      xp: newXP,
      level: newLevel,
      image: newImage,
      traits: newTraits,
      lastActionTimestamp: now,
      recentActions: newRecentActions,
      mood: 'Happy' // Always happy after gaining XP
    };
    
    setEcoPet(updatedPet);
    setMoodData(getMoodData(now));
    localStorage.setItem('ecoPet', JSON.stringify(updatedPet));
    localStorage.setItem('petMood', JSON.stringify(getMoodData(now)));
  };

  const resetXP = () => {
    if (!ecoPet) return;
    
    const resetPet: EcoPet = {
      ...ecoPet,
      xp: 0,
      level: 1,
      image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop&crop=center',
      traits: ['Curious', 'Eco-Friendly'],
      mood: ecoPet.mood // Keep current mood
    };
    
    setEcoPet(resetPet);
    localStorage.setItem('ecoPet', JSON.stringify(resetPet));
  };

  const recordAction = (actionType: string) => {
    if (!ecoPet) return;
    
    const now = Date.now();
    const newRecentActions = [now, ...ecoPet.recentActions.slice(0, 4)];
    
    const updatedPet: EcoPet = {
      ...ecoPet,
      lastActionTimestamp: now,
      recentActions: newRecentActions,
      mood: 'Happy'
    };
    
    setEcoPet(updatedPet);
    setMoodData(getMoodData(now));
    localStorage.setItem('ecoPet', JSON.stringify(updatedPet));
    localStorage.setItem('petMood', JSON.stringify(getMoodData(now)));
  };

  useEffect(() => {
    const savedPet = localStorage.getItem('ecoPet');
    const savedMood = localStorage.getItem('petMood');
    
    if (savedPet) {
      const pet = JSON.parse(savedPet);
      setEcoPet(pet);
      
      // Update mood based on current time
      if (pet.lastActionTimestamp) {
        const currentMoodData = getMoodData(pet.lastActionTimestamp);
        setMoodData(currentMoodData);
        localStorage.setItem('petMood', JSON.stringify(currentMoodData));
      }
    }
    
    // Set up interval to update mood every minute
    const moodInterval = setInterval(() => {
      const savedPet = localStorage.getItem('ecoPet');
      if (savedPet) {
        const pet = JSON.parse(savedPet);
        if (pet.lastActionTimestamp) {
          const currentMoodData = getMoodData(pet.lastActionTimestamp);
          setMoodData(currentMoodData);
          localStorage.setItem('petMood', JSON.stringify(currentMoodData));
        }
      }
    }, 60000); // Update every minute

    return () => clearInterval(moodInterval);
  }, []);

  return {
    ecoPet,
    moodData,
    createEcoPet,
    addXP,
    resetXP,
    recordAction,
    updateMood,
    performAction, // Added the missing method
  };
};
