const Notification = ({notification}) => {
  const messageStyle = {
    color: 'green',
    border: 'solid, 3px, green',
    fontSize: 16,
    padding: 10,
    marginBottom: 25
  }
  if (notification.message === null) {
    return null
  }

  if (notification.type === 'error') {
    messageStyle.color = 'red';
    messageStyle.border = 'solid, 3px, red'
  }

  return (
    <div style={messageStyle}>
      {notification.message}
    </div>
  )
}

export default Notification