export default function Loading() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative h-16 w-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-teal-400/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-400 animate-spin" />
        </div>
        <p className="text-sm text-gray-400">A carregar...</p>
      </div>
    </main>
  );
}