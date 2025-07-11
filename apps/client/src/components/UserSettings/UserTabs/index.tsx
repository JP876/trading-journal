import React, { useState } from 'react';
import { List, Settings, User } from 'lucide-react';

import EditUserForm from '../EditUserForm';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import UserAvatar from '../UserAvatar';
import AccountList from '../AccountList';

type tabButton = {
  label: string;
  value: string;
  icon: React.ReactElement;
};

const userTabButtons: tabButton[] = [
  { label: 'Personal', value: 'personal', icon: <User /> },
  { label: 'Settings', value: 'settings', icon: <Settings /> },
  { label: 'Accounts', value: 'accounts', icon: <List /> },
];

const UserTabs = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const handleUpdateTab = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    if (!target?.value) {
      console.warn('Button value not found');
      return;
    }
    setActiveTab(target.value);
  };

  return (
    <div className="flex flex-row gap-6">
      <div className="flex flex-col gap-2 p-4 bg-sidebar rounded-sm w-52">
        <div className="mb-4">
          <UserAvatar />
        </div>

        {userTabButtons.map((el) => (
          <Button
            key={el.value}
            onClick={handleUpdateTab}
            value={el.value}
            variant={activeTab === el.value ? 'default' : 'outline'}
            size="sm"
          >
            {el.icon} {el.label}
          </Button>
        ))}
      </div>

      <div className="w-full h-[40vh] overflow-auto pr-4">
        <div className={cn('hidden', activeTab === 'personal' && 'block')}>
          <EditUserForm />
        </div>
        <div className={cn('hidden', activeTab === 'accounts' && 'block')}>
          <AccountList />
        </div>
      </div>
    </div>
  );
};

export default UserTabs;
