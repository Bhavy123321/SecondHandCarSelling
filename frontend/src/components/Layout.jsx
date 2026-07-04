import React, { useState } from "react";
import AppSidebar from "./AppSidebar";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark"
      );
    }
    return false;
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Ensure theme is set on mount (in case it wasn't already)
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  return (
    <div className="h-screen bg-muted/10 dark:bg-slate-950/20 relative flex font-sans antialiased text-foreground overflow-hidden">
      {/* Premium Ambient Glowing Background Orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-primary/5 dark:bg-primary/8 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-baltic-blue-500/5 dark:bg-baltic-blue-500/8 blur-[150px] pointer-events-none z-0" />

      {/* Sidebar Navigation */}
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden z-10 relative">
        {/* Mobile Header / Top Bar */}
        <header className="flex items-center gap-4 border-b bg-background/80 backdrop-blur px-6 h-16 shrink-0 sticky top-0 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden -ml-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          <div className="flex-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-muted/80 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>
        </header>

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
