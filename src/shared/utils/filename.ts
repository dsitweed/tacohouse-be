export function separateFilenameAndExtension(filename: string): {
  fileName: string;
  fileExt: string;
} {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return {
      fileName: filename,
      fileExt: '',
    };
  }
  return {
    fileName: filename.slice(0, lastDotIndex),
    fileExt: filename.slice(lastDotIndex + 1),
  };
}

export function getPathStorageFromUrl(url: string) {
  // Find the last '/' in the URL
  const lastSlashIndex = url.lastIndexOf('/');

  // Extract the file name from the URL
  const fileNameWithParams = url.substring(lastSlashIndex + 1);

  // Remove parameters from the file name
  const questionMarkIndex = fileNameWithParams.indexOf('?');
  let fileName =
    questionMarkIndex !== -1
      ? fileNameWithParams.substring(0, questionMarkIndex)
      : fileNameWithParams;
  fileName = fileName.replaceAll('%20', ' ');
  return fileName;
}
