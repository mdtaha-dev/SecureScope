function Navbar() {
  return (
    <header className="fixed top-0 w-full flex items-center px-6 h-16 bg-[#10141a]/80 backdrop-blur-xl z-50 border-b border-outline-variant/10">
      {/* Left: Branding */}
      <div className="flex items-center gap-2">
        <span
          className="material-symbols-outlined text-[#2F81F7]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          shield
        </span>
        <span className="text-xl font-bold tracking-tighter text-on-surface font-headline">
          SecureScope
        </span>
        <span className="ml-2 px-2 py-0.5 rounded bg-surface-container-highest text-[10px] font-bold tracking-widest text-[#2F81F7] uppercase border border-outline-variant/20">
          v1.0
        </span>
      </div>
    </header>
  )
}

export default Navbar