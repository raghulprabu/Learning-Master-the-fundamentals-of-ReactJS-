import React from 'react'
import Childrenchild from './childrenchild'

const Parentchild = () => {
  return (
    <div>
      {/* In React, you can send the content between the opening and closing tags of a component, to another component. */}
        <Childrenchild>
          <h1> this is Front end developement courses </h1>
            <h1>this is  react js courses complete  </h1>
        </Childrenchild>

    </div>
  )
}

export default Parentchild