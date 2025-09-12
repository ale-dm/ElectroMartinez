export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-yellow py-8 px-4 mt-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo-electromartinez.png" alt="ElectroMartínez" className="h-10" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm">
          <span className="flex items-center gap-1 text-white font-semibold">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#fff"/></svg>
            Cristian Martínez
          </span>
          <span className="flex items-center gap-1 font-bold">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1C7.61 21 3 16.39 3 10a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" fill="#ffb800"/></svg>
            Tel. 616 180 340
          </span>
        </div>
        <span className="text-xs text-brand-yellow/70 mt-2 md:mt-0">© {new Date().getFullYear()} ElectroMartínez. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}
