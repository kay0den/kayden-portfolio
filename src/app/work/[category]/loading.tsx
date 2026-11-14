/** Appears instantly when a category is opened, while its images and videos are prepared. */
export default function Loading() {
  const ratios = [0.72, 1, 0.85, 1.2, 0.8, 1.05];
  return (
    <main aria-busy className="mx-auto max-w-6xl px-6 pb-32 pt-36">
      <div className="shimmer h-4 w-28 rounded-full" />
      <div className="shimmer mt-8 h-24 w-3/4 max-w-xl rounded-2xl" />
      <div className="shimmer mt-6 h-5 w-2/3 max-w-md rounded-full" />
      <div className="mt-20 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {ratios.map((r, i) => (
          <div key={i} className="shimmer w-full break-inside-avoid rounded-2xl" style={{ aspectRatio: `1 / ${r}` }} />
        ))}
      </div>
    </main>
  );
}
