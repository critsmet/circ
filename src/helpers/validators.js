//On change validators do not provide errors. the person changing the field will only be prevented from making an invalid change.
//Therefore, the runOnChangeValidators method only returns true or false.
function runOnChangeValidators({value, name, validators}){
  let messages = []
  validators.forEach(validator => {
    let result = (validator({value, name}))
    if (!result.pass){
      messages = [...messages, ...result.messages]
    }
  })
  return {pass: messages.length > 0 ? false : true, errors: messages}
}

//This validator iterates over the array of validators passed in as an argument
//These validators likely have some async functionality which is why async/await is used here
async function runAfterEntryValidators({value, name, validators}){
  let messages = []
  let changeValue = null

  for (var i = 0; i !== validators.length; ++i) {
    let result = await validators[i]({name, value})
    if (!result.pass) {
      messages.push(result.messages)
    }
    if (result.changeValue){
      changeValue = result.changeValue
    }
  }
  return {pass: messages.length > 0 ? false : true, changeValue, errors: messages}

}

//In order to keep the arguments passed in to the main validator the same, this validator "builder" takes in an argument that the principal validator will use.
//It then returns a function that will accept the value and name of the inputs that will be passed in from within the component
function createInvalidStringValidator(array){
  return (obj) => invalidStringValidator({...obj, array})
}

function invalidStringValidator ({value, name, array}) {
  let messages = []
  array.forEach(invStr => {
    if (value.includes(invStr)){
      messages.push(`'${invStr}' is not a permitted input for the ${name} field`)
    }
  })
  if (messages.length > 0){
    return {pass: false, messages: messages}
  } else {
    return {pass: true, messages: []}
  }
}

//Another example of a validator "builder"
function createLengthValidator(limit){
  return (obj) => lengthValidator({...obj, limit})
}

function lengthValidator({value, limit, name}){
  let lineBreaks = value.match(/$/mg).length
  let trueLength = (lineBreaks - 1) * 100 + value.length
  if (trueLength > limit){
    return {pass: false, messages: [`Character limit for ${name} field is ${limit}`]}
  } else {
    return {pass: true, messages: []}
  }
}

function yearValidator({minYear, maxYear, yearInQuestion}){
  return (yearInQuestion >= minYear && yearInQuestion <= maxYear) ? {pass: true, messages: []} :  {pass: false, messages: ["Invalid year"]}
}

function monthValidator({minYear, maxYear, selectedYear, minMonth, maxMonth, monthInQuestion}){
  if (monthInQuestion > 12 || monthInQuestion < 1){
    return {pass: false, messages: ["Invalid month"]}
  }
  if (minYear && minYear === selectedYear){
    //the year that was selected is the current year, which is also the minimum year, meaning that some months may have already passed
    if (minMonth > monthInQuestion){
      //disable all months that have already passed
      return {pass: false, messages: ["Invalid month"]}
    }
  } else if (maxYear && maxYear === selectedYear){
    //the year that was selected is the current year, which was also the max year, meaning that the months that haven't passed aren't valid
    if (maxMonth < monthInQuestion){
      return {pass: false, messages: ["Invalid month"]}
    }
  }
  //allow all months that haven't passed the ability to be selected
  return {pass: true, messages: []}
}

