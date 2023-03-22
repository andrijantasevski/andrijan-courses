import { useEffect, useState } from "react";

export default function DarkModeToggler() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");
  const [isMounted, setIsMounted] = useState(false);

  const toggleDarkMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);

    const css = document.createElement("style");
    css.type = "text/css";
    css.appendChild(
      document.createTextNode(
        `* {
       -webkit-transition: none !important;
       -moz-transition: none !important;
       -o-transition: none !important;
       -ms-transition: none !important;
       transition: none !important;
    }`
      )
    );
    document.head.appendChild(css);

    const _ = window.getComputedStyle(css).opacity;
    document.head.removeChild(css);
  }, [theme]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <button
      aria-label="Toggle theme"
      title={
        isMounted
          ? theme === "dark"
            ? "Toggle light mode"
            : "Toggle dark mode"
          : "Toggle theme"
      }
      onClick={toggleDarkMode}
      className={`rounded-md border-2 bg-neutral-200 p-1.5 transition-all hover:border-neutral-400 focus:border-2 dark:border-neutral-800 dark:bg-neutral-800 dark:hover:border-neutral-700 ${
        !isMounted ? "animate-pulse" : ""
      }`}
    >
      {isMounted ? (
        theme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 dark:text-neutral-50"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        )
      ) : (
        <div className="h-5 w-5"></div>
      )}
    </button>
  );
}
