import React, { useEffect, useRef, Suspense, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Canvas, useFrame, useThree, useLoader } from 'react-three-fiber'
import Controls from "./3D/OrbitControls"
import Asset from "./3D/Asset"
import Plane from "./3D/Plane"
import Box from "./3D/Box"
import MODEL_URL from "./models/brit/brit_sitting_wall.gltf"
import './App.css';
/* eslint-disable */
  Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min)/(in_max - in_min) * (out_max-out_min) + out_min
}

const CAMERA_SPEED = 0.0001;
const CAMERA_MOVEMENT_OFFSET = 20;

function Camera(props) {
  const ref = useRef()
  const { setDefaultCamera, aspect } = useThree()
  // Make the camera known to the system
  useEffect(() => void setDefaultCamera(ref.current), [])
  // Update it every frame
  useFrame(() => {
    ref.current.updateMatrixWorld()
    ref.current.lookAt( [0, -1, -1] );
    // move camera
    if(props.assetsLoaded){
      // console.log(ref.current)
      // const {x,z} = cameraMovement(ref.current.position);
    const {x,y,z} = cameraMovementFar(ref.current.position);
    ref.current.position.x = x;
    ref.current.position.y = y;
    ref.current.position.z = z;
    props.setCameraPosition([x.toFixed(2),y.toFixed(2),z.toFixed(2)]);
    }
  })
  return <perspectiveCamera ref={ref} {...props} args={[45, aspect, 1,20000]}  />
}

function cameraMovement (position){
  let {x,y,z} = position;
  x = x * Math.cos(CAMERA_SPEED * 10) + z * Math.sin(CAMERA_SPEED * 10);
  z = z * Math.cos(CAMERA_SPEED * 10) - x * Math.sin(CAMERA_SPEED * 10);
  return {x,y,z}
}
function cameraMovementFar (position){
  let {x,y,z} = position;
  if(z >= 0.12 || x > 1 ) {
    // y -= ((Math.sin(CAMERA_MOVEMENT_OFFSET * CAMERA_SPEED)/20 ) - Math.cos( CAMERA_MOVEMENT_OFFSET * CAMERA_SPEED)/20)
    z =  z * Math.cos(CAMERA_MOVEMENT_OFFSET * CAMERA_SPEED) - z * Math.sin(CAMERA_MOVEMENT_OFFSET * CAMERA_SPEED)
    if( z <= 8) return cameraMovement({x,y,z})
  }
  //  else if (y >= -1.1){
  //   y -= (Math.cos( (z -1 ) * CAMERA_MOVEMENT_OFFSET * CAMERA_SPEED))
  // } 
  return {x, y, z}

}
const Light = props => {
  //Create a PointLight and turn on shadows for the light
  const light = new THREE.DirectionalLight(0xffffff,1, 100)
  props.position 
    ? light.position.set(...props.position)
    : light.position.set(-2, 3, 2)
  light.castShadow = props.castShadow // default false
  //Set up shadow properties for the light
  light.shadow.mapSize.width = 1024 // default
  light.shadow.mapSize.height = 1024 // default
  light.shadow.camera.near = 0.5 // default
  light.shadow.camera.far = 500 // default
  return <primitive object={light} />}

function App() {
  const [cameraPosition, setCameraPosition] = useState([0,0,7]);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        Sandbox
      </header>
      <div style={{textAlign:"left", color:"cornflowerblue", padding:10}}>
        Camera pos: {`${[...cameraPosition]}`}
      </div>
      <Canvas 
        className='canvas'
        shadowMap={true}>
        {/* <Camera position={[0,-3,7]} setCameraPosition={setCameraPosition}/> */}
        
        {/* rotate */}
        {/* <Camera position={[-1.1,0.44,7.6]} setCameraPosition={setCameraPosition} assetsLoaded={assetsLoaded} /> */}
        {/* far */}
        <Camera position={[0,-1.3,16000.6]} setCameraPosition={setCameraPosition} assetsLoaded={assetsLoaded} />
        
        <ambientLight intensity={0.4}  />
        {/* <spotLight position={[6,0, -1]} lookAt={[0,0,0]} castShadow={false} intensity={1} /> */}
        <Plane wireframe rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -2, 0]} />
        <Box receiveShadow castShadow position={[0, -1, 0]} scale={[2,2,2]} />
        <Suspense fallback={`<div>loading </div>`}>
          <Asset position={[0,-1.8,-0.82]} scale={[0.5,0.5,0.5]} url={MODEL_URL} setAssetsLoaded={setAssetsLoaded} />
        </Suspense>
        <Controls />
        <Light castShadow/>
        <Light position={[0, 1, -10]}/>
      </Canvas>
    </div>
  );
}

export default App;
