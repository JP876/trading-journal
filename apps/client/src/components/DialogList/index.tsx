import UserSettings from '../UserSettings';
import { DialogListIds } from '@/types';
import DialogMain from '../DialogMain';

const DialogList = () => {
  return (
    <>
      <DialogMain id={DialogListIds.EDIT_USER} title="Edit Account">
        <UserSettings />
      </DialogMain>
    </>
  );
};

export default DialogList;
