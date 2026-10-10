import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Logo from "../components/Logo.jsx";


const previewCards = [
  { image: "/thumbnails/blog.svg", className: "hidden -rotate-6 translate-y-10 sm:block" },
  { image: "/thumbnails/landing-page.svg", className: "-rotate-2 translate-y-4" },
  { image: "/thumbnails/dashboard.svg", className: "rotate-2 translate-y-4" },
  { image: "/thumbnails/portfolio.svg", className: "hidden rotate-6 translate-y-10 sm:block" },
];

function Home() {
  return (
    <section className="flex min-h-screen flex-col overflow-hidden bg-linear-to-br from-brand-900 via-brand-800 to-brand-500">
      <Navbar variant="public" />

      <div className="mx-auto max-w-3xl px-4 pt-12 text-center text-white sm:pt-16">
        <div className="flex justify-center">
          <Logo light large />
        </div>
        <h1 className="mt-5 text-2xl font-medium leading-snug text-white/90 sm:text-3xl">
          Discover beautiful templates
          <br />
          for your next project
        </h1>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/templates"
            className="rounded-lg bg-white px-7 py-3 text-sm font-semibold text-brand-600 hover:bg-violet-50"
          >
            Browse Templates
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-white/60 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-center pt-12">
        {previewCards.map((card) => (
          <div
            key={card.image}
            className={`-mx-3 w-48 rounded-xl bg-white p-1.5 shadow-2xl sm:w-60 ${card.className}`}
          >
            <img src={card.image} alt="" className="aspect-video w-full rounded-lg object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Home;
