async function withCatch<T, E = Error>(promise: Promise<T>): Promise<[E, null] | [null, T]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error as E, null];
  }
}

export default withCatch;
