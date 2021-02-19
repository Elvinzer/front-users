import React, {useState } from 'react';
import logo from './logo.png';
import './App.css';
import axios from 'axios';
import {Form, Button} from 'react-bootstrap';
import UsersList from './Components/UsersList';
import DatePicker from 'react-date-picker'

function App() {

  var [firstname, setFirstname] = useState('');
  var [lastname, setLastname] = useState('');
  var [users_id, setUsersId] = useState('');
  var [birthdayDate, setDate] = useState(new Date());
  // 'modification' permet de savoir si on se trouve dans le cas de la modif d'un user déjà présent dans la liste
  var [modification, setModification] = useState(false);

  function handleChangeFirstname(event){
    setFirstname(event.target.value)
  }
  function handleChangeLastname(event){
    setLastname(event.target.value)
  }
  function handleChangeDate(value){
    setDate(value)
  }

  // Objet qui sera envoyé lors des appels api
  const user = [
    {
      lastname : lastname,
      firstname : firstname,
      birthdayDate : birthdayDate.getDate() + '/' + (birthdayDate.getMonth()+1) + '/' + birthdayDate.getFullYear(),
      users_id: users_id
    }
  ]

  function modifyUser(data){
    setUsersId(data.users_id)
        
    // Nous sommes dans le cas d'une modification d'un user, pas sur une création
    setModification(true)

    // Modification dans le form pour le bloc d'administration
    setFirstname(data.firstname.charAt(0).toUpperCase() + data.firstname.slice(1))
    setLastname(data.lastname.toUpperCase())
    //Formatage de la date pour le date picker
    var dateParts = data.birthdayDate.split("/");
    var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    setDate(dateObject)
  }

  function addUser(user){
    if (!modification){
      axios.post(`http://localhost:3500/users/add`, { user })
      .then(res => {
        alert('Utilisateur ajouté !');
      })
    }
    else{
      axios.post(`http://localhost:3500/users/update`, { user })
      .then(res => {
        // Nous avons fini la modification
        setModification(false);
        alert('Utilisateur modifié !');
      })
    }
    
    
  }
  function deleteUser(user){
    if (modification){
      axios.post(`http://localhost:3500/users/remove`, { user })
        .then(res => {
          alert('Utilisateur suoprimé !');
        })
    }
    else{
      alert ('Pas de user à supprimer')
    }
    setModification(false)
  }
  return (
    
    <div className="App">
      <header className="App-header">
        <img className="logo" src={logo} alt="logo" />
      </header>
      <div className="jumbotron">
        <h1>Application de gestion des utilisateurs</h1>
      </div>
      
      <div className = "container">
      <h1 className="mt-5">Gestion utilisateur</h1>
        <Form className ="row mt-3">
          <Form.Group className ="col" controlId="formBasicFirstName">
            <Form.Label>Prénom :</Form.Label>
            <Form.Control className = "mx-sm-3" type="text" name="firstname" onChange={handleChangeFirstname} value={firstname} placeholder="Prénom de l'utilisateur.." />
          </Form.Group>

          <Form.Group className ="col" controlId="formBasicLastName">
            <Form.Label>Nom de famille :</Form.Label>
            <Form.Control type="text" onChange={handleChangeLastname} value={lastname} placeholder="Nom de l'utilisateur.." />
          </Form.Group>

          <Form.Group className ="col" controlId="formBasicDateOfBirth">
            <Form.Label id="dateLabel">Date de Naissance :</Form.Label>

            {/* Utilisation du date picker https://github.com/wojtekmaj/react-date-picker */}
            <DatePicker
              className ="form-control"
              minDate={new Date(1940, 0, 1)}
              maxDate={new Date(2006, 11, 31)}
              onChange={handleChangeDate}
              value={birthdayDate}
            />
          </Form.Group>
        </Form>
        <div className = "btnHandler">
          <Button className="mt-3" onClick={() => { addUser(user) }} variant="primary">
              Valider
          </Button>
          
          <Button className="mt-3" onClick={() => { deleteUser(user) }} variant="danger">
            Supprimer
          </Button>
        </div>
          
          
      <h1 className="mt-5 pt-5 border-top">Liste des utilisateurs</h1>
        <div className ="mb-5 allUsers">
          <div className="row mt-3">
            <div className="col">
              Nom
            </div>
            <div className="col">
              Prenom
            </div>
            <div className="col">
              Date de Naissance
            </div>
            <div className="col">
              Gestion de l'utilisateur
            </div>
          </div>
          <UsersList modifyUser={modifyUser}/>
        </div>
      </div>
    </div>
  );
}

export default App;