async function handleApiCall(call) {
  self.postMessage({ isLoading: true });
  const res = await call;
  if (!res.ok) {
    try {
      const errorResponse = await res.json();
      self.postMessage({ errorResponse: errorResponse });
    } catch {}
  }
  self.postMessage({ doneLoading: true });
  return res;
}
