import React from 'react'
import { useLoader } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Asset( {url, position,scale, setAssetsLoaded }) {
  const gltf = useLoader(GLTFLoader, url)
  gltf.scene.children[0].material.emissive.set(0x5C5C5C)
  gltf.scene.children[0].receiveShadow = true;
  gltf.scene.children[0].castShadow = true;
  setAssetsLoaded(true)
  return <primitive 
      object={gltf.scene} 
      dispose={null} 
      scale={scale}
      position={position}
      castShadow
      receiveShadow
      emissive={0x69686A}
      />
}
