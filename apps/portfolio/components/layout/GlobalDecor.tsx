"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BackToTop } from "@/components/ui/BackToTop";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NoiseTexture } from "@/components/ui/NoiseTexture";
import { PinwheelBackground } from "@/components/ui/PinwheelBackground";
import { useIsDatumRoute } from "@/lib/isDatumRoute";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { usePathname } from "next/navigation";

const PROTOTYPE_ROUTE = "/easybank-prototype";
const BARE_ROUTES = ["/demos/sbfcc_pbi", "/work/sbfcc_pbi"];
const LANDSCAPE_QUERY = "(min-width: 768px) and (orientation: landscape)";

export function GlobalDecor() {
  const pathname = usePathname();
  const isLandscapeMd = useMediaQuery(LANDSCAPE_QUERY);
  const isNoPinwheelRoute = useIsDatumRoute();

  const isBareRoute = BARE_ROUTES.some((r) => pathname?.startsWith(r));
  const isPrototypeRoute = pathname?.startsWith(PROTOTYPE_ROUTE);
  const hideDecor = isBareRoute || (isPrototypeRoute && isLandscapeMd);
  const hidePinwheel = isBareRoute || isPrototypeRoute || isNoPinwheelRoute;
  const disableCursor = isBareRoute || isPrototypeRoute;

  return (
    <>
      {!hideDecor && !hidePinwheel && <PinwheelBackground />}
      {!hideDecor && <NoiseTexture />}
      {!hideDecor && <BackToTop />}
      {!hideDecor && <ThemeToggle />}
      {!disableCursor && <CustomCursor />}
    </>
  );
}
