import Link from "next/link";

export default function ProjectsPage() {
  const navLinks = [{ href: "/projects/solarsystem", label: "Solar System" }];

  return (
    <div className="container-comp bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 min-h-screen">
      <div></div>
      <main className="flex-auto flex-col justify-between py-24 px-4 md:px-12 lg:px-24 bg-gray-100 text-black">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-center text-4xl font-bold mb-16">Projects</h1>
          <div className="pt-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {link.label}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
