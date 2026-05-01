import { createSignal, Show, onMount } from "solid-js";
import { gsap } from "gsap";

const App = () => {
  const [response, setResponse] = createSignal(null);
  const [rejectCount, setRejectCount] = createSignal(0);
  const [buttonPos, setButtonPos] = createSignal({ x: 0, y: 0 });
  const [gifIndex, setGifIndex] = createSignal(-1);
  
  // Dynamically import all gifs from the my-love folder
  const gifs = Object.values(import.meta.glob('./assets/my-love/*.gif', { eager: true, query: '?url', import: 'default' }));
  
  let orb1, orb2, orb3;
  let rejectButtonRef;

  const rejectionTexts = [
    "Özrünü kabul etmiyorum",
    "Emin misin?",
    "Mutlaka etmelisin",
    "Naz yapmaaa 😊",
    "Hadi amaaa 🥺",
    "Üzme beni... 💔",
    "Affettin biliyorum 😉",
    "Bir tanesin sen... ❤️",
    "Kaçamazsın! ❤️",
    "Sabaha kadar devam ettirebilirim 😊"
  ];

  onMount(() => {
    gsap.to(orb1, { x: 50, y: 100, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(orb2, { x: -100, y: -50, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
    gsap.to(orb3, { x: 80, y: -80, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });
  });

  const handleReject = () => {
    // Increment GIF index
    setGifIndex((prev) => (prev + 1) % gifs.length);

    if (rejectCount() >= 2) {
      const btnWidth = rejectButtonRef.offsetWidth;
      const btnHeight = rejectButtonRef.offsetHeight;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const padding = 20;
      const maxX = (screenWidth / 2) - (btnWidth / 2) - padding;
      const maxY = (screenHeight / 2) - (btnHeight / 2) - padding;
      const safeX = 150; 
      const safeY = 200;

      let newX, newY;
      let attempts = 0;
      do {
        newX = (Math.random() - 0.5) * maxX * 2;
        newY = (Math.random() - 0.5) * maxY * 2;
        attempts++;
        const currentSafeX = screenWidth < 400 ? 80 : safeX;
        const currentSafeY = screenHeight < 600 ? 120 : safeY;
        const isInSafeZone = Math.abs(newX) < currentSafeX && Math.abs(newY) < currentSafeY;
        if (!isInSafeZone || attempts > 50) break;
      } while (true);
      
      setButtonPos({ x: newX, y: newY });
    }
    setRejectCount(c => c + 1);
  };

  const getRejectText = () => {
    if (rejectCount() >= rejectionTexts.length) return rejectionTexts[rejectionTexts.length - 1];
    return rejectionTexts[rejectCount()];
  };

  return (
    <div class="min-h-screen bg-[#0d2a1a] bg-linear-to-br from-[#0d2a1a] via-[#1a4d35] to-[#0a1f14] flex items-center justify-center p-6 text-center font-sans overflow-hidden relative">
      {/* Background Orbs */}
      <div ref={orb1} class="absolute top-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-green-500/20 blur-[80px] md:blur-[100px] rounded-full pointer-events-none z-0"></div>
      <div ref={orb2} class="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-emerald-500/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div ref={orb3} class="absolute top-1/4 right-1/4 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-teal-500/15 blur-[60px] md:blur-[80px] rounded-full pointer-events-none z-0"></div>

      <div class="relative max-w-lg w-full z-10 px-4">
        <Show when={!response()}>
          <div class="relative space-y-6 md:space-y-10">
            {/* GIF Display Area */}
            <div class="h-48 md:h-64 flex items-center justify-center">
              <Show when={gifIndex() !== -1}>
                <img 
                  src={gifs[gifIndex()]} 
                  alt="Cute love gif" 
                  class="max-h-full rounded-3xl shadow-2xl border-4 border-white/10 animate-scale-in"
                />
              </Show>
            </div>

            <h1 class="text-white text-2xl md:text-4xl font-light leading-snug md:leading-relaxed tracking-wide animate-fade-in">
              Güzel sevgilim benim, ben bugün senin bana ihtiyacın olduğu bir anda yanında olamadım, <br class="hidden md:block" />
              <span class="text-red-800 font-medium italic">çok özür dilerim.</span>
            </h1>
            
            <div class="flex flex-col gap-4 md:gap-6 justify-center items-center">
              <button 
                onClick={() => setResponse('accepted')}
                class="w-full md:w-auto px-8 py-4 bg-white text-[#0d2a1a] font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10 z-20"
              >
                Özrünü kabul ediyorum
              </button>
              
              <button 
                ref={rejectButtonRef}
                onClick={handleReject}
                style={{
                  transform: `translate(${buttonPos().x}px, ${buttonPos().y}px)`,
                  transition: rejectCount() >= 3 ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'all 0.2s'
                }}
                class={`px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-2xl whitespace-nowrap shadow-lg shadow-red-900/20 z-10 ${rejectCount() >= 2 ? 'w-auto' : 'w-full md:w-auto'}`}
              >
                {getRejectText()}
              </button>
            </div>
          </div>
        </Show>

        <Show when={response() === 'accepted'}>
          <div class="relative space-y-6 animate-scale-in">
            <div class="text-5xl md:text-6xl mb-6">❤️</div>
            <h1 class="text-white text-3xl md:text-4xl font-light">Seni çok seviyorum.</h1>
            <p class="text-white/40 italic text-sm md:text-base">Dünyanın en şanslı erkeğiyim...</p>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default App;
