import { useState, useEffect, useRef, useCallback } from 'react';

export function useAlgorithmState(steps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const intervalRef = useRef(null);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    setCurrentStep(0);
    stop();
  }, [steps, stop]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(s => {
          if (s >= steps.length - 1) {
            stop();
            return s;
          }
          return s + 1;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, steps.length, stop]);

  const play = () => {
    if (currentStep >= steps.length - 1) setCurrentStep(0);
    setIsPlaying(true);
  };
  const pause = () => stop();
  const next = () => { stop(); setCurrentStep(s => Math.min(s + 1, steps.length - 1)); };
  const prev = () => { stop(); setCurrentStep(s => Math.max(s - 1, 0)); };
  const reset = () => { stop(); setCurrentStep(0); };

  return {
    currentStep,
    step: steps[currentStep] || steps[0],
    isPlaying,
    speed,
    setSpeed,
    play, pause, next, prev, reset,
    isFirst: currentStep === 0,
    isLast: currentStep === steps.length - 1,
    progress: steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0,
    totalSteps: steps.length,
  };
}
