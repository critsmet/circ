import React, { useReducer, useEffect } from 'react'

import { formReducer, stateObjTemplate } from './formMod'

export const FormStoreContext = React.createContext({state: null, function: () => {}})

export const Form = ({render}) => {
  const [state, setState] = useReducer(formReducer, {})

  function useRegisterWithFormContext({name, defaultValue, defaultApproval}){

      useEffect(() => {
        //REGISTER FORM FIELD TO FORM STORE CONTEXT
        //We're adding an object to the state array being held in the FormStoreContext, which is keeping track of all inputs in the form
        setState({type:"ADD_FIELD", payload: {[name]: {...stateObjTemplate, value: defaultValue, approved: defaultApproval}}})
        return () => {
          //When the component for the form field unmounts, we remove the key from the store's state, thereby erasing all other values
          //When all components composing the form unmount, the store's state object should return to an empty array
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
