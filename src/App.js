/* src/App.js */
import React, { useEffect, useState } from 'react'

import { API, graphqlOperation } from 'aws-amplify'
import { createGeofence } from './graphql/mutations'
import { listGeofences } from './graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Map, Popup, FeatureGroup, Polygon, ImageOverlay } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import "./App.css";

const App = () => {
  const [formState, setFormState] = useState()
  const [geofences, setGeofences] = useState([])
  const [activeGeofence, setActiveGeofence] = useState(null);

  // data operations
  useEffect(() => {
    fetchGeofences()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchGeofences() {
    try {
      const geofenceData = await API.graphql(graphqlOperation(listGeofences))
      const geofences = geofenceData.data.listGeofences.items
      setGeofences(geofences)
    } catch (err) { console.log('error fetching geofences') }
  }

  return (
    <>
      <Map center={[1, 2]} zoom={9}>
        <ImageOverlay
          bounds={
            [
              [0, 0], 
              [2, 4]
            ]           
          }
          url="https://gmpbio.org/assets/uploads/misc-images/Untitled.png"
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
                const enteredName = prompt('Please enter the region name')
                const geofence = {name: enteredName, geometry: JSON.stringify(latlons)}
                API.graphql(graphqlOperation(createGeofence, {input: geofence}));
                setGeofences([...geofences, geofence])          
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

          {geofences.map(geofence => (
            <Polygon
              key={geofence.id}
              id={geofence.id}
              positions={JSON.parse(geofence.geometry)}
              onClick={() => {
                setActiveGeofence(geofence);
              }}
            />
          ))}

          {activeGeofence && (
            <Popup
              position={[
                JSON.parse(activeGeofence.geometry)[0][1],
                JSON.parse(activeGeofence.geometry)[0][0],
              ]}
              onClose={() => {
                setActiveGeofence(null);
              }}
            >
              <div>
                <h2>{activeGeofence.name}</h2>
              </div>
            </Popup>
          )}
        </FeatureGroup>
      </Map>
      <div>
        <input
          id="geometry"
          size="200"
          onChange={event => setInput('geometry', event.target.value)}
          value={activeGeofence ? activeGeofence.geometry : ""} 
          placeholder="Geometry"
          type="hidden"
        />
      </div>
    </>
  )
}

export default withAuthenticator(App)