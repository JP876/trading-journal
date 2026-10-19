import Papa, { type ParseLocalConfig, type ParseResult } from 'papaparse';

async function readCSVFile<T>(
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

export default readCSVFile;
