import { useState, useEffect } from "react";
import { Menu, X, Star, Sprout, Users, GraduationCap } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/profile', '/notes', '/quiz'];
    if (!session && protectedRoutes.includes(location.pathname)) {
      navigate('/auth');
    }
  }, [session, location.pathname, navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    // { name: "Home", path: "/" },
    { name: "Term Sheet Analyzer", path: "/researchpaper", icon: <Sprout className="h-4 w-4" /> },
    // { name: "AI Dashboard", path: "/aidashboard", icon: <GraduationCap className="h-4 w-4" /> },
    // { name: "ATS Analyzer", path: "/ats", icon: <Users className="h-4 w-4" /> },
    // { name: "GitHub Chat", path: "/githubchat", icon: <GraduationCap className="h-4 w-4" /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-semibold">
             TeamXero
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 hover:text-white flex items-center gap-1"
                >
                  {item.icon && item.icon}
                  {item.name}
                </Link>
              ))}
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="px-3 py-2 rounded-md text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/10 hover:text-blue-300"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/80 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.icon && item.icon}
                {item.name}
              </Link>
            ))}
            {session ? (
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 transition-colors hover:bg-blue-500/10 hover:text-blue-300"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
