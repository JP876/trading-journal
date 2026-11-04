import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Controller } from 'react-hook-form';

import AddRandomTradesContainer from '../../../pages/trades/forms/AddRandomTrades/AddRandomTradesContainer';
import CloseDateInput from '../../../pages/trades/forms/CloseDateInput';
import usePairsOptions from '../../../pages/trades/hooks/usePairsOptions';
import DateTimeInput from '../../form/DateTimeInput';
import SelectInput from '../../form/SelectInput';
import SubmitButton from '../../form/SubmitButton';
import TextInput from '../../form/TextInput';
import useModal from '../../../hooks/useModal';
import { TradesPageModal } from '../../../pages/trades/enums';

const IntroForm = () => {
  const pairsOptions = usePairsOptions();
  const { closeModal } = useModal();

  const handleClose = () => {
    closeModal(TradesPageModal.INTRO);
  };

  return (
    <Stack gap={2}>
      <Typography variant="body1">
        Customize a few details and we'll create sample trades for you, so you can try out the platform with a more
        complete dashboard. The trades are for demonstration only. Prefer to start with an empty account? Select Cancel.
      </Typography>

      <Divider />

      <AddRandomTradesContainer onSuccess={handleClose}>
        {({ form, isLoading }) => (
          <>
            <Stack direction="row" alignItems="center" gap={4}>
              <Controller
                name="count"
                control={form.control}
                render={(props) => <TextInput label="Count" {...props} inputProps={{ type: 'number' }} />}
              />
              <Controller
                name="pairs"
                control={form.control}
                render={(props) => (
                  <SelectInput
                    {...props}
                    options={pairsOptions}
                    label="Pairs"
                    renderChips
                    addAllOption
                    inputProps={{ multiple: true, disabled: !pairsOptions.length }}
                  />
                )}
              />
            </Stack>

            <Stack direction="row" alignItems="center" gap={4}>
              <Controller
                name="winPercentage"
                control={form.control}
                render={(props) => (
                  <TextInput
                    label="Win Rate"
                    {...props}
                    inputProps={{ type: 'number', slotProps: { input: { endAdornment: '%' } } }}
                  />
                )}
              />
              <Controller
                name="longPercentage"
                control={form.control}
                render={(props) => (
                  <TextInput
                    label="Direction: LONG"
                    {...props}
                    inputProps={{ type: 'number', slotProps: { input: { endAdornment: '%' } } }}
                  />
                )}
              />
            </Stack>

            <Stack direction="row" alignItems="center" gap={4}>
              <Controller
                name="startDate"
                control={form.control}
                render={(props) => <DateTimeInput label="Start Date" inputProps={{ disableFuture: true }} {...props} />}
              />
              <Controller
                name="endDate"
                control={form.control}
                render={(props) => <CloseDateInput label="End Date" addHoursCount={24 * 14} {...props} />}
              />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="flex-end">
              <Stack direction="row" gap={2}>
                <Button variant="outlined" size="small" startIcon={<CloseIcon />} onClick={handleClose}>
                  Cancel
                </Button>
                <SubmitButton loading={isLoading} />
              </Stack>
            </Stack>
          </>
        )}
      </AddRandomTradesContainer>
    </Stack>
  );
};

export default IntroForm;
