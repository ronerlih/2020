import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import LineSegments from './LineSegments'

export default function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => ( mesh.current.rotation.y += 0.0015))

  return (
    <>
    <mesh
      ref={mesh}
      {...props}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <boxBufferGeometry 
      //  polygonOffset={true} 
       polygonOffsetFactor={1} 
       polygonOffsetUnits={1}
       attach="geometry" args={[1, 1, 1,5,5,5]} />
  
      <meshStandardMaterial attach="material" color={hovered ? 0x5959ff : 0x5959ff} emissive={0x5959ff} transparent opacity={props.noOpacity ? 0 : 0.4}  flatShading roughness={0} 
      side={THREE.DoubleSide}
       />
    </mesh>
    
    <LineSegments {...props} geometry={new THREE.BoxBufferGeometry(1,1,1,2,2,2)} castShadow {...props}/>
    {/* <LineSegments {...props} geometry={new THREE.BoxBufferGeometry(1,1,1,10,10,10)} color={0x009900} castShadow/> */}
    </>
  )
}