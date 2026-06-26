import { useState, useEffect } from 'react';
import {
  getDeveloperInfo,
  getSkills,
  getProjects,
  getExperience,
  getStats,
} from '../store/portfolioStore';

export function usePortfolioData() {
  const [data, setData] = useState({
    developerInfo: getDeveloperInfo(),
    skills: getSkills(),
    projects: getProjects(),
    experience: getExperience(),
    stats: getStats(),
  });

  useEffect(() => {
    const refresh = () => {
      setData({
        developerInfo: getDeveloperInfo(),
        skills: getSkills(),
        projects: getProjects(),
        experience: getExperience(),
        stats: getStats(),
      });
    };
    window.addEventListener('portfolio-updated', refresh);
    return () => window.removeEventListener('portfolio-updated', refresh);
  }, []);

  return data;
}
