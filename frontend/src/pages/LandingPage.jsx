import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const [now, setNow] = useState(new Date());
  const features = [
    { title: "Hyperlocal Discovery", description: "Find nearby rooms in minutes with map-first search." },
    { title: "Hourly Booking", description: "Book flexible 4-8 hour stays without paying hotel rates." },
    { title: "Commute Matching", description: "Match opposite routes and unlock mutual stay benefits." },
    { title: "Host Income", description: "Monetize unused spaces with easy listing management." },
  ];
  const testimonials = [
    { name: "Riya, Product Analyst", text: "Steya saves me 2 hours of commute stress every week. It feels built for real city life." },
    { name: "Aman, Student", text: "I book 4-hour study stays before evening classes. Affordable and super reliable." },
    { name: "Shivani, Host", text: "Listing my spare studio on Steya became a real passive income stream." },
  ];

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <Navbar />
      <section className="px-4 pb-20 pt-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-primary">SMART SHORT STAY PLATFORM</p>
            <h1 className="text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">
              Stay smart.
              <span className="block bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Commute less.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Steya helps commuters, students, and travelers book premium short stays near work, campus, and transit zones.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/search" className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700">Explore Rooms</Link>
              <Link to="/list-room" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Become a Host</Link>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-white p-3 shadow-sm"><p className="text-2xl font-bold text-primary">10k+</p><p className="text-xs text-slate-500">Rooms</p></div>
              <div className="rounded-xl bg-white p-3 shadow-sm"><p className="text-2xl font-bold text-primary">4.8</p><p className="text-xs text-slate-500">Rating</p></div>
              <div className="rounded-xl bg-white p-3 shadow-sm"><p className="text-2xl font-bold text-primary">24/7</p><p className="text-xs text-slate-500">Support</p></div>
            </div>
          </div>
          <div className="glass-card rounded-3xl border border-white/70 p-4 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1400"
              alt="Modern stay"
              className="h-[440px] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-3xl font-bold">Why people choose Steya</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
              <h3 className="font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <p className="text-sm text-slate-300">Live city pulse</p>
              <p className="mt-2 text-2xl font-bold">{now.toLocaleTimeString()}</p>
              <p className="mt-1 text-sm text-slate-400">Peak discovery hour running now</p>
            </div>
            <div>
              <p className="text-sm text-slate-300">Listings active now</p>
              <p className="mt-2 text-2xl font-bold">1,286</p>
              <p className="mt-1 text-sm text-emerald-300">+4.2% in last 24h</p>
            </div>
            <div>
              <p className="text-sm text-slate-300">Route matches today</p>
              <p className="mt-2 text-2xl font-bold">342</p>
              <p className="mt-1 text-sm text-cyan-300">Commute savings unlocked</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-3xl font-bold">Loved by urban commuters</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-600">"{item.text}"</p>
              <p className="mt-3 font-semibold">{item.name}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
