import React, { useReducer, useEffect } from 'react'

import { formReducer, stateObjTemplate } from './formMod'

export const FormStoreContext = React.createContext({state: null, function: () => {}})

//Reference the README in this folder for more information on using this 'smart' From component and the components that work with it 
export const Form = ({render}) => {
  const [state, setState] = useReducer(formReducer, {})

  //This hook will be available to all input components that are children of this 'smart' Form because they will all be consumers to the provider
  //Each input component will 'report' to the state held within this component so that all values from all inputs will be kept here
  function useRegisterWithFormContext({name, defaultValue, defaultApproval}){
      useEffect(() => {
        //We're adding an object to the state array being held in the FormStoreContext, which is keeping track of all inputs in the form
        setState({type:"ADD_FIELD", payload: {[name]: {...stateObjTemplate, value: defaultValue, approved: defaultApproval}}})
        return () => {
          //When the component for the form field unmounts, we remove the key from the store's state, thereby erasing all data stored in the value
          //So when all components composing the form unmount, the store's state object should return to an empty array
          setState({type: "REMOVE_FIELD", payload: name})
        }
      }, [])
  }

  return (
    <FormStoreContext.Provider value={{state, setState, useRegisterWithFormContext}}>
      {render(state)}
    </FormStoreContext.Provider>
  )
}
