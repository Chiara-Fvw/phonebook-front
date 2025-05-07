import { useState, useEffect } from "react"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import Notification from "./components/Notification"
import pbServices from "./services/phonebook"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [namesToDisplay, setNamesToDisplay] = useState(persons)
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState({message: null, type: 'success'})

  useEffect(() => {
    console.log('use effect');
    pbServices
      .getAll()
      .then(response => {
        console.log('promise fullfilled')
        setPersons(response.data)
        setNamesToDisplay(response.data)
      })
  }, [])

  const filterNames = (personsList) => {
    return searchTerm
      ? personsList.filter(({name}) => name.toLowerCase().startsWith(searchTerm.toLowerCase()))
      : personsList;
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handelNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearch = (event) => {
    const term = event.target.value
    setSearchTerm(term)
    setNamesToDisplay(persons.filter(({name}) => name.toLowerCase().startsWith(term.toLowerCase())))
  };

  const exists = ({name}) => {
    const allNames = persons.map(person => person.name);
    return allNames.includes(name)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObj = {
      name: newName,
      number: newNumber
    }
    
    if (exists(personObj)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const id = persons.find(({name}) => name === personObj.name).id
        pbServices
          .update(id, personObj)
          .then(response => {
            if (response.statusText === 'OK') {
             let updatedPersons = persons.map(pax => {
                    if (pax.id === id) {
                      return {...pax, number: personObj.number};
                    } 
                    return pax;
                  })
              setPersons(updatedPersons)
              setNamesToDisplay(filterNames(updatedPersons))
              setNotification({message: 'The number has been updated.', type: 'success'})
            }
          })
          .catch((error) => setNotification(
            { 
              message: `Information of ${personObj.name} has already been removed from server`, type: 'error'
            }))
      }     
    } else {
      pbServices
        .create(personObj)
        .then(response => {
          const updatedPersons = persons.concat(response.data)
          setPersons(updatedPersons)
          setNamesToDisplay(filterNames(updatedPersons))
          setNotification({message: `${personObj.name} has been created.`, type: 'success'})
        })
    }
    setTimeout(() => setNotification({message: null, type: 'success'}), 5000)

    setNewName('')
    setNewNumber('')
  }

  const deleteContact = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      pbServices
        .erase(id)
        .then(response => {
          if (response.statusText === 'OK') {
            const updatedPersons = persons.filter((person) => person.id !== id)
            setPersons(updatedPersons)
            setNamesToDisplay(filterNames(updatedPersons))
          } else {
            alert(`Impossible to delete ${name}`)
          }
        })
    } 
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}/>
      <Filter searchTerm={searchTerm} handleSearch={handleSearch} />

      <h2>Add a new contact</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handelNumberChange}
        />

      <h2>Numbers</h2>
        <ul>
          {namesToDisplay.map((person) => (
            <Persons 
              key={person.id}
              person={person} 
              contactDeletion={() => deleteContact(person.name, person.id)}
            />
          ))}
        </ul>
    </div>
  )
}

export default App