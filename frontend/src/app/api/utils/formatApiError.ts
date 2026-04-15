/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatApiError = (error: any) => {
  //   if (!error?.response?.data) {
  //     return { general: 'An unknown error occurred' };
  //   }

  const data = error.response?.data;
  let formattedErrors = '';
  if (data?.errors) {
    Object.keys(data.errors).forEach((key) => {
      formattedErrors = Array.isArray(data.errors[key])
        ? data.errors?.[key][0] // Pick the first error if it's an array
        : data.errors?.[key];
    });
  } else {
    formattedErrors = data?.message || 'An error occurred';
  }

  return formattedErrors;
};
