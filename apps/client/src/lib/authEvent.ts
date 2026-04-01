export const AUTH_EVENT_TYPE = 'auth';

export type authDetailType = {
  isAuthenticated: boolean;
  prevLocation?: string;
};

export const createAuthEvent = (detail?: Partial<authDetailType>): CustomEvent<authDetailType> => {
  return new CustomEvent(AUTH_EVENT_TYPE, {
    detail: {
      isAuthenticated: false || !!detail?.isAuthenticated,
      prevLocation: detail?.prevLocation || undefined,
    },
  });
};
