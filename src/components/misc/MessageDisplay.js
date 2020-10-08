import React from 'react'

import { Link } from 'react-router-dom'

export default function MessageDisplay({match}){
  // Thanks for submitting your event to Circular. You'll receive an e-mail once it's been approved by one of our moderators. The message will include a link that you can use to make future edits to your event.

  function renderMessage(){
    let subject = match.params.subject
    let status = match.params.status
    switch(subject){
      case 'email-confirmation':
        if (status === "approved"){
          return <> Your e-mail address has been approved. Any events that you have submitted will now be queued for review by our moderators. <Link to="/">Click here </Link> to return to the main events page. </>
        } else if (status === "denied"){
          return <> There was an error approving your address. If the link provided in the e-mail led you here, reach out to us at contact@circular.events so we can help you out.</>
        } else {
          return <> This page does not exist </>
        }
      case 'submitted-event':
        if(status === "approved"){
          return <> Your event has successfully been submitted, and is now waiting to be approved by our moderators. You will receive an e-mail confirmation once it has been approved, as well as a link you can use to edit the event if necessary. Contact us at contact@circular.events if you have any questions. </>
        } else if (status === "rejected"){
          return <> There was a problem with our server that prevented your event from being submitted. Try again, and if the problem persists contact us at contact@circular.events so we can help you out. </>
        } else if (status === "email-confirmation-required"){
          return <> Your event has successfully been submitted, but before our moderators can review it, you must confirm your e-mail address. Check the inbox of the e-mail address you provided and follow the link to confirm. Contact us at contact@circular.events if you have any questions. </>
        } else if (status === "denied"){
          return <> An error occured on the server when processing your event. Try submitting it again. If this problem continues, reach out to us at contact@circular.events so we can help you out.</>
        } else {
          return <> This page does not exist </>
        }
      case 'event':
        if(status === "expired"){
          return <>This event has already passed, so it isn't possible to edit it.</>
        } else if (status === "pending"){
          return <>This event has not yet been approved.</>
        }
      default:
        return <> This page does not exist </>
    }
  }

  return (
    <div id="message-display" className="tj f2 pt5">
       {renderMessage()}
    </div>
  )
}
