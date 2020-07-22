import React from 'react'
import * as THREE from 'three';

export default function LineSegments({ ...props }) {
   
   return (
      <lineSegments {...props}>
         <wireframeGeometry attach="geometry" args={[ props.geometry || new THREE.PlaneGeometry(50,50,50,50)]} />
         <lineBasicMaterial attach="material" color={props.color || 0x009900} />
      </lineSegments> 
   )
 }
 