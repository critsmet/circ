import React, {useRef, useEffect} from 'react'

export default function usePrev(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export default function useResetDependency({setState, array}){
  const ref = useRef()

  useEffect(() => {
    if (JSON.parse(array).length > 0){
      ref.current = array
    }
  }, [JSON.stringify(array)])

  return JSON.stringify(ref.current)
}
