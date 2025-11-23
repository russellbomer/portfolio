export function ScreenshotsGallery({
  screenshots,
}: {
  screenshots?: { src: string; alt?: string }[];
}) {
  if (!screenshots || screenshots.length === 0) return null;
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {screenshots.map((s, i) => (
        <img
          key={`${s.src}-${i}`}
          src={s.src}
          alt={s.alt ?? ""}
          className="w-full rounded-md border object-cover"
        />
      ))}
    </div>
  );
}
