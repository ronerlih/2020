import React, { useRef } from 'react'
import { extend, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from '../THREE/_/jsm/controls/OrbitControls'

extend({ OrbitControls })

export default function Controls() {
  const controls = useRef()
  const { scene, camera, gl } = useThree()
  useFrame(() => controls.current.update())
  return (
    <orbitControls ref={controls} args={[camera, gl.domElement]} enableDamping dampingFactor={0.1} rotateSpeed={0.5} target={[0,-1.6,-1]}/>
  )
}
