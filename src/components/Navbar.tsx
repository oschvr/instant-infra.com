import { localDatabase } from "@/lib/localDatabase";

export function Navbar() {
  const handleExportData = async () => {
    try {
      const data = await localDatabase.exportData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "localData.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card backdrop-blur supports-[backdrop-filter]:bg-card">
      <div className="container h-14 flex items-center">
        <div className="flex items-center gap-8 flex-1">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="gradient-text">InstantInfra</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/#/game"
              className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              Game
            </a>
            <a
              href="/#/about"
              className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              About
            </a>
            {/* <button
              className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              onClick={handleExportData}
            >
              Export Data
            </button> */}
          </nav>
        </div>
      </div>
    </header>
  );
}
