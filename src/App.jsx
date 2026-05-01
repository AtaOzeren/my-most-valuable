import { createSignal, Show, onMount } from "solid-js";
import { gsap } from "gsap";

const App = () => {
  const [response, setResponse] = createSignal(null);
  const [rejectCount, setRejectCount] = createSignal(0);
  const [buttonPos, setButtonPos] = createSignal({ x: 0, y: 0 });
  const [gifIndex, setGifIndex] = createSignal(-1);

  // Dynamically import all gifs from the my-love folder
  const gifs = Object.values(import.meta.glob('./assets/my-love/*.gif', { eager: true, query: '?url', import: 'default' }));

  const dots = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 5 + 3
  }));

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
    "Bir tanesin sen... ❤️",
    "Sabaha kadar devam ettirebilirim 😊",
    "İnatçı Keçi Seniii ❤️"
  ];

  onMount(() => {
    // Arka plandaki yuvarlakların çok daha hareketli ve dinamik olması için
    gsap.to(orb1, {
      x: "random(-200, 200)", y: "random(-200, 200)",
      duration: 4, repeat: -1, yoyo: true, repeatRefresh: true, ease: "sine.inOut"
    });
    gsap.to(orb2, {
      x: "random(-250, 250)", y: "random(-250, 250)",
      duration: 5, repeat: -1, yoyo: true, repeatRefresh: true, ease: "sine.inOut"
    });
    gsap.to(orb3, {
      x: "random(-150, 150)", y: "random(-150, 150)",
      duration: 6, repeat: -1, yoyo: true, repeatRefresh: true, ease: "sine.inOut"
    });

    // Beyaz küçük noktaların sürekli hareketi
    gsap.to(".gsap-dot", {
      y: () => `-=${Math.random() * 50 + 20}`,
      x: () => `+=${Math.random() * 40 - 20}`,
      opacity: () => Math.random() * 0.8 + 0.2,
      duration: () => Math.random() * 4 + 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Giriş Animasyonları
    // "Güzel sevgilim benim..." yazısı için zarif bir yukarıdan süzülme efekti
    gsap.from(".main-text", {
      y: 40,
      opacity: 0,
      rotationX: -20,
      transformOrigin: "bottom center",
      duration: 1.5,
      ease: "power4.out",
      delay: 0.3
    });

    // "çok özür dilerim" yazısı için vurgulu bir elastik gelme efekti
    gsap.from(".apology-text", {
      scale: 0.5,
      opacity: 0,
      y: 20,
      duration: 1.5,
      ease: "elastic.out(1, 0.4)",
      delay: 1.2
    });

    // Butonların zarifçe belirmesi
    gsap.from(".action-buttons", {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
      delay: 2.0
    });
  });

  const handleAccept = () => {
    // Tüm önceki animasyonları durdur
    gsap.killTweensOf([orb1, orb2, orb3, ".gsap-dot"]);

    // Beyaz noktaların sevinç hareketi
    gsap.to(".gsap-dot", {
      scale: 3,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
      stagger: 0.02
    });

    setResponse('accepted');
  };

  const handleReject = () => {
    // Reddedilince arka plandaki kırmızı efekti kaldırdık. 
    // Onun yerine beyaz noktalar rastgele etrafa saçılacak.
    gsap.to(".gsap-dot", {
      x: () => `+=${(Math.random() - 0.5) * 150}`,
      y: () => `+=${(Math.random() - 0.5) * 150}`,
      duration: 0.5,
      ease: "power2.out",
    });

    // Increment GIF index
    setGifIndex((prev) => (prev + 1) % gifs.length);

    if (rejectCount() >= 2) {
      const rect = rejectButtonRef.getBoundingClientRect();
      const currentPos = buttonPos();

      // Orijinal transformsuz konumu buluyoruz
      const origX = rect.left - currentPos.x;
      const origY = rect.top - currentPos.y;

      const padding = 20;
      const btnWidth = rect.width;
      const btnHeight = rect.height;

      // Ekrandan çıkmaması için gidebileceği minimum ve maksimum X, Y limitleri hesaplanıyor
      const minX = padding - origX;
      const maxX = window.innerWidth - btnWidth - padding - origX;

      const minY = padding - origY;
      const maxY = window.innerHeight - btnHeight - padding - origY;

      let newX = minX + Math.random() * (maxX - minX);
      let newY = minY + Math.random() * (maxY - minY);

      setButtonPos({ x: newX, y: newY });
    }
    setRejectCount(c => c + 1);
  };

  const getRejectText = () => {
    if (rejectCount() >= rejectionTexts.length) return rejectionTexts[rejectionTexts.length - 1];
    return rejectionTexts[rejectCount()];
  };

  return (
    <>
      <style>{`
      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient-bg {
        background-size: 200% 200%;
        animation: gradientBG 15s ease infinite;
      }
    `}</style>
      <div class="animate-gradient-bg min-h-screen bg-[#0d2a1a] bg-linear-to-br from-[#0d2a1a] via-[#1a4d35] to-[#0a1f14] flex items-center justify-center p-6 text-center font-sans overflow-hidden relative">
        {/* Background Orbs */}
        <div ref={orb1} class="absolute top-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-green-500/20 blur-[80px] md:blur-[100px] rounded-full pointer-events-none z-0"></div>
        <div ref={orb2} class="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-emerald-500/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div ref={orb3} class="absolute top-1/4 right-1/4 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-teal-500/15 blur-[60px] md:blur-[80px] rounded-full pointer-events-none z-0"></div>

        {/* Background White Dots */}
        <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {dots.map(dot => (
            <div
              class="gsap-dot absolute bg-white rounded-full opacity-30"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                width: `${dot.size}px`,
                height: `${dot.size}px`
              }}
            ></div>
          ))}
        </div>

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

              <h1 class="text-white text-2xl md:text-4xl font-light leading-snug md:leading-relaxed tracking-wide">
                <div class="main-text inline-block">Güzel sevgilim benim, ben bugün senin bana ihtiyacın olduğu bir anda yanında olamadım,</div> <br class="hidden md:block" />
                <div class="apology-text inline-block text-red-800 font-medium italic mt-2">çok özür dilerim.</div>
              </h1>

              <div class="action-buttons flex flex-col gap-4 md:gap-6 justify-center items-center">
                <button
                  onClick={handleAccept}
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
    </>
  );
};

export default App;
