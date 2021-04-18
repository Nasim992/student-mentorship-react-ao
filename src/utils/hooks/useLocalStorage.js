import { useEffect, useState } from 'react'

/**
 * const [user,setUser]=useLocalStorage('user',{})
 * const [user,setUser]=useLocalStorage('user',()=>{})
 */

const PREFIX = "demo-"
export default function useLocalStorage(key, initValue) {
    const prefixed_key = PREFIX + key

    const [state, setstate] = useState(() => {
        if (localStorage.getItem(prefixed_key) != null) {
            console.log("not null");
            return JSON.parse(localStorage.getItem(prefixed_key))
        }
        if (typeof initValue === 'function') {
            console.log("function");
            return initValue()
        } else {
            console.log("not function");
            return initValue
        }
    })

    useEffect(() => {
        localStorage.setItem(prefixed_key, JSON.stringify(initValue))
    }, [prefixed_key, state])

    return [state, setstate]
}
