import {useRef, useEffect} from 'react'


//As I was writing out all of this logic for why I use this hook I thought of a different way to achieve the same goal, but might still need this later so keeping it and will write out the documentation if it truly does come in handy in the future. 

export function useDependencyResetRef({setState, dependencies, name}){
  const dependenciesRef = useRef([])
  let dependenciesString = JSON.stringify(dependencies)

  useEffect(() => {
    console.log("DEP", dependencies, "STR", dependenciesString, "REF", dependenciesRef.current);
    let dependenciesArray = JSON.parse(dependenciesString)
    if (dependenciesRef.current.length !== dependenciesArray.length){
      dependenciesRef.current = dependenciesArray
    } else {
      setState({type: "UPDATE_STATE", name, payload: {value: ''}})
    }
  }, [dependenciesString])

}
