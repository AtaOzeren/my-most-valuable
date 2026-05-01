const App = () => {
  return (
    <div class="min-h-screen bg-[#0d2a1a] bg-gradient-to-br from-[#0d2a1a] via-[#1a4d35] to-[#0a1f14] flex items-center justify-center">
      <div class="relative">
        {/* Subtle decorative glow */}
        <div class="absolute -inset-20 bg-green-500/10 blur-[100px] rounded-full"></div>
        <h1 class="text-white/20 text-4xl font-light tracking-[0.2em] uppercase select-none">
          SolidJS
        </h1>
      </div>
    </div>
  );
};

export default App;
