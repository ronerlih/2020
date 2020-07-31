import React, { useEffect, useRef, Suspense, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Canvas, useFrame, useThree, useUpdate } from 'react-three-fiber'
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
let CAMERA_SPEED_FAST = 0.0005;
const CAMERA_MOVEMENT_OFFSET = 20;
const GRID_COLOR = 0x00AD8D;
let FRAME_INDEX = 0;
let bufferArrayIndex = 0;

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
    if(FRAME_INDEX % 10 === 0){
      props.pathNodes[bufferArrayIndex] = x
      bufferArrayIndex++;
      props.pathNodes[bufferArrayIndex] = y
      bufferArrayIndex++;
      props.pathNodes[bufferArrayIndex] = z
      bufferArrayIndex++;
      
      props.setPathNodes(new Float32Array(props.pathNodes))
    }
    }
   
    // inc frame count
    FRAME_INDEX++;
  })
  return <perspectiveCamera ref={ref} {...props} args={[45, aspect, 1,20000]}  />
}

function rotateCamera (position, turn_thresh){
  let {x,y,z} = position;
  const OFFSET_CAMERA_TURN = 5;
  x = Math.sin(z.map(0,turn_thresh,0,Math.PI )) * - 0.8
  // x = x * Math.cos(CAMERA_SPEED * OFFSET_CAMERA_TURN) + z * Math.sin(CAMERA_SPEED * OFFSET_CAMERA_TURN);
  // z = z * Math.cos(CAMERA_SPEED * OFFSET_CAMERA_TURN) - x * Math.sin(CAMERA_SPEED * OFFSET_CAMERA_TURN);
  return {x,y,z}
}
function cameraMovementFar (position){
  const TURN_THRESH = 8.12;
  const Y_THRESH = -1.4;
  let {x,y,z} = position;
  if(z >= 0 ) {
    // shady practice ahead..

    // y -= ((Math.sin(CAMERA_MOVEMENT_OFFSET * CAMERA_SPEED)/20 ) - Math.cos( CAMERA_MOVEMENT_OFFSET * CAMERA_SPEED)/20)
    if(z > 400){
      z =  z * Math.cos(CAMERA_MOVEMENT_OFFSET * CAMERA_SPEED_FAST) - z * Math.sin( CAMERA_MOVEMENT_OFFSET * CAMERA_SPEED_FAST) 
      CAMERA_SPEED_FAST += CAMERA_SPEED_FAST * 0.001;
    }
    else{
      z =  z * Math.cos(CAMERA_MOVEMENT_OFFSET * CAMERA_SPEED) - z * Math.sin( CAMERA_MOVEMENT_OFFSET * CAMERA_SPEED) 
    }
    if( y > Y_THRESH) y = z.map(100,400,Y_THRESH,400)
    if( z <= TURN_THRESH) return rotateCamera({x,y,z}, TURN_THRESH)
  }
  if (z.toFixed(2) == 0){
    z = -0.01
  }
  //  else if (y >= -1.1){
  //   y -= (Math.cos( (z -1 ) * CAMERA_MOVEMENT_OFFSET * CAMERA_SPEED))
  // } 
  return {x, y, z}
}
const CameraPath = props => {

  const ref = useUpdate(geometry => {
    geometry.addAttribute('position', new THREE.BufferAttribute( props.pathNodes, 3 ) )
    geometry.attributes.position.needsUpdate = true
  }, [props.pathNodes])


  const interval = props.interval || 10;
  const positions = props.pathNodes;
  return(
    <points {...props} >
      <bufferGeometry attach="geometry" ref={ref} >
      {/* <bufferAttribute attachObject={['attributes', 'position']} count={positions.length / 3} array={positions} itemSize={3} /> */}
</bufferGeometry>
<pointsMaterial attach="material" size={1} sizeAttenuation={false} color={0x009900} />
  </points>
  )
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
  const [pathNodes, setPathNodes] = useState( new Float32Array(Array(1000).fill(100000.0)));

  return (
    <div className="App">
      <header className="App-header">
        Sandbox
      </header>
      <div style={{textAlign:"left", color:"cornflowerblue", padding:10}}>
        [log] camera pos: {`${[...cameraPosition]}`}
      </div>
      <div className="frame-edge">
      <div className="frame">
      <div className="canvas-container">
      <Canvas 
        className='canvas'
        shadowMap={true}>
        {/* <Camera position={[0,-3,7]} setCameraPosition={setCameraPosition}/> */}
        
        {/* rotate */}
        {/* <Camera position={[-1.1,0.44,7.6]} setCameraPosition={setCameraPosition} assetsLoaded={assetsLoaded} /> */}
        {/* far */}
        <Camera pathNodes={pathNodes} setPathNodes={setPathNodes} position={[0,1000.3,10000.6]} setCameraPosition={setCameraPosition} assetsLoaded={assetsLoaded} />
        {/* <CameraPath pathNodes={pathNodes} /> */}
        <ambientLight intensity={0.4}  />
        {/* <spotLight position={[6,0, -1]} lookAt={[0,0,0]} castShadow={false} intensity={1} /> */}
        <Plane name="Floor" color={GRID_COLOR} wireframe rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -2, 0]}  scale={[2,2,2]}/>
        <Box name="Box" color={GRID_COLOR} receiveShadow castShadow position={[0, -1.0001, 0]} scale={[2,2,2]} />
        <Suspense fallback={`<div>loading </div>`}>
          <Asset name="Brit" position={[0,-1.6,-0.771]} rotation={[0,0.1,0]} scale={[0.5,0.5,0.5]} url={MODEL_URL} setAssetsLoaded={setAssetsLoaded} />
        </Suspense>
        <Controls />
        <Light castShadow/>
        <Light position={[0, 1, -10]}/>
      </Canvas>
      </div>
      </div>
      </div>
      <div className="frame-title">to be determined.</div>
    </div>
  );
}

export default App;
