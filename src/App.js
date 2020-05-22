/* src/App.js */
import React, { useEffect, useState } from 'react'

import { API, graphqlOperation } from 'aws-amplify'
import { listTodos } from './graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Map, Popup, TileLayer, FeatureGroup, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import "./App.css";

const initialState = { name: '', desc: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

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

  const [activeTodo, setActiveTodo] = React.useState(null);

  return (
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
              console.log(e.layer.toGeoJSON());
            }}
            onEdited={e => {
                console.log(e);
                e.layers.eachLayer(a => {
                    console.log(a.toGeoJSON());
                });
            }}
            onDeleted={e => {
              console.log(e);
            }}            
            edit={{ remove: true }}
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
      </FeatureGroup>

      {activeTodo && (
        <Popup
          position={[
            activeTodo.lat,
            activeTodo.lon,
          ]}
          onClose={() => {
            setActiveTodo(null);
          }}
        >
          <div>
            <h2>{activeTodo.desc}</h2>
          </div>
        </Popup>
      )}            
    </Map>

  )
}

export default withAuthenticator(App)