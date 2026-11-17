'use client'

import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/* Ixtiyoriy: o'zingizning tayyor 3D avataringiz (.glb).
   site.ts → avatar.modelUrl berilganda protsedura o'yinchi o'rniga shu yuklanadi.
   Model avtomatik ravishda 1.83 m bo'yga keltiriladi va yerga qo'yiladi. */
export default function ModelAvatar({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const model = useMemo(() => scene.clone(true), [scene])

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const s = 1.83 / (size.y || 1)
    const center = box.getCenter(new THREE.Vector3())
    return { scale: s, offset: new THREE.Vector3(-center.x * s, -box.min.y * s, -center.z * s) }
  }, [model])

  useEffect(() => () => useGLTF.clear(url), [url])

  return <primitive object={model} scale={scale} position={offset} />
}
