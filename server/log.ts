function log(message: string, isError?: boolean): void {
  let parsedDate = new Date().toLocaleString(); //Parse the date into one of the available formats (e.g. yyyy-MM-dd HH:mm:ss)
  if (isError) {
    console.error(`[ERROR] [${parsedDate}] ${message}`);
  } else {
    console.log(`[INFO] [${parsedDate}] ${message}`);
  }
}
export { log };
