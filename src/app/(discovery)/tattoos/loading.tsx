export default function TattoosLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 h-24 max-w-xl animate-pulse bg-paper" />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="bg-paper aspect-[4/5] animate-pulse" />
            <div className="bg-paper h-5 w-2/3 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
