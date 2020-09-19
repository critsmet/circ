import React, {useState, useEffect} from 'react'
import * as EmailValidator from 'email-validator'

import { BASE } from '../../index.js'

export default function EventForm(){

  let today = new Date().toISOString().split('T')[0]

  let [nameState, setNameState] = useState({value: '', approved: null, error: ''})
  let [emailState, setEmailState] = useState({value: '', approved: null, error: ''})
  let [monthState, setMonthState] = useState({value: '', approved: null, error: ''})
  let [dayState, setDayState] = useState({value: '', approved: null, error: ''})
  let [yearState, setYearState] = useState({value: '', approved: null, error: ''})
  let [timeState, setTimeState] = useState({value: '', approved: null, error: ''})
  let [onlineState, setOnlineState] = useState({value: 0, approved: null, error: ''})
  let [locationState, setLocationState] = useState({value: '', approved: null, error: ''})
  let [categoryState, setCategoryState] = useState({value: [], approved: null, error: ''})
  let [descriptionState, setDescriptionState] = useState({value: '', approved: null, error: ''})
  let [tagState, setTagState] = useState({value: '', approved: null, error: ''})

  let [tagsState, setTags] = useState([])
  let [categoriesState, setCategories] = useState([])

  useEffect(() => {
    fetch(BASE + "/categories")
      .then(res => res.json())
      .then(setCategories)
  }, [0])


  function invalidString(string){
    if (string.includes('/>') || string.includes("</")){
      return true
    } else {
      return false
    }
  }

  function handleInputName(e){
    let value = e.target.value
    if (value.length > 70){
      return null
    } else if (invalidString(value)){
      setNameState(prevState => ({value, approved: false, error: 'Invalid Characters'}))
    } else {
      setNameState({value, approved: true, error: ''})
    }
  }

  function handleInputEmail(e){
    let value = e.target.value
    if (value.length <= 320){
      setEmailState(prevState => ({...prevState, value}))
    }
  }

  function validateEmail(){
    if (EmailValidator.validate(emailState.value)){
      setEmailState(prevState => ({...prevState, approved: true}))
    } else {
      console.log("NOT VALID EMAIL");
      setEmailState(prevState => ({...prevState, approved: false, error: 'Must be a valid email address'}))
    }
  }

  function handleInputMonth(e){
    //need to test to make sure this doesn't mess up in the back end
    let value = e.target.value
    console.log(e.target)
    setMonthState(prevState => ({...prevState, value}))
  }

  function handleInputDay(e){
    //need to test to make sure this doesn't mess up in the back end
    let value = e.target.value
    console.log(e.target)
    setDayState(prevState => ({...prevState, value}))
  }

  function handleInputYear(e){
    //need to test to make sure this doesn't mess up in the back end
    let value = e.target.value
    console.log(e.target)
    setYearState(prevState => ({...prevState, value}))
  }

  function handleInputTime(e){
    let value = e.target.value
    if (value && value <= "23:59"){
          console.log("Changed time!", value);
      setTimeState(prevState => ({...prevState, value, approved: true}))
    } else {
        console.log("not valid");
      setTimeState(prevState => ({...prevState, aproved: false, error: 'Time must be a valid time'}))
    }
  }

  function handleInputOnline(e){
    let value = e.target.checked
    setOnlineState(prevState => ({...prevState, value, approved: true}))
  }

  function handleInputLocation(e){
    let value = e.target.value
    if (!invalidString(value) && value.length <= 320){
      setLocationState(prevState => ({...prevState, value}))
    }
  }

  function validateInputLocation(){
    let value = locationState.value
    if (onlineState.value === true && (value.includes("http://") || value.includes("https://"))){
      setLocationState(prevState => ({...prevState, approved: true, error: ''}))
    } else {
      setLocationState(prevState => ({...prevState, approved: false, error: "Online events must have URLs that start with 'http://'"}))
    }
  }

  function handleInputCategory(e){
    let value = e.target.dataset.id
    if (!categoryState.value.includes(value)){
      setCategoryState(prevState => ({...prevState, value: [...prevState.value, value], approved: true}))
    } else {
      setCategoryState(prevState => ({...prevState, value: prevState.value.filter(category => category !== value)}))
    }
  }

  function handleInputDescription(e){
    let value = e.target.value
    if (value.length > 1500){
      return null
    } else if (invalidString(value)){
      setDescriptionState(prevState => ({value, approved: false, error: 'Invalid Characters'}))
    } else {
      setDescriptionState({value, approved: true, error: ''})
    }
  }

  function handleCompleteTag(e){
    let keyCode = e.keyCode
    let value = e.target.value
    console.log("Value that we're deciding if a tag should be made", value, "Length of that value", value.length)
    if (keyCode === 32 && (value !== "" && value !== " ")){
      setTags(prevState => [...prevState, value])
      setTagState(prevState => ({...prevState, value: ' '}))
    } else if (keyCode === 8 && tagState.value === ' '){
      setTags(prevState => {
        let newState = [...prevState]
        newState.pop()
        return [...newState]
      })
    }
  }

  function handleInputTag(e){
    let value = e.target.value
    console.log("Value", value, "Value Length", value.length)
    console.log((value === "" && tagsState.length === 0));
    console.log((value === " " && value !== "  " ));
    if (value === " "){
      if (tagsState.length >= 1){
        setTagState(prevState => ({...prevState, value }))
        return;
      } else if (tagsState.length === 0){
        setTagState(prevState => ({...prevState, value: ""}))
        return;
      }
    } else if ((value === "" && tagsState.length >= 1) || value == "  " || tagsState.length === 5 || value.length === 15 || (value !== "" && !value.replace(/ /g, "").match(/^[0-9a-zA-Z]+$/))){
      return;
    } else {
      setTagState(prevState => ({...prevState, value }))
      return;
    }
  }

  function removeTag(e){
    let tag = e.target.innerText
  }

  function renderTags(){
    if(tagsState.length >= 1){
      return (
      <div id="actualtags" className="muted-form-bg">
        {tagsState.map(tag => <div className="tag ilb">{tag} x</div>)}
      </div>)
    }
  }

  return(
    <form id="event-form" className="w-100 vh-80">
      <div className="mb2 mt2">
        <input className="w-95 h-100" type="text" name="name" placeholder="EVENT NAME" onChange={handleInputName} value={nameState.value}/>
        <span className={`w-3 ilb tr f1-5 ${nameState.value.length === 70 && "f-red"}`}>{nameState.value.length}</span>
      </div>
      <div className="mb2 gutter">
        <div id="flex-row">
          <label className="flex-row-item checkbox-label"><input type="checkbox" checked={onlineState.value} onChange={handleInputOnline}/><span className="checkbox-custom"></span><span>ONLINE</span></label>
          <input className="flex-row-item" type="text" name="location" onChange={handleInputLocation} onBlur={validateInputLocation} placeholder={onlineState.value ? "EVENT LINK" : "ADDRESS"} value={locationState.value}/>
        </div>
      </div>
      <div className="mb2 gutter">
        <div id="event-form-date-time">
          {/*<input className="ml1 w-30" type="date" min={today} name="date" onChange={handleInputDate} value={dateState.value}/>*/}
          <div>
            <select value={monthState.value} onChange={handleInputMonth}>
              <option value="1">JAN</option>
              <option value="2">FEB</option>
              <option value="3">MAR</option>
              <option value="4">APR</option>
              <option value="5">MAY</option>
              <option value="6">JUN</option>
              <option value="7">JUL</option>
              <option value="8">AUG</option>
              <option value="9">SEP</option>
              <option value="10">OCT</option>
              <option value="11">NOV</option>
              <option value="12">DEC</option>
            </select>
            <select value={dayState.value} onChange={handleInputDay}>
              {Array.from(Array(31).keys()).map(el => <option value={el + 1}>{el + 1}</option>)}
            </select>
            <select value={yearState.value} onChange={handleInputYear}>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
            </select>
          </div>
          <div className="tc">
            <select>
              {Array.from(Array(12).keys()).map(el => <option value={el + 1}>{el + 1}</option>)}
            </select>
            <select>
              <option value="00">00</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
              <option value="59">59</option>
            </select>
            <select>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          {onlineState.value ? <div><input className="w-100" type="text" name="zip" placeholder="TIME ZONE CITY, COUNTRY"/></div> : null}
        </div>
      </div>
      <div className="mb2">
        <textarea className="w-95 h-100" name="description" placeholder="DESCRIPTION" onChange={handleInputDescription} value={descriptionState.value}/>
        <span className={`w-3 ilb tr f1-5 ${descriptionState.value.length === 1500 && "f-red"}`}>{descriptionState.value.length}</span>
      </div>
      <div className="gutter">
        <div className="mb2">
          <label>CATEGORIES</label>
          <div id="event-form-checkboxes" className="f1-3 g-c4 mt1 pt1 muted-form-bg">

          </div>
        </div>
      </div>
      <div className="gutter">
        <div id="tags">
          {renderTags()}
          <input onKeyDown={handleCompleteTag} onChange={handleInputTag} placeholder="ADD UP TO 5 TAGS" value={tagState.value} id="tagsinput" type="text"/>
        </div>
      </div>
      <div className="gutter mt2">
        <div>
          <input className="w-75" type="text" name="creator_email" placeholder="ORGANIZER EMAIL" onChange={handleInputEmail} value={emailState.value} onBlur={validateEmail}/>
          <input className="fr" type="submit" value="SUBMIT" />
        </div>
      </div>
    </form>
  )
}
