export const errorHandle = (code, message) => {
  const err = new Error();
  err.message = message;
  err.statusCode = code;
  return err;
};
