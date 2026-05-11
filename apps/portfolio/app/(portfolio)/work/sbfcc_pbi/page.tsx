"use client";

import { useEffect } from "react";

export default function SbfccWorkDemoPage() {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.colorScheme;
    html.style.colorScheme = "light";
    html.classList.remove("dark");
    return () => {
      html.style.colorScheme = prev;
      html.classList.add("dark");
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <iframe
        title="SBFCC"
        src="https://app.powerbi.com/view?r=eyJrIjoiODFhM2I1YmYtZWIyZC00ZmZkLThjNzEtOGE1MzIzZTExNzIyIiwidCI6ImMxYzQ1M2Y2LTNmNGUtNGJkYi1iODFiLTE0NmUxMzc3M2M2NCJ9&pageName=402847791da616e9a273"
        allowFullScreen={true}
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
