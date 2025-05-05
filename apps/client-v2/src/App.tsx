import { useEffect, useState } from 'react';
import axios from 'axios';

export const getLoggedInUser = async () => {
  const response = await axios.get('auth');
  console.log(response);

  return response.data;
};

function App() {
  useEffect(() => {
    getLoggedInUser();
  }, []);

  return null;
}

export default App;
