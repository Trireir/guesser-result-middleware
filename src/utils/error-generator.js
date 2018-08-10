
function createError(status, message, extra = {}) {
  return {
    status,
    message,
    extra,
  };
}

export default createError;
