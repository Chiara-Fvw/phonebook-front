const Persons = ({person, contactDeletion}) => {
  // console.log(person);
  
  return (
    <li> { person.name } { person.number} 
      <button onClick={contactDeletion}>
      Delete</button> 
    </li>
  )
}

export default Persons;