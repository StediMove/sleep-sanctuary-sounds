
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Moon className="h-8 w-8 text-purple-400" />
          <span className="text-xl font-bold text-white">Sleep Sanctuary</span>
        </Link>
        
        {user ? (
          <div className="flex items-center space-x-3">
            <span className="text-white/70 text-sm">Welcome back!</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
