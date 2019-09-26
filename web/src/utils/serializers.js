export const invoiceSerializer = (data) => {
  const newData = JSON.parse(JSON.stringify(data));
  Object.keys(newData).forEach((key) => {
    if (newData[key] instanceof Object) {
      Object.keys(newData[key]).forEach((subKey) => {
        const subKeyCapitalized = subKey.replace(/^./, subKey[0].toUpperCase());
        newData[key][`${key}${subKeyCapitalized}`] = newData[key][subKey];
        delete newData[key][subKey];
      });
    }
  });
  return newData;
};
