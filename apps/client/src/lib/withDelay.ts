async function withDelay<T>(promise: Promise<T>, delay: number = 600): Promise<T> {
  return Promise.all([promise, new Promise((resolve) => setTimeout(resolve, delay))]).then(([res]) => res);
}

export default withDelay;
