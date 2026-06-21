import { MapPin } from "lucide-react";

const routes = [
  { 
    city: "Tokyo, Japan", 
    price: "$850", 
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800" 
  },
  { 
    city: "Paris, France", 
    price: "$620", 
    img: "https://images.unsplash.com/photo-1609971757431-439cf7b4141b?q=80&w=687&auto=format&fit=crop" 
  },
  { 
    city: "New York, USA", 
    price: "$740", 
    img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800" 
  }
];

export function PopularRoutes() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-black text-foreground mb-12">Global Destinations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {routes.map((route, i) => (
          <div 
            key={i}
            className="relative overflow-hidden rounded-3xl h-[450px] shadow-lg"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${route.img}')` }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            
            {/* Static Content */}
            <div className="absolute bottom-8 left-8 text-white">
              <p className="flex items-center gap-2 text-cyan-400 font-bold mb-2 tracking-widest uppercase text-sm">
                <MapPin className="w-4 h-4" /> {route.city}
              </p>
              <p className="text-3xl font-black">From {route.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}       