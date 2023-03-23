import { useState } from "react";

interface Props {
  url: string;
  module: {
    lessons: (
      | {
          lessonUrl: string | undefined;
          lessonTitle: any;
        }
      | undefined
    )[];
    moduleUrl: string;
    moduleTitle: any;
  };
}

export default function ModuleLessonToggle({ url, module }: Props) {
  const { moduleTitle, moduleUrl, lessons } = module;

  const isModuleActive = url.includes(moduleUrl);

  const [isModuleOpen, setIsModuleOpen] = useState(isModuleActive);

  function toggleModule(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setIsModuleOpen((prevModuleState) => !prevModuleState);
    event.preventDefault();
  }

  return (
    <div>
      <a
        title="Go to module page"
        aria-label="Go to module page"
        href={moduleUrl}
        className={`mr-6 flex items-center justify-between rounded-tr-lg rounded-br-lg py-3 pl-6 pr-3 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
          moduleUrl === url ? "bg-neutral-200 dark:bg-neutral-800" : ""
        }`}
      >
        <span>{moduleTitle}</span>

        <button
          title={`${isModuleOpen ? "Close module" : "Show module"}`}
          aria-label={`${isModuleOpen ? "Close module" : "Show module"}`}
          className="flex items-center justify-center rounded-lg p-1 transition-colors hover:bg-neutral-300 dark:hover:bg-neutral-700"
          onClick={toggleModule}
        >
          <span className="sr-only">
            {isModuleOpen ? "Close module" : "Show module"}
          </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`h-5 w-5 transition-transform ${
              isModuleOpen ? "rotate-180 transform" : ""
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </a>

      {isModuleOpen && (
        <>
          {lessons.map((lesson) => (
            <div key={lesson?.lessonUrl}>
              <a
                href={lesson?.lessonUrl}
                className={`mr-6 flex items-center justify-between rounded-tr-lg rounded-br-lg py-3 pl-9 pr-3 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
                  lesson?.lessonUrl === url
                    ? "bg-neutral-200 dark:bg-neutral-800"
                    : ""
                }`}
              >
                {lesson?.lessonTitle}
              </a>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
