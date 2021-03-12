export const byteIndexToChar = (str: string, idx: number): number => {
  const encoder = new TextEncoder();
  let i = 0;
  let len = 0;
  for (i = 0; i < str.length && len <= idx; i++) {
    len += encoder.encode(str[i]).length;
  }
  return i - 1;
};

export const getLink = (line: string, col: number): string => {
  const back = line.slice(0, col);
  const forward = line.slice(col);

  const left = (back.match(/\[[^\]]*$/) ?? [""])[0];
  const right = (forward.match(/^\[?[^[]*]/) ?? [""])[0];

  return (left + right).replace(/[[\]]/g, "");
};
