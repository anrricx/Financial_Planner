export function NavBar() {
  return (
    <header className="bg-fidelity-green" style={{ height: '60px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
      <div className="h-full px-8">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <h1 className="text-white font-bold text-xl">
              Portfolio Planning
            </h1>
          </div>
          <nav className="flex items-center gap-8">
            <a href="#" className="text-white text-sm font-medium hover:opacity-90">
              Home
            </a>
            <a href="#" className="text-white text-sm font-medium hover:opacity-90">
              About
            </a>
            <a href="#" className="text-white text-sm font-medium hover:opacity-90">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

