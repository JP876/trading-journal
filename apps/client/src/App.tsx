import { useEffect } from 'react';
import { client } from './lib/client';
import transformToFormData from './lib/transformToFormData';

const App = () => {
  useEffect(() => {
    (async () => {
      // await client.post('trades', transformToFormData({ takeProfit: 20 }));
    })();
  }, []);

  return <></>;
};

export default App;
