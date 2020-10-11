import React, { useState, useContext, useEffect } from 'react'

import { FormStoreContext } from './Form'

export default function TagField({name='tags', divClassNames='', tagClassNames='', inputClassNames='', collectionClassNames='', counter=false, limit=Infinity, tagInputLimit=20, counterSpanClassNames, placeholder="Tags", defaultValue=[]}){

  const {setState, state, useRegisterWithFormContext} = useContext(FormStoreContext)
  let value = state[name] ? state[name].value : []

  useRegisterWithFormContext({defaultValue: value, name, defaultApproval: true})

  let [tagState, setTagState] = useState('')

  useEffect(() => {
    defaultValue.length > 0 && setTagState(' ')
    setState({type: "UPDATE_STATE", name, payload: {value: defaultValue, approved: true}})
  }, [defaultValue.length])


  function renderTagCounter(){
    return (
      <span className={`tc ${counterSpanClassNames} ${value.length === limit ? "input-limit" : ''}`}>
          {value.length}
      </span>
    )
  }

  function renderTags(){
    if(value.length >= 1){
      return (
      <div id={name+"-tag-collection"} className={collectionClassNames}>
        {value.map(tag => <div key={tag+"-tag"} className={"ilb "+tagClassNames}>{"#" + tag}</div>)}
      </div>)
    }
  }

  function handleInputTag(e){
    let input = e.target.value
    //This if statement prevents values that are empty spaces, does not allow text to be entered if the limit of tags has been reached OR if the limit of the length of the tag has been reached, and it won't allow any characters besides letters and numbers
    if (input === "  " || value.length === limit || input.length === tagInputLimit || (input !== "" && !input.replace(/ /g, "").match(/^[0-9a-zA-Z]+$/))){
      return;
    } else {
      setTagState(input)
      return;
    }
  }

  function handleCompleteTag(e, onBlur){
    let keyCode = e.keyCode
    let completeTag = e.target.value
    //This if statement registers a keydown on the spacebar OR someone clicking away from the field (via the second onBlur argument) as the person entering the tag attempting to complete it
    //It will not accept tags that are empty strings or just one string, and then resets the value of the input field
    //It will register a backspace as wanting to delete the most recently added tag
    if ((keyCode === 32 || onBlur) && (completeTag !== "" && completeTag !== " ")){
      setState({type: "UPDATE_STATE", name, payload: {value: [...value, completeTag.trim()], approved: true}})
      setTagState('')
    } else if (keyCode === 8 && value.length > 0){
      let newState = value
      newState.pop()
      setState({type: "UPDATE_STATE", name, payload: {value: newState, approved: true}})
    }
  }

  let containerGutterStyle = {
    display: 'grid',
    gridTemplateColumns: '95% 5%',
  }

  return (
    <div style={counter ? containerGutterStyle : {}} id={name + "-input-container"}>
      <div id={name+'-tag-collection-wrapper'}>
        <div id={name+"-tags-collection"} className={divClassNames}>
          {renderTags()}
          <input id={name+"-tag-input"} onKeyDown={handleCompleteTag} onChange={handleInputTag} placeholder={value.length === 0 && placeholder} onBlur={(e) => handleCompleteTag(e, true)}value={tagState} className={inputClassNames} type="text"/>
        </div>
      </div>
      {(counter && renderTagCounter())}
    </div>
  )
}

//FUTURE COMPONENT DEVELOPMENT
//1. The ability to click tags and delete them
//2. The ability to arrow left and highlight + erase specific tags. Because the tag collection isn't actually an input field,
//  the cursor doesn't reach in between tags. So creating the sensation of being able to use the keyboard arrow to highlight/select and delete a tag
