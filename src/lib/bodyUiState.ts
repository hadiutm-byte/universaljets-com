const getStateAttribute = (state: string) => `data-ui-${state}`;
const getCountAttribute = (state: string) => `data-ui-${state}-count`;

export const setBodyUiState = (state: string, active: boolean) => {
  if (typeof document === "undefined") return;

  const body = document.body;
  const countAttribute = getCountAttribute(state);
  const stateAttribute = getStateAttribute(state);
  const currentCount = Number(body.getAttribute(countAttribute) ?? "0");
  const nextCount = active ? currentCount + 1 : Math.max(0, currentCount - 1);

  if (nextCount === 0) {
    body.removeAttribute(countAttribute);
    body.removeAttribute(stateAttribute);
    return;
  }

  body.setAttribute(countAttribute, String(nextCount));
  body.setAttribute(stateAttribute, "true");
};