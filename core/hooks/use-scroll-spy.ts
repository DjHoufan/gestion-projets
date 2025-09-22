"use client"

import { useEffect, useState } from "react"

export function useScrollSpy(sectionIds: string[], offset = 100) {
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset

      // Find the section that is currently in view
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i])
        if (section) {
          const sectionTop = section.offsetTop - 100 // Added buffer for better section detection
          if (scrollPosition >= sectionTop) {
            setActiveSection(sectionIds[i])
            break
          }
        }
      }
    }

    // Set initial active section
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sectionIds, offset])

  return activeSection
}
