import { useEffect, useState } from 'react';

/** Small persisted state hook. */
function useLocalState<T>(key: string, init: T) {
    const [v, setV] = useState<T>(() => {
      try {
        const s = localStorage.getItem(key)
        return s ? (JSON.parse(s) as T) : init
      } catch { return init }
    })
	
    useEffect(() => {
    	try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
    }, [key, v])
    
    return [v, setV] as const
}

export default useLocalState;
