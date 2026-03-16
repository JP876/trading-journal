const transformToFormData = (data: any): FormData | null => {
  if (typeof data === 'object' && Object.keys(data).length !== 0) {
    const formData = new FormData();

    for (let name in data) {
      let value = data?.[name];

      if (Array.isArray(value)) {
        value.forEach((val) => {
          formData.append(`${name}`, val);
        });
      } else {
        value === null || value === undefined ? formData.append(name, '') : formData.append(name, value);
      }
    }

    return formData;
  }

  return null;
};

export default transformToFormData;
