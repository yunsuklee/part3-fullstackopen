import React from 'react'

const Notification = ({ message, messageType }) => {
  if (!message) return null

  return (
    <div id="notification" className={messageType}>
      {message}
    </div>
  )
}

export default Notification