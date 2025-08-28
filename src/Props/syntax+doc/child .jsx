import React from 'react'
import Parent from './parent'



//! Objects and Arrays has to be sent inside curly brackets:
const car = {
  id:'raghul', 
  role:'developer' ,
   expe:'1'
  }

  const data =["raghul",25 ,"developer"]




const Child  = () => {
  return (
    <>
    <h1>Pass Multiple Properties</h1>   
      <Parent name='Raghul' age={35}  isMarried={true} />
      <Parent name='Siva' age={45}   isMarried={false}  />
      <Parent name='Sam' age={55}  isMarried={true}  />
      <Parent   />
      <Parent  />

      <h1>Object </h1> 

      <h2>ID :{car.id}</h2>
      <h2>role :{car.role}</h2>
      <h2>exps :{car.expe}</h2>

      <h1>Array </h1> 

      <h3>myData :{data}</h3>
      <h3>Names :{data[0]}</h3>
      <h4>age :{data[1]}</h4>
      <h5>Domain :{data[2]}</h5>
      
    </>
  )
}

export default Child
