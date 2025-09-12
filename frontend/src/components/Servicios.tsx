// src/components/Servicios.tsx
const servicios = [
  {
    title: 'Iluminación LED',
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" stroke="#ffb800" strokeWidth="4" fill="none"/><rect x="20" y="32" width="8" height="8" rx="2" fill="#ffb800"/><rect x="22" y="12" width="4" height="12" rx="2" fill="#ffb800"/></svg>
    ),
  },
  {
    title: 'Instalaciones eléctricas',
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect x="10" y="20" width="28" height="8" rx="4" fill="#ffb800"/><rect x="22" y="8" width="4" height="12" rx="2" fill="#ffb800"/><rect x="22" y="28" width="4" height="12" rx="2" fill="#ffb800"/></svg>
    ),
  },
  {
    title: 'Reparación de electrodomésticos',
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect x="12" y="12" width="24" height="24" rx="4" stroke="#ffb800" strokeWidth="4" fill="none"/><rect x="20" y="20" width="8" height="8" rx="2" fill="#ffb800"/></svg>
    ),
  },
  {
    title: 'Aire acondicionado',
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect x="8" y="16" width="32" height="16" rx="4" stroke="#ffb800" strokeWidth="4" fill="none"/><rect x="16" y="24" width="16" height="4" rx="2" fill="#ffb800"/></svg>
    ),
  },
];

export default function Servicios() {
  return (
    <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-6 text-center my-8">
      {servicios.map((serv, i) => (
        <div key={i} className="flex flex-col items-center gap-2 bg-white rounded-lg shadow p-6 border border-brand-yellow hover:scale-105 transition-transform">
          <span className="mb-2">{serv.icon}</span>
          <span className="text-lg font-semibold text-brand-dark">{serv.title}</span>
        </div>
      ))}
    </section>
  );
}
