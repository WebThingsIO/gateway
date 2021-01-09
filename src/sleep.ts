export = async function sleep(ms: number): Promise<void> {
  return await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
