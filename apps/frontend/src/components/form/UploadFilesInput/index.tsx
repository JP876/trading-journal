import { InputHTMLAttributes, MouseEvent } from 'react';
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

import { FilesPreviewProps, InputFileUploadProps, UploadFilesInputProps } from './types';
import { FilesType } from '@/types/trades';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const InputFileUpload = (props: InputFileUploadProps) => {
  return (
    <Button
      component="label"
      role={undefined}
      size="small"
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      {...(props.buttonProps || {})}
    >
      {props?.children ? props.children : 'Upload files'}
      <VisuallyHiddenInput {...(props.inputProps || {})} type="file" />
    </Button>
  );
};

const FilesPreview = ({ value, handleDeleteFile }: FilesPreviewProps) => {
  if (!Array.isArray(value) || value?.length === 0) {
    return null;
  }

  return (
    <List dense>
      {value.map((file: File | FilesType, index: number) => (
        <ListItem
          key={`file-${index}`}
          secondaryAction={
            <Stack direction="row" alignItems="center">
              <IconButton size="small" color="error" onClick={(e) => handleDeleteFile(e, index)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar src={file instanceof File ? URL.createObjectURL(file) : file?.url || ''} alt={file.name} />
          </ListItemAvatar>
          <ListItemText primary={file.name} />
        </ListItem>
      ))}
    </List>
  );
};

const UploadFilesInput = ({ field, ...rest }: UploadFilesInputProps & InputHTMLAttributes<HTMLInputElement>) => {
  const { value, onChange, disabled, onBlur, ...restField } = field;

  const handleDeleteFile = (_: MouseEvent<HTMLButtonElement>, index: number) => {
    onChange((value || []).filter((_: File, fielIndex: number) => fielIndex !== index));
  };

  return (
    <Stack sx={{ width: '100%' }}>
      <InputFileUpload
        buttonProps={{ disabled, onBlur }}
        inputProps={{
          accept: 'image/*',
          multiple: true,
          ...rest,
          ...restField,
          onChange: (e) => {
            if (e.target.files) onChange([...(value || []), ...e.target.files]);
          },
        }}
      />
      <FilesPreview value={value} handleDeleteFile={handleDeleteFile} />
    </Stack>
  );
};

export default UploadFilesInput;
