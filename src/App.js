import React, { useEffect, useRef, Suspense } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Canvas, useFrame, useThree, useLoader } from 'react-three-fiber'
import Controls from "./3D/OrbitControls"
import Asset from "./3D/Asset"
import Plane from "./3D/Plane"
import Box from "./3D/Box"
import './App.css';

const CAMERA_SPEED = 0.0004;

function Camera(props) {
  const ref = useRef()
  const { setDefaultCamera } = useThree()
  // Make the camera known to the system
  useEffect(() => void setDefaultCamera(ref.current), [])
  // Update it every frame
  useFrame(() => {
    ref.current.updateMatrixWorld()
    const {x,z} = cameraMovement(ref.current.position);
    ref.current.position.x = x;
    ref.current.position.z = z;
  })
  return <perspectiveCamera ref={ref} {...props} />
}

function cameraMovement (position){
  let {x,z} = position;
  x = x * Math.cos(CAMERA_SPEED) + z * Math.sin(CAMERA_SPEED);
  z = z * Math.cos(CAMERA_SPEED) - x * Math.sin(CAMERA_SPEED);
  return {x,z}
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

  return (
    <div className="App">
      <header className="App-header">
        Sandbox
      </header>
      <Canvas 
        className='canvas'
        shadowMap={true}>
        <Camera position={[0,-3,7]} />
        <ambientLight intensity={0.4}  />
        {/* <spotLight position={[6,0, -1]} lookAt={[0,0,0]} castShadow={false} intensity={1} /> */}
        <Plane wireframe rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -2, 0]} />
        <Box receiveShadow castShadow position={[0, -1, 0]} scale={[2,2,2]} />
        <Suspense fallback={`<div>loading </div>`}>
          <Asset position={[0,-1.8,-0.82]} scale={[0.5,0.5,0.5]} url="/models/brit/brit_sitting_wall.gltf" />
        </Suspense>
        <Controls />
        <Light castShadow/>
        <Light position={[0, 1, -10]}/>
      </Canvas>
    </div>
  );
}

export default App;
