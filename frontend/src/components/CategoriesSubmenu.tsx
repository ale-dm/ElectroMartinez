import { Link } from "react-router-dom";

const categoriasMock = [
  {
    nombre: "Gran Electrodoméstico",
    slug: "gran-electrodomestico",
    subcategorias: ["Frigoríficos", "Lavadoras", "Secadoras", "Lavavajillas", "Congeladores"],
  },
  {
    nombre: "Climatización",
    slug: "climatizacion",
    subcategorias: ["Aire acondicionado", "Ventiladores", "Deshumidificadores"],
  },
  {
    nombre: "Televisores",
    slug: "televisores",
    subcategorias: ["Smart TV", "LED", "OLED", "QLED"],
  },
  {
    nombre: "Pequeño Electrodoméstico",
    slug: "pequeno-electrodomestico",
    subcategorias: ["Aspiradores", "Batidoras", "Cafeteras", "Freidoras", "Planchas"],
  },
  {
    nombre: "Cocción",
    slug: "coccion",
    subcategorias: ["Hornos", "Placas", "Microondas", "Campanas"],
  },
  {
    nombre: "Vintage",
    slug: "vintage",
    subcategorias: ["Tocadiscos", "Radios", "Neveras retro"],
  },
  {
    nombre: "Hostelería",
    slug: "hosteleria",
    subcategorias: ["Lavavajillas industrial", "Cocinas industriales", "Varios"],
  },
];

export default function CategoriesSubmenu({ categories = categoriasMock }: { categories?: typeof categoriasMock }) {
  return (
    <div className="w-full bg-[#232323]/80 backdrop-blur-md border-b-2 border-brand-yellow shadow-lg z-20 flex justify-center transition-all duration-300">
      <div className="flex flex-row gap-0.5 md:gap-1 py-1 px-1 md:px-0 max-w-7xl w-full justify-center items-center overflow-x-hidden">
        {categories.map(cat => (
          <div key={cat.slug} className="flex flex-col items-center">
            <Link
              to={`/catalogo?categoria=${cat.slug}`}
              className="text-white font-normal px-2 md:px-3 py-1 rounded focus:outline-none transition-all duration-150 whitespace-nowrap text-sm md:text-base tracking-wide hover:text-brand-yellow"
              style={{ background: 'transparent', boxShadow: 'none', zIndex: 1 }}
            >
              {cat.nombre}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