function dayValidator({minYear, maxYear, selectedYear, minMonth, maxMonth, selectedMonth, minDay, maxDay, dayInQuestion, selectedDay, hours}){
  const thirty = [4, 6, 9, 11]
  if (minYear && minYear === selectedYear){
    //the minimum year is the the selected year
    if(minMonth && minMonth === selectedMonth){
      //this month is the minimum month, meaning some of the days may have already passed
      if (hours === 23 && dayInQuestion === selectedDay - 1){
        //it's 11 PM on the day before the minimum day so this day shouldn't pass
        return {pass: false, messages: ["Invalid day"]}
      }
      else if(minDay && minDay > dayInQuestion){
        //today is the minimum day and any days before today should be disabled
        return {pass: false, messages: ["Invalid day"]}
      } else if (thirty.includes(selectedMonth)){
        //if the month has only 30 days in it, make 31 disabled
        if (dayInQuestion >= 31){
          return {pass: false, messages: ["Invalid day"]}
        }
        else if (selectedMonth === 2){
          //if the year is february
          if (selectedYear % 4 === 0){
            //if it's leap year, make the limit 29
            if (dayInQuestion > 29){
              return {pass: false, messages: ["Invalid day"]}
            }
          } else if (dayInQuestion > 28){
            //if it's not leap year, make it 28
            return {pass: false, messages: ["Invalid day"]}
          }
        }
      }
    } else if (thirty.includes(selectedMonth)){
      //the month that changed is not this month
      if (dayInQuestion >= 31){
        //still have to prevent 31 from being an option in a month with 30 days
        return {pass: false, messages: ["Invalid day"]}
      }
    } else if (selectedMonth === 2){
      //same with February and leap year
      if (selectedYear % 4 === 0){
        if (dayInQuestion > 29){
          return {pass: false, messages: ["Invalid day"]}
        }
      } else if (dayInQuestion > 28){
        return {pass: false, messages: ["Invalid day"]}
      }
    }
  } else if (maxYear && maxYear === selectedYear){
    if (maxMonth && maxMonth === selectedMonth){
      if (maxDay && maxDay < dayInQuestion){
        return {pass: false, messages: ["Invalid day"]}
      }
    } else if (thirty.includes(selectedMonth)){
      //the month that changed is not this month
      if (dayInQuestion === 31){
        //still have to prevent 31 from being an option in a month with 30 days
        return {pass: false, messages: ["Invalid day"]}
      }
    } else if (selectedMonth === 2){
      //same with February and leap year
      if (selectedYear % 4 === 0){
        if (dayInQuestion > 29){
          return {pass: false, messages: ["Invalid day"]}
        }
      } else if (dayInQuestion > 28){
        return {pass: false, messages: ["Invalid day"]}
      }
    }
  } else if (thirty.includes(selectedMonth)){
  //the year that was selected is not the current year
    if (dayInQuestion >= 31){
      //still have to validate months with 30 days, and february
      return {pass: false, messages: ["Invalid day"]}
    }
  } else if (selectedMonth === 2){
    if (selectedYear % 4 === 0){
      if (dayInQuestion > 29){
        return {pass: false, messages: ["Invalid day"]}
      }
    } else if (dayInQuestion > 28){
      return {pass: false, messages: ["Invalid day"]}
    }
  }
  return {pass: true, messages: []}
}

function hourValidator({selectedYear, minYear, selectedMonth, minMonth, selectedDay, minDay, maxYear, maxMonth, maxDay, selectedHour, currentHour}){
  if (selectedYear === minYear && selectedMonth === minMonth && selectedDay === minDay){
    if (selectedHour <= currentHour){
      return {pass: false, messages: ["Invalid hour"]}
    }
  } else if (selectedYear === maxYear && selectedMonth === maxMonth && selectedDay === maxDay){
    if (selectedHour > currentHour){
      return {pass: false, messages: ["Invalid hour"]}
    }
  }
  return {pass: true, messages: []}
}


export function timeValidator({hours, minutes}){
  if (hours > 23 || hours < 0){
    return {pass: false, errors: ["Invalid hour"]}
  } else if (minutes > 59 || minutes < 0){
    return {pass: false, errors: ["Invalid hour"]}
  } else {
    return {pass: true, errors: []}
  }
}

