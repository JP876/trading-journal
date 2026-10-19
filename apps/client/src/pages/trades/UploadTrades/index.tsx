import { memo, type ChangeEvent } from 'react';

import UploadButton from '../../../components/UploadButton';
import withCatch from '../../../lib/withCatch';
import readCSVFile from '../../../lib/readCSVFile';
import type { Trade } from '../../../types/trade';
import useSnackbar from '../../../hooks/useSnackbar';

const UploadTrades = () => {
  const { openSnackbar } = useSnackbar();

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;
    if (!files) {
      openSnackbar({
        severity: 'error',
        message: 'This CSV appears to be empty. Check the file and upload it again.',
      });
      return;
    }

    let [err, result] = await withCatch(readCSVFile<Trade[]>(files[0]));
    if (err) {
      openSnackbar({
        severity: 'error',
        message: "We couldn't read this CSV. Make sure it uses UTF-8 encoding, then try again.",
      });
      return;
    }
    console.log(result);
  };

  return (
    <UploadButton onChange={handleChange} accept=".csv, text/csv">
      Upload trades (CSV)
    </UploadButton>
  );
};

export default memo(UploadTrades);
