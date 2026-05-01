import { createSignal, Show, onMount } from "solid-js";
import { gsap } from "gsap";

const App = () => {
  const [response, setResponse] = createSignal(null);
  const [rejectCount, setRejectCount] = createSignal(0);
  const [buttonPos, setButtonPos] = createSignal({ x: 0, y: 0 });
  let orb1, orb2, orb3;

  onMount(() => {
    console.log("GSAP Background Animation Started", { orb1, orb2, orb3 });
    // Animate background orbs
    gsap.to(orb1, {
      x: 100,
      y: 150,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(orb2, {
      x: -150,
      y: -100,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1
    });
    gsap.to(orb3, {
      x: 120,
      y: -120,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2
    });
  });

  const rejectionTexts = [
    "Özrünü kabul etmiyorum",
    "Emin misin?",
    "Mutlaka etmelisin",
    "Naz yapmaaa 😊",
    "Hadi amaaa 🥺",
    "Üzme beni... 💔",
    "Affettin biliyorum 😉",
    "Bir tanesin sen... ❤️",
    "Kaçamazsın! ❤️"
  ];

  const handleReject = (e) => {
    if (rejectCount() >= 2) {
      // Random position within the viewport
      const x = Math.random() * (window.innerWidth - 200) - (window.innerWidth / 2) + 100;
      const y = Math.random() * (window.innerHeight - 100) - (window.innerHeight / 2) + 50;
      setButtonPos({ x, y });
    }
    setRejectCount(c => c + 1);
  };

  const getRejectText = () => {
    if (rejectCount() >= rejectionTexts.length) return rejectionTexts[rejectionTexts.length - 1];
    return rejectionTexts[rejectCount()];
  };

  return (
    <div class="min-h-screen bg-[#0d2a1a] bg-gradient-to-br from-[#0d2a1a] via-[#1a4d35] to-[#0a1f14] flex items-center justify-center p-8 text-center font-sans overflow-hidden relative">
      {/* Background Orbs */}
      <div ref={orb1} class="absolute top-0 left-0 w-[500px] h-[500px] bg-green-500/20 blur-[100px] rounded-full pointer-events-none z-0"></div>
      <div ref={orb2} class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div ref={orb3} class="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/15 blur-[80px] rounded-full pointer-events-none z-0"></div>

      <div class="relative max-w-2xl w-full z-10">
        {/* Subtle decorative glow */}
        <div class="absolute -inset-20 bg-green-500/10 blur-[100px] rounded-full"></div>

        <Show when={!response()}>
          <div class="relative space-y-12">
            <h1 class="text-white text-3xl md:text-4xl font-light leading-relaxed tracking-wide animate-fade-in">
              Güzel sevgilim benim, ben bugün senin bana ihtiyacın olduğu bir anda yanında olamadım, <span class="text-green-400 font-medium">çok özür dilerim.</span>
            </h1>

            <div class="flex flex-col md:flex-row gap-6 justify-center items-center min-h-[100px]">
              <button
                onClick={() => setResponse('accepted')}
                class="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl transition-all hover:scale-105 active:scale-95 backdrop-blur-sm z-10"
              >
                Özrünü kabul ediyorum
              </button>

              <button
                onClick={handleReject}
                style={{
                  transform: `translate(${buttonPos().x}px, ${buttonPos().y}px)`,
                  transition: rejectCount() >= 3 ? 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'all 0.2s'
                }}
                class="px-8 py-4 bg-transparent border border-white/10 text-white/40 hover:text-white/60 rounded-2xl whitespace-nowrap"
              >
                {getRejectText()}
              </button>
            </div>
          </div>
        </Show>

        <Show when={response() === 'accepted'}>
          <div class="relative space-y-6 animate-scale-in">
            <div class="text-6xl mb-6">❤️</div>
            <h1 class="text-white text-4xl font-light">Seni çok seviyorum.</h1>
            <p class="text-white/40 italic">Dünyanın en şanslı erkeğiyim...</p>
            <button
              onClick={() => {
                setResponse(null);
                setRejectCount(0);
                setButtonPos({ x: 0, y: 0 });
              }}
              class="mt-8 text-white/20 hover:text-white/40 transition-colors text-sm"
            >
              Başa Dön
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default App;
