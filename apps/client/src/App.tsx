import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    fetch('/api/v1').then(async (res) => {
      console.log(await res.text());
    });
  }, []);

  return <></>;
};

export default App;
