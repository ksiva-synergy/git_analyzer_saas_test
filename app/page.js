import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    icon: "/globe.svg",
    title: "Fleet Management",
    desc: "Comprehensive oversight and optimization of a global fleet, ensuring safety, compliance, and efficiency.",
  },
  {
    icon: "/file.svg",
    title: "Crew Management",
    desc: "End-to-end crew recruitment, training, and welfare, prioritizing seafarer wellbeing and performance.",
  },
  {
    icon: "/window.svg",
    title: "Sustainability",
    desc: "Driving decarbonization and environmental responsibility through innovative maritime solutions.",
  },
  {
    icon: "/vercel.svg",
    title: "Digitalization",
    desc: "Leveraging cutting-edge technology for real-time vessel monitoring, predictive maintenance, and smart operations.",
  },
  {
    icon: "/next.svg",
    title: "Wellbeing",
    desc: "Comprehensive programs supporting the mental and physical health of all crew members.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12 bg-synergyLight">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-4 mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-synergyNavy mt-2">Ship Management Group</h1>
        <p className="text-lg sm:text-2xl text-synergyBlue font-medium mt-1">Leading Global Ship Management</p>
        <p className="max-w-xl mt-2 text-base sm:text-lg text-synergyNavy/80">
          Powering digital transformation, safety, and sustainability across the world’s most advanced maritime fleet.
        </p>
        <Link
          href="/dashboards"
          className="mt-6 inline-block bg-[#002147] text-white font-semibold rounded-full px-8 py-3 shadow transition-all duration-300 ease-in-out hover:bg-synergyBlue hover:scale-105 focus:outline-none focus:ring-2 focus:ring-synergyBlue focus:ring-offset-2 text-lg"
          tabIndex={0}
          aria-label="Go to Dashboards"
        >
          Go to Dashboards
        </Link>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-synergyLight transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 cursor-pointer"
            tabIndex={0}
            aria-label={feature.title}
          >
            <Image src={feature.icon} alt="" width={40} height={40} aria-hidden className="mb-3" />
            <h2 className="text-xl font-bold text-synergyNavy mb-1">{feature.title}</h2>
            <p className="text-synergyNavy/80 text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
