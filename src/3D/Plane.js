import React from 'react'
import * as THREE from 'three';

export default function Plane({ ...props }) {
   return (
      <>
      <mesh {...props} receiveShadow>
         <planeGeometry attach="geometry" args={[50,50,50,50]}  />
         <meshStandardMaterial attach="material" color="white" opacity={0.7}/>
      </mesh>
      { props.wireframe && 
      <mesh {...props} receiveShadow>
         <lineSegments>
            <wireframeGeometry attach="geometry" args={[new THREE.PlaneGeometry(50,50,50,50)]} />
            <meshBasicMaterial attach="material" color={0x009900} />
         </lineSegments> 
     </mesh> }
     </>
   )
 }
 