/**
 * Claude-Inspired Branding Kit
 * A design system focused on warmth, readability, and "literary" intelligence.
 */

const BrandKit = () => {
  return (
    <div
      className="min-h-screen w-full p-8 md:p-24 font-sans text-[#141413]"
      style={{ backgroundColor: "#FAF9F5" }}
    >
      {/* ----------------------------- */}
      {/* HEADER: The "Literary" Brand  */}
      {/* ----------------------------- */}
      <header className="mb-20 max-w-4xl mx-auto border-b border-[#B0AEA5]/30 pb-10">
        <div className="flex items-center gap-3 mb-4">
          {/* Logo Placeholder: The "Terracotta" Cube */}
          <div className="w-10 h-10 rounded-lg bg-[#D97757] shadow-sm flex items-center justify-center">
            <span className="text-[#FAF9F5] font-serif font-bold text-xl">
              Aa
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-[#141413]">
            Anthropic / Claude
          </h1>
        </div>
        <p className="text-lg md:text-xl font-serif text-[#5F5E5A] leading-relaxed max-w-2xl">
          A design system designed to feel like{" "}
          <span className="italic text-[#141413]">paper</span>, not pixels. It
          prioritizes warmth, reading comprehension, and human-centric
          interaction.
        </p>
      </header>

      {/* ----------------------------- */}
      {/* SECTION 1: The Warm Palette   */}
      {/* ----------------------------- */}
      <section className="mb-20 max-w-5xl mx-auto">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#B0AEA5] mb-8">
          01. Color Palette
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Background: Warm Alabaster */}
          <div className="group space-y-3">
            <div className="h-24 w-full rounded-xl border border-[#B0AEA5]/20 shadow-sm bg-[#FAF9F5] flex items-center justify-center text-xs text-[#B0AEA5]">
              Background
            </div>
            <div className="px-1">
              <p className="font-medium text-sm">Warm Alabaster</p>
              <p className="font-mono text-xs opacity-60">#FAF9F5</p>
            </div>
          </div>

          {/* Text: Soft Charcoal */}
          <div className="group space-y-3">
            <div className="h-24 w-full rounded-xl shadow-sm bg-[#141413]" />
            <div className="px-1">
              <p className="font-medium text-sm">Soft Charcoal</p>
              <p className="font-mono text-xs opacity-60">#141413</p>
            </div>
          </div>

          {/* Accent: Terracotta */}
          <div className="group space-y-3">
            <div className="h-24 w-full rounded-xl shadow-sm bg-[#D97757]" />
            <div className="px-1">
              <p className="font-medium text-sm">Terracotta</p>
              <p className="font-mono text-xs opacity-60">#D97757</p>
            </div>
          </div>

          {/* Secondary: Stone Grey */}
          <div className="group space-y-3">
            <div className="h-24 w-full rounded-xl shadow-sm bg-[#B0AEA5]" />
            <div className="px-1">
              <p className="font-medium text-sm">Stone Grey</p>
              <p className="font-mono text-xs opacity-60">#B0AEA5</p>
            </div>
          </div>

          {/* Functional: Olive */}
          <div className="group space-y-3">
            <div className="h-24 w-full rounded-xl shadow-sm bg-[#788C5D]" />
            <div className="px-1">
              <p className="font-medium text-sm">Olive Green</p>
              <p className="font-mono text-xs opacity-60">#788C5D</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- */}
      {/* SECTION 2: Typography         */}
      {/* ----------------------------- */}
      <section className="mb-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Serif Column (The "Human" Voice) */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#B0AEA5] mb-8">
            02. Typography (Serif)
          </h2>
          <div className="p-8 rounded-2xl bg-white border border-[#B0AEA5]/20 shadow-sm">
            <h3 className="font-serif text-3xl text-[#141413] mb-4">
              Helpful, harmless, and honest.
            </h3>
            <p className="font-serif text-lg text-[#141413]/80 leading-relaxed">
              The serif font (e.g., <span className="italic">Lora</span> or{" "}
              <span className="italic">Tiêmpos</span>) is used for the
              conversation itself. It mimics the experience of reading a novel,
              slowing the user down to appreciate the text.
            </p>
          </div>
        </div>

        {/* Sans Column (The "UI" Voice) */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#B0AEA5] mb-8">
            03. Typography (Sans)
          </h2>
          <div className="p-8 rounded-2xl bg-white border border-[#B0AEA5]/20 shadow-sm">
            <h3 className="font-sans text-2xl font-semibold text-[#141413] mb-4">
              Settings & Controls
            </h3>
            <p className="font-sans text-base text-[#141413]/70 leading-relaxed mb-4">
              The sans-serif font (e.g., <span className="font-medium">Poppins</span> or{" "}
              <span className="font-medium">Inter</span>) is used for buttons,
              settings, and navigation. It provides clarity and functional
              contrast.
            </p>

            {/* Button Samples */}
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                className="px-6 py-2.5 bg-[#D97757] hover:bg-[#CC785C] text-[#FAF9F5] rounded-lg font-sans font-medium text-sm transition-colors"
              >
                Primary Action
              </button>
              <button
                type="button"
                className="px-6 py-2.5 bg-[#EBE9E0] hover:bg-[#E0DED5] text-[#141413] rounded-lg font-sans font-medium text-sm transition-colors"
              >
                Secondary
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- */}
      {/* SECTION 3: UI Elements        */}
      {/* ----------------------------- */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#B0AEA5] mb-8">
          04. The Interface
        </h2>

        {/* Chat Interface Mockup */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#B0AEA5]/20 overflow-hidden">
          <div className="p-4 border-b border-[#B0AEA5]/10 bg-[#FAF9F5] flex justify-between items-center">
            <span className="font-sans text-sm font-medium text-[#5F5E5A]">
              New Chat
            </span>
            <div className="w-3 h-3 rounded-full bg-[#D97757]" />
          </div>

          <div className="p-8 space-y-8">
            {/* User Message */}
            <div className="flex gap-4 justify-end">
              <div className="bg-[#F0EEE6] text-[#141413] px-5 py-3 rounded-2xl rounded-tr-sm max-w-lg font-serif text-base leading-relaxed">
                How do I design for trust?
              </div>
              <div className="w-8 h-8 rounded-full bg-[#B0AEA5] flex-shrink-0" />
            </div>

            {/* AI Message */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#D97757] flex-shrink-0" />
              <div className="space-y-3 max-w-lg">
                <p className="text-[#141413] font-serif text-base leading-relaxed">
                  Designing for trust often begins with{" "}
                  <span className="font-bold">transparency</span> and{" "}
                  <span className="font-bold">consistency</span>.
                </p>
                <p className="text-[#141413] font-serif text-base leading-relaxed">
                  By using warm, natural colors (like this Alabaster background)
                  instead of clinical blues, you signal that the technology is a
                  tool for humans, not just a machine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandKit;
