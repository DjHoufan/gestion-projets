"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/core/lib/utils";

interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  format?: string;
  className?: string;
  disabled?: boolean;
  disabledDates?: Date[];
  disablePastDates?: boolean;
  position?: "bottom" | "top" | "center" | "fixed";
  yearRange?: number;
  minYear?: number;
  maxYear?: number;
}

const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const DatePicker = React.memo(
  ({
    value,
    defaultValue,
    onChange,
    placeholder = "Sélectionner une date",
    format = "dd/MM/yyyy",
    className,
    disabled = false,
    disabledDates = [],
    disablePastDates = false,
    position = "bottom",
    yearRange = 10,
    minYear = 1900,
    maxYear,
  }: DatePickerProps) => {
    // Utiliser useRef pour stocker la date initiale
    const initialDateRef = useRef<Date>(new Date());
    const yearViewRef = useRef<HTMLDivElement>(null);

    // Utiliser useState avec une fonction d'initialisation pour éviter les problèmes d'hydratation
    const [currentDate, setCurrentDate] = useState<Date>(() => {
      const initialDate = value || defaultValue || initialDateRef.current;
      return initialDate instanceof Date && !isNaN(initialDate.getTime())
        ? initialDate
        : new Date();
    });

    // Initialiser selectedDate avec une valeur définie (jamais undefined)
    const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
      const initialDate = value || defaultValue;
      return initialDate instanceof Date && !isNaN(initialDate.getTime())
        ? initialDate
        : null;
    });

    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<"calendar" | "month" | "year">("calendar");
    const [inputWidth, setInputWidth] = useState<number>(0);
    const [yearViewStart, setYearViewStart] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Utiliser useRef pour les références DOM
    const calendarRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    // Effet pour la synchronisation côté client uniquement
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Mettre à jour selectedDate et currentDate si value change
    useEffect(() => {
      if (value && value instanceof Date && !isNaN(value.getTime())) {
        setSelectedDate(value);
        setCurrentDate(new Date(value));
      } else if (value === undefined || value === null) {
        // Si value est explicitement undefined ou null, mettre à jour selectedDate à null
        setSelectedDate(null);
      }
    }, [value]);

    // Mettre à jour la largeur du calendrier en fonction de la largeur du champ de saisie
    useEffect(() => {
      if (!isMounted) return;

      if (inputRef.current) {
        const updateWidth = () => {
          setInputWidth(inputRef.current?.offsetWidth || 0);
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);

        return () => {
          window.removeEventListener("resize", updateWidth);
        };
      }
    }, [isMounted]);

    // Gérer l'animation d'ouverture/fermeture
    useEffect(() => {
      if (isOpen) {
        setIsAnimating(true);
        // Réinitialiser l'état d'animation après la fin de l'animation
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, 300); // Durée de l'animation
        return () => clearTimeout(timer);
      }
    }, [isOpen]);

    // Initialiser la vue des années lorsqu'on passe à cette vue
    useEffect(() => {
      if (view === "year") {
        const currentYear = currentDate.getFullYear();
        setYearViewStart(Math.max(minYear, currentYear - yearRange));

        // Faire défiler jusqu'à l'année actuelle dans la vue
        setTimeout(() => {
          if (yearViewRef.current) {
            const currentYearElement = yearViewRef.current.querySelector(
              `[data-year="${currentYear}"]`
            );
            if (currentYearElement) {
              currentYearElement.scrollIntoView({
                block: "center",
                behavior: "auto",
              });
            }
          }
        }, 0);
      }
    }, [view, currentDate, yearRange, minYear]);

    // Effet pour bloquer le défilement du body quand le calendrier modal est ouvert
    useEffect(() => {
      if (!isMounted) return;

      if (isOpen && (position === "center" || position === "fixed")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen, position, isMounted]);

    // Format date according to the specified format
    const formatDate = useCallback(
      (date: Date | null, formatString: string): string => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime()))
          return "";

        return formatString
          .replace("yyyy", date.getFullYear().toString())
          .replace("MM", (date.getMonth() + 1).toString().padStart(2, "0"))
          .replace("dd", date.getDate().toString().padStart(2, "0"));
      },
      []
    );

    // Get days in month
    const getDaysInMonth = useCallback(
      (year: number, month: number): number => {
        return new Date(year, month + 1, 0).getDate();
      },
      []
    );

    // Get day of week for first day of month
    const getFirstDayOfMonth = useCallback(
      (year: number, month: number): number => {
        return new Date(year, month, 1).getDay();
      },
      []
    );

    // Generate calendar days
    const calendarDays = useMemo(() => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const daysInMonth = getDaysInMonth(year, month);
      const firstDayOfMonth = getFirstDayOfMonth(year, month);

      const days: (number | null)[] = [];

      // Add empty cells for days before the first day of month
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
      }

      // Add days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }

      return days;
    }, [currentDate, getDaysInMonth, getFirstDayOfMonth]);

    // Handle month navigation
    const handlePrevMonth = useCallback(() => {
      setCurrentDate((prev) => {
        const prevMonth = new Date(prev);
        prevMonth.setMonth(prev.getMonth() - 1);
        return prevMonth;
      });
    }, []);

    const handleNextMonth = useCallback(() => {
      setCurrentDate((prev) => {
        const nextMonth = new Date(prev);
        nextMonth.setMonth(prev.getMonth() + 1);
        return nextMonth;
      });
    }, []);

    // Handle month selection
    const handleSelectMonth = useCallback((monthIndex: number) => {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        newDate.setMonth(monthIndex);
        return newDate;
      });
      setView("calendar");
    }, []);

    // Handle year selection
    const handleSelectYear = useCallback((year: number) => {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        newDate.setFullYear(year);
        return newDate;
      });
      setView("month");
    }, []);

    // Naviguer dans la vue des années
    const navigateYears = useCallback(
      (direction: "up" | "down") => {
        const change = direction === "up" ? -10 : 10;
        setYearViewStart((prev) => {
          const newStart = prev + change;
          return Math.max(minYear, newStart);
        });
      },
      [minYear]
    );

    // Check if a day is today
    const isToday = useCallback(
      (day: number): boolean => {
        const today = new Date();

        return (
          today.getDate() === day &&
          today.getMonth() === currentDate.getMonth() &&
          today.getFullYear() === currentDate.getFullYear()
        );
      },
      [currentDate]
    );

    // Vérifier si une date est désactivée
    const isDateDisabled = useCallback(
      (day: number): boolean => {
        // Créer la date à vérifier
        const dateToCheck = new Date(currentDate);
        dateToCheck.setDate(day);
        dateToCheck.setHours(0, 0, 0, 0);

        // Vérifier si la date est antérieure à aujourd'hui (si l'option est activée)
        if (disablePastDates) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (dateToCheck < today) {
            return true;
          }
        }

        // Vérifier si la date est dans la liste des dates désactivées
        return disabledDates.some((disabledDate) => {
          const disabled = new Date(disabledDate);
          disabled.setHours(0, 0, 0, 0);
          return disabled.getTime() === dateToCheck.getTime();
        });
      },
      [currentDate, disabledDates, disablePastDates]
    );

    // Handle date selection
    const handleSelectDate = useCallback(
      (day: number) => {
        // Vérifier si la date est désactivée
        if (isDateDisabled(day)) {
          return; // Ne rien faire si la date est désactivée
        }

        const newDate = new Date(currentDate);
        if (isNaN(newDate.getTime())) {
          // If currentDate is invalid, create a new date from scratch
          const today = new Date();
          newDate.setFullYear(today.getFullYear());
          newDate.setMonth(today.getMonth());
          newDate.setDate(day);
        } else {
          newDate.setDate(day);
        }

        setSelectedDate(newDate);
        if (onChange) {
          onChange(newDate);
        }
        setIsOpen(false);
      },
      [currentDate, onChange, isDateDisabled]
    );

    // Toggle calendar
    const toggleCalendar = useCallback(() => {
      if (!disabled) {
        setIsOpen((prev) => !prev);
      }
    }, [disabled]);

    // Close calendar
    const closeCalendar = useCallback(() => {
      setIsOpen(false);
      setView("calendar"); // Reset view when closing
    }, []);

    // Close calendar when clicking outside
    useEffect(() => {
      if (!isMounted) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          calendarRef.current &&
          !calendarRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          closeCalendar();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isMounted, closeCalendar]);

    // Check if a day is the selected day
    const isSelectedDay = useCallback(
      (day: number): boolean => {
        if (!selectedDate) return false;

        return (
          selectedDate.getDate() === day &&
          selectedDate.getMonth() === currentDate.getMonth() &&
          selectedDate.getFullYear() === currentDate.getFullYear()
        );
      },
      [selectedDate, currentDate]
    );

    // Generate years for year picker
    const years = useMemo(() => {
      const actualMaxYear = maxYear || new Date().getFullYear() + yearRange;
      const years = [];

      // Générer une plage d'années beaucoup plus grande
      for (let i = minYear; i <= actualMaxYear; i++) {
        years.push(i);
      }

      return years;
    }, [minYear, maxYear, yearRange]);

    // Déterminer les classes et styles du calendrier en fonction de la position
    const getCalendarStyles = useCallback(() => {
      if (position === "center") {
        return {
          className: cn(
            "fixed inset-0 flex items-center justify-center z-50  ",
            isAnimating ? "animate-in fade-in duration-300" : ""
          ),
          contentClassName: cn(
            "bg-white rounded-lg shadow-xl p-0 max-w-sm w-full max-h-[90vh] overflow-auto",
            isAnimating ? "animate-in zoom-in-95 duration-300" : ""
          ),
          style: {},
        };
      } else if (position === "fixed") {
        return {
          className: cn(
            "fixed inset-0 z-50 bg-black/50 overflow-auto",
            isAnimating ? "animate-in fade-in duration-300" : ""
          ),
          contentClassName: cn(
            "bg-white rounded-lg shadow-xl p-0 max-w-sm w-full mx-auto mt-20 mb-20",
            isAnimating ? "animate-in slide-in-from-top-5 duration-300" : ""
          ),
          style: {},
        };
      } else {
        return {
          className: cn(
            "absolute z-10",
            position === "bottom" ? "top-full mt-1" : "bottom-full mb-1"
          ),
          contentClassName: cn(
            "bg-white border rounded-md shadow-lg p-0",
            isAnimating
              ? position === "bottom"
                ? "animate-in slide-in-from-top-2 duration-300"
                : "animate-in slide-in-from-bottom-2 duration-300"
              : ""
          ),
          style: { width: `${inputWidth}px` },
        };
      }
    }, [position, inputWidth, isAnimating]);

    const calendarStyles = getCalendarStyles();

    // Rendu du calendrier
    const renderCalendar = () => {
      return (
        <>
          <div className="bg-primary text-white flex justify-between items-center p-3 ">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-full hover:bg-emerald-700 focus:outline-none text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setView("month")}
                className="font-medium hover:bg-emerald-700 px-2 py-1 rounded text-white"
              >
                {MONTHS[currentDate.getMonth()]}
              </button>
              <button
                type="button"
                onClick={() => setView("year")}
                className="font-medium hover:bg-emerald-700 px-2 py-1 rounded text-white"
              >
                {currentDate.getFullYear()}
              </button>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-full hover:bg-emerald-700 focus:outline-none text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="p-3">
            {view === "month" && (
              <div className="grid grid-cols-3 gap-2 p-2">
                {MONTHS.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleSelectMonth(index)}
                    className={cn(
                      "p-2 text-sm rounded hover:bg-emerald-100 focus:outline-none",
                      currentDate.getMonth() === index &&
                        "bg-primary text-white hover:bg-emerald-700"
                    )}
                  >
                    {month.substring(0, 3)}
                  </button>
                ))}
              </div>
            )}

            {view === "year" && (
              <div className="relative">
                <div className="absolute top-0 left-0 right-0 flex justify-center py-1 bg-white border-b z-10">
                  <button
                    type="button"
                    onClick={() => navigateYears("up")}
                    className="p-1 rounded-full hover:bg-emerald-100 focus:outline-none"
                  >
                    <ChevronUp size={16} />
                  </button>
                </div>

                <div
                  ref={yearViewRef}
                  className="grid grid-cols-4 gap-2 p-2 max-h-48 overflow-y-auto pt-8 pb-8"
                >
                  {years.map((year) => (
                    <button
                      key={year}
                      data-year={year}
                      onClick={() => handleSelectYear(year)}
                      className={cn(
                        "p-2 text-sm rounded hover:bg-emerald-100 focus:outline-none",
                        currentDate.getFullYear() === year &&
                          "bg-primary text-white hover:bg-emerald-700"
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex justify-center py-1 bg-white border-t z-10">
                  <button
                    type="button"
                    onClick={() => navigateYears("down")}
                    className="p-1 rounded-full hover:bg-emerald-100 focus:outline-none"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            )}

            {view === "calendar" && (
              <>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={`${currentDate.getFullYear()}-${currentDate.getMonth()}-${
                        day !== null ? `day-${day}` : `empty-${index}`
                      }`}
                      className="text-center"
                    >
                      {day !== null ? (
                        <button
                          type="button"
                          onClick={() => handleSelectDate(day)}
                          disabled={isDateDisabled(day)}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm focus:outline-none",
                            isSelectedDay(day)
                              ? "bg-primary text-white hover:bg-emerald-700"
                              : "hover:bg-emerald-100",
                            isToday(day) &&
                              !isSelectedDay(day) &&
                              "border border-emerald-300",
                            isDateDisabled(day) &&
                              "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100"
                          )}
                        >
                          {day}
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      );
    };

    // Préparer la valeur de l'input pour éviter le problème de controlled/uncontrolled
    const inputValue = selectedDate ? formatDate(selectedDate, format) : "";

    return (
      <div className="relative">
        <div ref={inputRef} className="relative">
          <input
            type="text"
            readOnly
            disabled={disabled}
            placeholder={placeholder}
            value={inputValue}
            onClick={toggleCalendar}
            className={cn(
              "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400",
              disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer",
              className
            )}
          />
          <Calendar
            className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600",
              disabled ? "opacity-50" : "opacity-100"
            )}
            size={18}
          />
        </div>

        {isOpen && isMounted && (
          <div ref={calendarRef} className={calendarStyles.className}>
            <div
              className={calendarStyles.contentClassName}
              style={calendarStyles.style}
            >
              {(position === "center" || position === "fixed") && (
                <div className="bg-primary text-white flex justify-between items-center p-3 rounded-t-md">
                  <h2 className="text-lg font-medium">Sélectionner une date</h2>
                  <button
                    type="button"
                    onClick={closeCalendar}
                    className="p-1 rounded-full hover:bg-emerald-700 focus:outline-none"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              {renderCalendar()}

              {(position === "center" || position === "fixed") && (
                <div className="mt-4 flex justify-end p-3 border-t">
                  <button
                    type="button"
                    onClick={closeCalendar}
                    className="px-4 py-2 bg-primary hover:bg-emerald-700 text-white rounded-md text-sm font-medium"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