//The dateReconfigurer is a validator that corrects other date values if necessary.
//For example, if the current selected date is March 30, 2020, and then the month value changes to February, well obviously February 30 is not a valid date, so the date reconfigurer will change the day to the first valid day for the month
//This will then get ultimately set as the new value
function dateReconfigurer({changedValue, fieldName, minYear, maxYear, selectedYear, minMonth, maxMonth, selectedMonth, minDay, maxDay, selectedDay, setState}){
  if (fieldName === "year"){
    //the year changed
    let configuredYear = changedValue
    if (!yearValidator({minYear, maxYear, yearInQuestion: changedValue}).pass){
      configuredYear = minYear
    }
    if(!monthValidator({minYear, maxYear, selectedYear: configuredYear, minMonth, maxMonth, monthInQuestion: selectedMonth}).pass){
      //the year changed, but the month wasn't valid
      let newMonth = selectedMonth + 1
      while (!monthValidator({minYear, maxYear, selectedYear: configuredYear, minMonth, maxMonth, monthInQuestion: newMonth}).pass){
        newMonth = newMonth >= 12 ? 1 : newMonth + 1
      }
      if (!dayValidator({minYear, maxYear, selectedYear: configuredYear, minMonth, maxMonth, selectedMonth: newMonth, minDay, maxDay, dayInQuestion: selectedDay}).pass){
        //the year changed, but the month AND the day weren't valid
        let newDay = selectedDay >= 31 ? 1 : selectedDay + 1
        while (!dayValidator({minYear, maxYear, selectedYear: configuredYear, minMonth, maxMonth, selectedMonth: newMonth, minDay, maxDay, dayInQuestion: newDay}).pass){
          //continue adding 1 to days, resetting at 31, until the day is valid
          newDay = newDay >= 31 ? 1 : newDay + 1
        }
        return {day: newDay, year: configuredYear, month: newMonth}
      } else {
        //the year changed and the month changed and the day was valied
        return {day: selectedDay, year: configuredYear, month: newMonth}
      }
      } else {
        //the year changed and the month was valid
        if (!dayValidator({minYear, maxYear, selectedYear: configuredYear, minMonth, maxMonth, selectedMonth, minDay, maxDay, dayInQuestion: selectedDay}).pass){
          //the year changed and the month was valid but the day wasn't
          let newDay = selectedDay >= 31 ? 1 : selectedDay + 1
          while (!dayValidator({minYear, selectedYear: configuredYear, minMonth, selectedMonth, minDay, dayInQuestion: newDay}).pass){
            //continue adding 1 to days, resetting at 31, until the day is valid
            newDay = newDay >= 31 ? 1 : newDay + 1
          }
          return {day: newDay, month: selectedMonth, year: configuredYear}

        } else {
          //the year changed and the month and day were valid
          return {month: selectedMonth, day: selectedDay, year: configuredYear}
        }
      }
    } else if(fieldName === "month"){
      let configuredMonth = changedValue
      //the month changed
      while (!monthValidator({minYear, maxYear, selectedYear, minMonth, maxMonth, monthInQuestion: configuredMonth}).pass){
        configuredMonth = configuredMonth >= 12 ? 1 : configuredMonth + 1
      }
      if (!dayValidator({minYear, maxYear, selectedYear, minMonth, maxMonth, selectedMonth: configuredMonth, minDay, maxDay, dayInQuestion: selectedDay}).pass){
        //the month changed, but the day wasn't valid
        let newDay = selectedDay >= 31 ? 1 : selectedDay + 1
        while (!dayValidator({minYear, maxYear, selectedYear, minMonth, maxMonth, selectedMonth: configuredMonth, minDay, maxDay, dayInQuestion: newDay}).pass){
          //continue adding 1 to days, resetting at 31, until the day is valid
          newDay = newDay >= 31 ? 1 : newDay + 1
        }
        return {day: newDay, year: selectedYear, month: configuredMonth}
      } else {
        //the month changed and the day was valid
        return {day: selectedDay, year: selectedYear, month: configuredMonth}
      }
    } else {
      //the day changed
      let configuredDay = changedValue
      while (!dayValidator({minYear, maxYear, selectedYear, minMonth, maxMonth, selectedMonth, minDay, maxDay, dayInQuestion: configuredDay}).pass){
        configuredDay = configuredDay >= 31 ? 1 : configuredDay + 1
      }
      return {month: selectedMonth, day: configuredDay, year: selectedYear}
    }
}

