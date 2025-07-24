const formatQuery = (value: Record<string, string | number>) => {
  const keys = Object.keys(value).filter((key) => {
    if (value?.[key] === undefined) return false;
    return value?.[key] !== '' && value?.[key] !== null;
  });

  return keys.length > 0 ? `?${keys.map((key) => `${key}=${value?.[key]}`).join('&')}` : '';
};

export default formatQuery;
