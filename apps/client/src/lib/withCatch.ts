type Ok<T> = {
  data: T;
  error: null;
};
type Err<E> = {
  data: null;
  error: E;
};
type Result<T, E> = Ok<T> | Err<E>;

async function withCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

export default withCatch;
