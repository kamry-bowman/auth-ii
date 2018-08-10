import React from 'react'

function makeLogout (revokeAuthentication) {
  return () => {
    window.localStorage.removeItem('jwt');
    revokeAuthentication();
  }
}

export default ({ revokeAuthentication }) => {

  return (
    <button onClick={makeLogout(revokeAuthentication)}>
      Logout
    </button>
  )
}