//This validator takes an address and sends it through the Here Geocoding API, which returns an array of matching items
//Because we want specificity, only addresses that return one single match (we can expect that it's an *exact* match), should be considered a pass through the validator
//The validator then returns this value to the component through the changeValue key in the object, so that the more specific address makes it to the DB
async function addressValidator({value, name}){
  let formattedValue = value.replace(/\s/g, '+')

  try {
    let res = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${formattedValue}&apiKey=VXDsAY_FhGDql7jAiw1u0oD6qNFuZm3_BpccIH89maQ`)
    let jsonObj = await res.json()
    let address = replaceKnownLocationErrors(jsonObj.items[0].address.label)

    if (jsonObj.items.length === 1){
      return {pass: true, changeValue: address, messages: []}
    } else {
      return {pass: false, changeValue: "", messages: ["INVALID ADDRESS"]}
    }
  }

  catch {
    return {pass: false, changeValue: "", messages: ["GEOCODING ERROR, TRY AGAIN"]}
  }

}

//Running list of known errors coming from the Geocoding API
function replaceKnownLocationErrors(string){
  return string.replace("CMX", "Ciudad de México")
}

async function safeLinkValidator({value, name}){
  try {
    let res = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyCqNUCSLsvaVgNt-vsYkhZqwLxAtackbYY`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {
        "client": {
          "clientId":      "circular",
          "clientVersion": "0.0.1"
        },
        "threatInfo": {
          "threatTypes":      ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
          "platformTypes":    ["ALL_PLATFORMS"],
          "threatEntryTypes": ["URL"],
          "threatEntries": [
            {"url": value}
          ]
        }
      })
    }).then(res => res.json())
    if (!res.matches){
      return {pass: true, changeValue: null, messages: []}
    } else {
      return {pass: false, changeValue: "", messages: ["UNSAFE URL"]}
    }
  }

  catch {
    return {pass: false, changeValue: "", messages: ["AN ERROR OCCURED, TRY AGAIN"]}
  }
}

//This validator simply makes a request to a URL and if it receives a response code of 200, it's cleared as a valid link
async function linkValidator({value, name}){
  try{
    let res = await fetch(`https://cors-anywhere.herokuapp.com/${value}`)
    if (res.status === 200){
      return {pass: true, changeValue: null, messages: []}
    } else {
      return {pass: false, changeValue: "", messages: ["INVALID URL"]}
    }
  }

  catch{
    return {pass: false, changeValue: "", messages: ["AN ERROR OCCURED, TRY AGAIN"]}
  }
}

function emailValidator({value, name}){
  const tester = /^[-!#$%&'*+0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  const [account, address] = value.split('@');
  const domainParts = value.split('.');

  if (!value){
    return {pass: false, changeValue: "", messages: ["INVALID EMAIL"]};
  } else if (value.length > 256) {
    return {pass: false, changeValue: "", messages: ["INVALID EMAIL"]};
  } else if (!tester.test(value)){
    return {pass: false, changeValue: "", messages: ["INVALID EMAIL"]};
  } else if (account.length > 64){
    return {pass: false, changeValue: "", messages: ["INVALID EMAIL"]};
  } else if (domainParts.some(function (part) {
    return part.length > 63;
  })){
    return {pass: false, changeValue: "", messages: ["INVALID EMAIL"]};
  } else {
  return {pass: true, messages: []};
  }
}

//Another validator "builder"
function createArrayLimit(limit){
  return (obj) => arrayLimit({...obj, limit})
}

function arrayLimit({value, name, limit}){
  if (value.length >= limit){
    return {pass: false, messages: [`Limit for ${name} field is ${limit}`]}
  } else {
    return {pass: true, messages: []}
  }
}

export default {
  runOnChangeValidators,
  runAfterEntryValidators,
  createInvalidStringValidator,
  createLengthValidator,
  yearValidator,
  monthValidator,
  dayValidator,
  dateReconfigurer,
  addressValidator,
  replaceKnownLocationErrors,
  safeLinkValidator,
  linkValidator,
  emailValidator,
  createArrayLimit,
  hourValidator,
  timeValidator
}
