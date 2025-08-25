// import React from 'react'
import "./style.css"
import PropTypes from "prop-types";


const parent = (props) => {
  return (
    <div className='student'>
        <table>
            <tr>
                <th>NAME</th>
                <td>{props.name}</td>
            </tr>
            <tr>
                <th>AGE</th>
                <td>{props.age}</td>
            </tr>
            <tr>
                <th>isMarried</th>
                <td>{props.isMarried ? "yes" : "No"}</td>
            </tr>
        </table>

    </div>
  )
};

 parent.propTypes = {
    name: PropTypes.string,
    age: PropTypes.number,
    isMarried: PropTypes.bool
 };

 export default parent;