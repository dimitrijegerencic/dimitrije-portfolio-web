// Counted from the year I started working, so the site never needs a manual bump
export const CAREER_START_YEAR = 2022

export function useExperienceYears() {
  return new Date().getFullYear() - CAREER_START_YEAR
}
