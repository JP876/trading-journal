import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Merge } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('auth', { replace: true });
  }, [navigate]);

  return (
    <div className="w-full bg-gradient flex justify-center items-center">
      <Card className="shadow-md p-6 ">
        <h4 className=" font-bold text-3xl mb-2">Welcome to Trading Juornal</h4>
        <div className="flex justify-center" onClick={() => navigate('auth')}>
          <Button variant="default" size="lg">
            <Merge /> Join
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MainPage;
