import { Outlet } from 'react-router';

import AppSidebar from './AppSidebar';

const NavigationMain = () => {
  return (
    <>
      <AppSidebar />
      <main className="w-full flex justify-center items-start bg-gradient p-6">
        {/* <SidebarTrigger /> */}
        <div className="max-w-6xl w-full">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default NavigationMain;
