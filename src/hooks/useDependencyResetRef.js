import {useRef, useEffect} from 'react'

export function useDependencyResetRef({setState, dependencies, name}){
  const dependenciesRef = useRef([])

  let dependenciesString = JSON.stringify(dependencies)

  useEffect(() => {
    let dependenciesArray = JSON.parse(dependenciesString)
    if (dependenciesRef.current.length != dependenciesArray.length){
      dependenciesRef.current = dependenciesArray
    } else {
      setState({type: "UPDATE_STATE", name, payload: {value: ''}})
    }
  }, [dependenciesString])

}
