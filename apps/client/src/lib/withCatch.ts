async function withCatch<T, E = Error>(promise: Promise<T>): Promise<[null, T] | [E, null]> {
  return promise
    .then((data) => {
      return [null, data] as [null, T];
    })
    .catch((error) => {
      return [error, null] as [E, null];
    });
}

export default withCatch;
