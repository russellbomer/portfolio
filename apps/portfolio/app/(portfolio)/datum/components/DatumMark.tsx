import Image from "next/image";

interface DatumMarkProps {
  variant: "square" | "full";
  className?: string;
  priority?: boolean;
}

const SOURCES = {
  square: {
    light: "/images/datum/datum-mark-square.png",
    dark: "/images/datum/datum-mark-square-dark.png",
    width: 776,
    height: 776,
  },
  full: {
    light: "/images/datum/datum-mark-full.png",
    dark: "/images/datum/datum-mark-full-dark.png",
    width: 1784,
    height: 736,
  },
};

// Renders both theme variants and toggles visibility with the `dark:`
// variant, so the mark reacts instantly to ThemeToggle without any client
// JS or hydration flash.
export function DatumMark({ variant, className, priority }: DatumMarkProps) {
  const { light, dark, width, height } = SOURCES[variant];

  return (
    <>
      <Image
        src={light}
        alt="Datum Home Systems"
        width={width}
        height={height}
        className={`block dark:hidden ${className ?? ""}`}
        priority={priority}
      />
      <Image
        src={dark}
        alt="Datum Home Systems"
        width={width}
        height={height}
        className={`hidden dark:block ${className ?? ""}`}
        priority={priority}
      />
    </>
  );
}
