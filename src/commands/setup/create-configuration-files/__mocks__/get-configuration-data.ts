export const getConfigurationData = () => {
  return new Promise((resolve) =>
    resolve({
      apiKey: "api-key",
      site: "US1",
    })
  );
};
