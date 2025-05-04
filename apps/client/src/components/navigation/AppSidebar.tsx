import { ReactNode, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CandlestickChart, ChevronUp, CircleUser, LayoutDashboard, List, LogOut, Notebook, User2 } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeModeMenu from '../ThemeModeMenu';
import { logoutUser } from '@/api/auth';
import { DialogListIds } from '@/types';
import useAppStore from '@/store';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from '../ui/avatar';

type navItem = { label: string; to: string; icon: ReactNode };

const navItems: navItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard /> },
  { label: 'Trades', to: '/trades', icon: <List /> },
  { label: 'Strategies', to: '/strategies', icon: <Notebook /> },
];

const LogoutUserMenuItem = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      navigate('/auth');
    },
  });

  return (
    <DropdownMenuItem onClick={() => mutation.mutate()}>
      <LogOut />
      <span>Sign out</span>
    </DropdownMenuItem>
  );
};

const AccountMenuItem = () => {
  const openModal = useAppStore((state) => state.openModal);

  return (
    <DropdownMenuItem onClick={() => openModal({ id: DialogListIds.EDIT_USER })}>
      <CircleUser />
      <span>Account</span>
    </DropdownMenuItem>
  );
};

const UserDropdownMenu = () => {
  const userName = useAppStore((state) => state.user?.userName);
  const email = useAppStore((state) => state.user?.email);
  const avatar = useAppStore((state) => state.user?.avatar);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton>
          {avatar ? (
            <Avatar>
              <AvatarImage src={avatar?.url} />
            </Avatar>
          ) : (
            <User2 />
          )}{' '}
          {userName || email}
          <ChevronUp className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
        <AccountMenuItem />
        <LogoutUserMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AppSidebar = () => {
  const [activeLink, setActiveLink] = useState<navItem | undefined>();
  const location = useLocation();

  useEffect(() => {
    setActiveLink(navItems.find(({ to }) => location.pathname.includes(to)));
  }, [location.pathname]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex-row items-center ml-2 mb-2">
        <CandlestickChart />
        <h4 className="font-bold text-2xl inline-block">Trading journal</h4>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <NavLink
                      to={item.to}
                      className={cn(activeLink?.to === item?.to && ' bg-indigo-100 text-black font-medium')}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="mb-2">
            <ThemeModeMenu />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <UserDropdownMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
