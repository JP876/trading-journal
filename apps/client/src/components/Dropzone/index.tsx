import { styled, type ButtonProps } from '@mui/material';
import Box, { type BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Provider, useAtomValue, useSetAtom, useStore, type Store } from 'jotai';
import { memo, useCallback, useEffect, useRef } from 'react';

import UploadButton from '../UploadButton';
import {
  clearDropzoneStore,
  dzContianerElAtom,
  dzFilesAtom,
  dzInputElAtom,
  dzIsDraggingAtom,
  dzSetFilesAtom,
  dzUpateStatusAtom,
  type TDzFile,
} from './atoms';

type TDropzoneContainerProps = BoxProps<
  'div',
  {
    isDragging?: boolean;
    disabled?: boolean;
  }
>;

const DropzoneContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragging' && prop !== 'disabled',
})<TDropzoneContainerProps>(({ theme, isDragging, disabled }) => {
  return {
    border: `2px dashed ${theme.alpha(theme.palette.text.primary, 0.2)}`,
    backgroundColor: isDragging ? theme.alpha(theme.palette.text.secondary, 0.05) : theme.palette.background.default,
    transition: theme.transitions.create(['background-color']),
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: disabled ? 'none' : 'all',
  };
});

const handleDragOver = (event: React.DragEvent<Element>) => {
  event.preventDefault();
  event.stopPropagation();
};

type TDropzoneProps = {
  multiple?: boolean;
  disabled?: boolean;
  accept?: React.InputHTMLAttributes<HTMLInputElement>['accept'];
  onChange?: (event: React.DragEvent<Element> | React.ChangeEvent<HTMLInputElement>, files: TDzFile[]) => void;
  buttonLabel?: ButtonProps['children'];
  label?: string;
};

const DropzoneMain = ({ multiple, disabled, accept, onChange, buttonLabel, label }: TDropzoneProps) => {
  const store = useStore();
  const dragTargetsRef = useRef<EventTarget[]>([]);

  const isDragging = useAtomValue(dzIsDraggingAtom);
  const clearStore = useSetAtom(clearDropzoneStore);

  const setContainerEl = useSetAtom(dzContianerElAtom);
  const setInputEl = useSetAtom(dzInputElAtom);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let files = event.target.files;
      if (!files) return;
      store.set(dzSetFilesAtom, [...files]);
      if (onChange) onChange(event, store.get(dzFilesAtom) || []);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<Element>) => {
      event.preventDefault();
      if (disabled) return;

      let droppedFiles = Array.from(event.dataTransfer.files);
      if (accept) {
        let options = accept.split(',').map((el) => el.trim());
        droppedFiles = droppedFiles.reduce((acc, file) => {
          for (let option of options) {
            if (file.name.endsWith(option) || file.type.includes(option)) {
              return [...acc, file];
            }
          }
          return acc;
        }, [] as File[]);
      }
      if (!multiple) {
        droppedFiles = droppedFiles.splice(0, 1);
      }

      store.set(dzSetFilesAtom, droppedFiles);

      dragTargetsRef.current = [];
      store.set(dzUpateStatusAtom, { isDragging: false });

      if (onChange) onChange(event, store.get(dzFilesAtom) || []);
    },
    [disabled, accept, onChange]
  );

  const handleDragEnter = useCallback((event: React.DragEvent<Element>) => {
    event.preventDefault();
    event.stopPropagation();

    dragTargetsRef.current = [...dragTargetsRef.current, event.target];
    store.set(dzUpateStatusAtom, { isDragging: true });
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<Element>) => {
    event.preventDefault();
    event.stopPropagation();

    const containerEl = store.get(dzContianerElAtom);
    // Only deactivate once the dropzone and all children have been left
    const targets = dragTargetsRef.current.filter((target) => containerEl?.contains(target as Node));
    // Make sure to remove a target present multiple times only once
    const targetIndex = targets.indexOf(event.target);
    if (targetIndex !== -1) targets.splice(targetIndex, 1);

    dragTargetsRef.current = targets;
    if (targets.length > 0) return;

    store.set(dzUpateStatusAtom, { isDragging: false });
  }, []);

  useEffect(() => {
    clearStore();
  }, []);

  return (
    <DropzoneContainer
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      isDragging={isDragging}
      disabled={disabled}
      ref={setContainerEl}
    >
      <UploadButton
        ref={setInputEl}
        onChange={handleChange}
        multiple={!!multiple}
        accept={accept}
        buttonProps={{ disabled }}
      >
        {buttonLabel}
      </UploadButton>
      <Typography
        variant="subtitle1"
        sx={[(theme) => ({ color: theme.palette.text[disabled ? 'disabled' : 'primary'] })]}
      >
        {label || "Drag 'n' drop some files here"}
      </Typography>
    </DropzoneContainer>
  );
};

const Dropzone = ({ store, ...rest }: TDropzoneProps & { store?: Store }) => {
  return (
    <Provider store={store}>
      <DropzoneMain {...rest} />
    </Provider>
  );
};

export default memo(Dropzone);
