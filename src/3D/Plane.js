import React from 'react'
import * as THREE from 'three';

const FLOOR_WIDTH = 50
const FLOOR_HEIGHT = 50

export default function Plane(props) {
   return (
      <>
      <mesh {...props} receiveShadow>
         <planeGeometry attach="geometry" args={[FLOOR_WIDTH,FLOOR_HEIGHT,FLOOR_WIDTH,FLOOR_HEIGHT]}  />
         <meshStandardMaterial attach="material" color="white" opacity={0.7}/>
      </mesh>
      { props.wireframe && 
      <mesh {...props} receiveShadow>
         <lineSegments>
            <wireframeGeometry attach="geometry" args={[new THREE.PlaneGeometry(FLOOR_WIDTH,FLOOR_HEIGHT,FLOOR_WIDTH,FLOOR_HEIGHT)]} />
            <meshBasicMaterial attach="material" color={props.color} />
         </lineSegments> 
     </mesh> }
     </>
   )
 }
 