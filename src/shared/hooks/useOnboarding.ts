import { useState } from 'react';

const ONBOARDING_KEY = 'finansor_onboarding_completed';
const ONBOARDING_STEP_KEY = 'finansor_onboarding_step';

export type OnboardingStep = 'welcome' | 'add-transaction' | 'view-stats' | 'achievements' | 'completed';

export function useOnboarding() {
  const [isCompleted, setIsCompleted] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDING_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(() => {
    try {
      const stored = localStorage.getItem(ONBOARDING_STEP_KEY);
      return (stored as OnboardingStep) || 'welcome';
    } catch {
      return 'welcome';
    }
  });

  const completeOnboarding = () => {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
      localStorage.setItem(ONBOARDING_STEP_KEY, 'completed');
      setIsCompleted(true);
      setCurrentStep('completed');
    } catch {
      // Ignore errors
    }
  };

  const setStep = (step: OnboardingStep) => {
    try {
      localStorage.setItem(ONBOARDING_STEP_KEY, step);
      setCurrentStep(step);
    } catch {
      // Ignore errors
    }
  };

  const resetOnboarding = () => {
    try {
      localStorage.removeItem(ONBOARDING_KEY);
      localStorage.removeItem(ONBOARDING_STEP_KEY);
      setIsCompleted(false);
      setCurrentStep('welcome');
    } catch {
      // Ignore errors
    }
  };

  return {
    isCompleted,
    currentStep,
    completeOnboarding,
    setStep,
    resetOnboarding,
  };
}

