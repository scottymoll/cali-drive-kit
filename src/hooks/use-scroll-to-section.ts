import { useCallback } from 'react';

interface ScrollToSectionOptions {
  offset?: number;
  behavior?: ScrollBehavior;
}

export const useScrollToSection = (options: ScrollToSectionOptions = {}) => {
  const { offset = 80, behavior = 'smooth' } = options;

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior,
      });
    }
  }, [offset, behavior]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior });
  }, [behavior]);

  return { scrollToSection, scrollToTop };
};
