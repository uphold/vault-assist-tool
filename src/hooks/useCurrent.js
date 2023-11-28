import { useRef } from 'react';

export const useCurrent = value => {
  const ref = useRef(value);

  ref.current = value;

  return ref;
};
