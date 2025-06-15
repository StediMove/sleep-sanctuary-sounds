
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { CreditCard, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscriptionButton = () => {
  const { user } = useAuth();
  const { subscribed, createCheckout, openCustomerPortal, loading } = useSubscription();

  if (!user) {
    return (
      <Link to="/auth">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-medium text-lg shadow-2xl button-pulse animate-glow"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Start Your Journey - $18/year
        </Button>
      </Link>
    );
  }

  if (subscribed) {
    return (
      <Button
        onClick={openCustomerPortal}
        disabled={loading}
        variant="outline"
        size="lg"
        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 px-8 py-4 rounded-2xl font-medium text-lg"
      >
        <CreditCard className="mr-2 h-5 w-5" />
        {loading ? 'Loading...' : 'Manage Subscription'}
      </Button>
    );
  }

  return (
    <Button
      onClick={createCheckout}
      disabled={loading}
      size="lg"
      className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-medium text-lg shadow-2xl button-pulse animate-glow"
    >
      <Sparkles className="mr-2 h-5 w-5" />
      {loading ? 'Loading...' : 'Subscribe Now - $18/year'}
    </Button>
  );
};

export default SubscriptionButton;
