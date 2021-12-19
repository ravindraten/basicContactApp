import React, {useRef}from "react";
import { Link } from "react-router-dom";
import ContactCard from "./ContactCard"

//In order to pass contacts list  we need props, props pass data from  parent to child 
const ContactList = (props) =>{

    const deleteConactHandler = (id) => {
        props.getContactId(id);
      };

      const inputE1 = useRef("")
    const renderContactList = props.contacts.map((contact) => {
        return (
            <ContactCard 
                contact={contact}  
                clickHander={deleteConactHandler} 
                key={contact.id}
            />
        );
    });

    const getSearchTerm = () => {
        props.searchKeyword(inputE1.current.value)

    }
    return (
        <div className="main">
            <h2>
              Contact List
              <Link to="/add">
                <button className="ui button blue right"> Add Contact</button>
              </Link>
            </h2>
            <div className="ui search">
                <div className="ui icon input"> 
                    <input ref={inputE1}type="text" placeholder="Search Contacts" className="prompt" value={props.term} onChange={getSearchTerm}/>
                    </div>
                    <i className= "search icon" ></i>
            </div>
            <div className ="ui celled list">{renderContactList.length > 0 ? renderContactList : "Sorry no contacts"}</div>
        </div>
    );
};

export default ContactList;