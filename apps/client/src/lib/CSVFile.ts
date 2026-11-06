import { getDefaultStore } from 'jotai';
import Papa, { type ParseLocalConfig, type ParseResult } from 'papaparse';

import { openSnackbarAtom } from '../atoms/snackbar';
import withCatch from './withCatch';

export async function readCSVFile<T>(
  file: File,
  options?: Omit<ParseLocalConfig, 'complete' | 'error'>
): Promise<ParseResult<T>> {
  return new Promise((resolve, reject) => {
    return Papa.parse<T>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      ...options,
      complete: (results: ParseResult<T>) => resolve(results),
      error: (error) => reject(error),
    });
  });
}

export async function handleCSVFile<T>(file: File) {
  const [error, result] = await withCatch(readCSVFile<T>(file));

  if (error || (Array.isArray(result?.errors) && result?.errors?.length > 0)) {
    getDefaultStore().set(openSnackbarAtom, {
      severity: 'error',
      message: "We couldn't read this CSV. Make sure it uses UTF-8 encoding, then try again.",
    });
    return;
  }
  if (!Array.isArray(result?.data) || result.data.length === 0) {
    getDefaultStore().set(openSnackbarAtom, {
      severity: 'error',
      message: 'This CSV appears to be empty. Check the file and upload it again.',
    });
    return;
  }

  return result;
}
