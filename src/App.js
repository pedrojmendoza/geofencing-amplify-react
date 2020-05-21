/* src/App.js */
import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import "./App.css";

const initialState = { name: '', description: '' }

export const icon = new Icon({
  iconUrl: "/skateboarding.svg",
  iconSize: [25, 25]
});

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  const [activeTodo, setActiveTodo] = React.useState(null);

  return (
    <Map center={[45.4, -75.7]} zoom={11}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {todos.map(todo => (
        <Marker
          key={todo.id}
          position={[
            todo.lon,
            todo.lat
          ]}
          onClick={() => {
            setActiveTodo(todo);
          }}
          icon={icon}
        />
      ))}

      {activeTodo && (
        <Popup
          position={[
            activeTodo.lon,
            activeTodo.lat,
          ]}
          onClose={() => {
            setActiveTodo(null);
          }}
        >
          <div>
            <h2>{activeTodo.description}</h2>
          </div>
        </Popup>
      )}            
    </Map>

  )
}

export default withAuthenticator(App)