import { Link, useLocation } from "wouter";
import { Search, Bell, MessageCircle, Moon, Sun, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ui/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { useState, useRef, useEffect } from "react";

// Search suggestions based on sidebar actions and app features
const searchSuggestions = [
  { id: "create-course", title: "Create Course", type: "action", href: "#", action: "course" },
  { id: "post-job", title: "Post Job", type: "action", href: "#", action: "job" },
  { id: "create-post", title: "Create Post", type: "action", href: "#", action: "post" },
  { id: "dashboard", title: "Dashboard", type: "page", href: "/" },
  { id: "courses", title: "My Learning", type: "page", href: "/courses" },
  { id: "jobs", title: "Jobs", type: "page", href: "/jobs" },
  { id: "messages", title: "Messages", type: "page", href: "/messages" },
  { id: "profile", title: "Profile", type: "page", href: "/profile" },
  { id: "wallet", title: "Wallet", type: "page", href: "/wallet" },
  { id: "ai-courses", title: "AI Courses", type: "search", href: "/courses?category=ai" },
  { id: "machine-learning", title: "Machine Learning", type: "search", href: "/courses?q=machine+learning" },
  { id: "data-science", title: "Data Science Jobs", type: "search", href: "/jobs?q=data+science" },
];

export function Navigation() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(searchSuggestions);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions(searchSuggestions);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If there's an exact match, navigate to it
      const exactMatch = filteredSuggestions.find(s =>
        s.title.toLowerCase() === searchQuery.toLowerCase()
      );
      if (exactMatch) {
        if (exactMatch.type === "action") {
          // Trigger sidebar action
          triggerSidebarAction(exactMatch.action);
        } else {
          window.location.href = exactMatch.href;
        }
      } else {
        // General search
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      }
      setShowSuggestions(false);
      setSearchQuery("");
    }
  };

  const triggerSidebarAction = (action: string) => {
    // Dispatch custom event to trigger sidebar modal
    window.dispatchEvent(new CustomEvent('openSidebarModal', { detail: { type: action } }));
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === "action") {
      triggerSidebarAction(suggestion.action);
    } else {
      window.location.href = suggestion.href;
    }
    setShowSuggestions(false);
    setSearchQuery("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer group">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">F</span>
                  </div>
                </div>
                <span className="ml-3 text-xl font-bold gradient-text">Fortunitive</span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search courses, jobs, actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="glass-input pl-10 pr-10 py-3 w-full rounded-xl focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            {/* Search Suggestions */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl border shadow-lg max-h-80 overflow-y-auto z-50">
                {filteredSuggestions.length > 0 ? (
                  <div className="p-2">
                    {filteredSuggestions.slice(0, 8).map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:glass transition-all duration-200 flex items-center justify-between group"
                      >
                        <div>
                          <span className="text-foreground group-hover:text-primary transition-colors">
                            {suggestion.title}
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground capitalize">
                            {suggestion.type}
                          </span>
                        </div>
                        <Search className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="glass-button p-3 rounded-xl hover:scale-110 transition-all duration-300 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">3</span>
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="glass-button p-3 rounded-xl hover:scale-110 transition-all duration-300 relative"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">2</span>
              </span>
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="glass-button p-3 rounded-xl hover:scale-110 transition-all duration-300"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Profile */}
            {user && (
              <div className="relative">
                <img
                  src={user.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-primary/50 hover:scale-110 transition-all duration-300"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-background"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}