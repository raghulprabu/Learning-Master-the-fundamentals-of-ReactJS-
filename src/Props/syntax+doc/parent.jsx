import React from 'react'
import "./style.css"
 import PropTypes from "prop-types";

const Parent = (props) => {
  return (
    <div className='student'>
      <table>
        <tbody>
          <tr>
            <th>NAME</th>
            <td>{props.name}</td>
          </tr>
          <tr>
            <th>AGE</th>
            <td>{props.age}</td>
          </tr>
          <tr>
            <th>Married</th>
            <td>{props.isMarried ? "Yes" : "No"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
};

Parent.propTypes = {
  name: PropTypes.string,
  age: PropTypes.number,
  isMarried: PropTypes.bool,
};

Parent.defaultProps = {
  name: "Unknown",
  age: 0,
  isMarried: false,
  car: null
};

export default Parent;
