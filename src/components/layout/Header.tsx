
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-slate-900 border-slate-700 mx-4 mt-4 rounded-2xl border">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Moon className="h-6 w-6 text-white" />
          </div>
          <span className="font-serif text-xl sm:text-2xl font-normal text-white group-hover:text-white/90 transition-colors duration-300 whitespace-nowrap">
            Whispry
          </span>
        </Link>
        
        {user ? (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-white/70 text-sm font-light hidden sm:block">Welcome back!</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-white hover:bg-white/10 rounded-xl px-2 sm:px-4 py-2 button-pulse"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Sign Out</span>
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl px-4 sm:px-6 py-2 font-medium button-pulse shadow-lg">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
