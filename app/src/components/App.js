import React , {useState,useEffect} from "react";
import {BrowserRouter as Router,Switch,Route} from  'react-router-dom';
import {uuid} from 'uuidv4'
import './App.css';
import api from "../endpoints/contacts"
import Header from "./Header"
import AddContact from "./AddContact"
import ContactList from "./ContactList"
import ContactDetail from "./ContactDetail";
import EditContact from "./EditComponent"

 
//We are going to use react hook useState() for our functional component app() and its an empty array of conttacts
function App() {
  const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const retrieveContacts = async () => {
    const response = await api.get("/contacts");
    return response.data;
  }

  const addContactHandler = async (contact) => {
    const request = {
      id:uuid(),
      ...contact,
    };

    const response = await api.post("/contacts",request)
    console.log(response)
    setContacts([...contacts, response.data])
  };

  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact)
    const {id, name, email } = response.data;
    setContacts(
      contacts.map((contact) => {
        return contact.id === id ? {...response.data} : contact;
      })
    );
  };

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact) => {
    return contact.id !== id;
  });
   setContacts(newContactList);
  };

  useEffect(()=>{
    const getContactDetails = async () => {
      const allcontacts = await retrieveContacts();
      if (allcontacts) setContacts(allcontacts);
    }

    getContactDetails();
    },[])
   
  const searchHandler = (searchTerm) =>{
   setSearchTerm(searchTerm)
   if (searchTerm !== "") {
     const newContactList = contacts.filter((contact) => {
       return Object.values(contact)
          .join("")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
     })

     setSearchResults(newContactList)
   }
   else{
     setSearchResults(contacts)
   }
  }
  
  useEffect(()=>{
  },[contacts]) 
  // Contactlist has a property name contacts and we are passing prop in {} brackets
  return (
    <div className="ui container"> 
      <Router>
      <Header />
      <Switch>
        <Route 
          path= "/" 
          exact 
          render={(props) => (
            <ContactList 
            {...props}
            contacts={searchTerm.length< 1 ? contacts : searchResults} 
            getContactId={removeContactHandler} 
            term={searchTerm}
            searchKeyword={searchHandler}
            />
          )}
        />
        <Route 
          path="/add" 
          render={(props) => (
            <AddContact {...props} addContactHandler={addContactHandler}/>
          )}
        />

        <Route 
          path="/edit" 
          render={(props) => (
            <EditContact {...props} updateContactHandler={updateContactHandler}/>
          )}
        />
          <Route path="/contact/:id" component={ContactDetail} />
      </Switch>
      </Router>
    </div>
  );
}

export default App;
