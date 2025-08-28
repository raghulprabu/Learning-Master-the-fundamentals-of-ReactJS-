import React from 'react'
import PropTypes from 'prop-types'

// ! React Props Children

const childrenchild = (props) => {
  return (
    <div>
      <h1>Children Componnets</h1>
      {/* This can be accessed in the other component using the props.children property. */}
      <h1>{props.children}</h1>
        
    </div>
  )
};
childrenchild.prototype={
  children:PropTypes.array

}

export default childrenchild