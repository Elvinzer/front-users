import React from 'react';
import {Button} from 'react-bootstrap';

import axios from 'axios';

export default class UsersList extends React.Component {
  state = {
    persons: []
  }

  // Fonction permettant d'envoyer les infos du child au parent via les props
  modifyUser = (event) => {
    this.props.modifyUser(event);
  }

  // Récupération de la liste de tous les users lors du montage du composant
  componentWillMount() {
    axios.get(`http://localhost:3500/users/all`)
      .then(res => {
        const persons = res.data.users.Items
        this.setState({ persons });
      })
  }

  render() {
    return (
      <div>
        { this.state.persons.map(person => 
            <div key={person.users_id} className="row mt-3">
              <div className="col">
                {person.lastname.toUpperCase()}
              </div>
              <div className="col">
                {person.firstname.charAt(0).toUpperCase() + person.firstname.slice(1)}
              </div>
              <div className="col">
                {person.birthdayDate}
              </div>
              <div className="col">
              <Button onClick={() => { this.modifyUser(person) }} variant="primary">
                Modifier
              </Button>
              </div>
            </div>
        )}
      </div>
    )
  }
}