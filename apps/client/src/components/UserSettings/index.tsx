import EditUserForm from './EditUserForm';
import UserAvatar from './UserAvatar';

const UserSettings = () => {
  return (
    <div className="flex gap-10">
      <div className="mt-2 ml-2">
        <UserAvatar />
      </div>
      <div className="w-full">
        <EditUserForm />
      </div>
    </div>
  );
};

export default UserSettings;
