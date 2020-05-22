/* src/App.js */
import React, { useEffect, useState } from 'react'

import { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Map, Popup, TileLayer, FeatureGroup, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import "./App.css";

const initialState = { name: '', geometry: '' }

const App = () => {
  const [formState, setFormState] = useState()
  const [todos, setTodos] = useState([])
  const [activeTodo, setActiveTodo] = useState(null);

  // data operations
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

  async function addTodo() {
    try {
      const enteredName = prompt('Please enter the region name')
      formState.name = enteredName;
      if (!formState.name || !formState.geometry) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  return (
    <>
      <Map center={[45.4, -75.7]} zoom={11}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        <FeatureGroup>
          <EditControl
              position="topright"
              onCreated={e => {
                console.log(e);
                //console.log(JSON.stringify(e.layer.toGeoJSON().geometry.coordinates));
                // Reverse order of lat and lon
                let latlons = [];
                for (let lonlat of e.layer.toGeoJSON().geometry.coordinates[0]) {
                  let latlon = [];
                  latlon.push(lonlat[1], lonlat[0]);
                  latlons.push(latlon);
                }
                setInput('geometry', JSON.stringify(latlons));
              }}
              edit={{ remove: false, edit: false }}
              draw={{
                  marker: false,
                  circlemarker: false,
                  circle: false,
                  rectangle: false,
                  polygon: true,
                  polyline: false
              }}
          />

          {todos.map(todo => (
            <Polygon
              key={todo.id}
              id={todo.id}
              positions={JSON.parse(todo.geometry)}
              onClick={() => {
                setActiveTodo(todo);
              }}
            />
          ))}

          {activeTodo && (
            <Popup
              position={[
                JSON.parse(activeTodo.geometry)[0][1],
                JSON.parse(activeTodo.geometry)[0][0],
              ]}
              onClose={() => {
                setActiveTodo(null);
              }}
            >
              <div>
                <h2>{activeTodo.name}</h2>
              </div>
            </Popup>
          )}
        </FeatureGroup>
      </Map>
      <div>
        <button onClick={addTodo}>Save changes</button>
        <br/>
        <input
          id="geometry"
          size="200"
          onChange={event => setInput('geometry', event.target.value)}
          value={activeTodo ? activeTodo.geometry : ""} 
          placeholder="Geometry"
          type="hidden"
        />
      </div>
    </>
  )
}

export default withAuthenticator(App)