import { useEffect } from 'react';
import { Toaster } from 'sonner';

import Router from './router';
import useAppStore from './store';
import { SidebarProvider } from './components/ui/sidebar';
import DialogList from './components/DialogList';

const ToasterContainer = () => {
  const mode = useAppStore((state) => state.mode);
  return <Toaster theme={mode} richColors />;
};

function App() {
  const setThemeMode = useAppStore((state) => state.setThemeMode);

  useEffect(() => {
    setThemeMode();
  }, []);

  return (
    <SidebarProvider>
      <Router />
      <ToasterContainer />
      <DialogList />
    </SidebarProvider>
  );
}

export default App;
