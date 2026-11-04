<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ name?: string }>()

const container = ref<HTMLDivElement | null>(null)
let renderer: any = null
let rafId = 0

onMounted(async () => {
  const el = container.value
  if (!el) return

  // 动态加载 three，避免在 SSR 阶段触碰浏览器 API
  const THREE = await import('three')

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    60,
    el.clientWidth / el.clientHeight,
    0.1,
    100,
  )
  camera.position.z = 4

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(el.clientWidth, el.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  el.appendChild(renderer.domElement)

  // 占位主体：一个旋转的线框二十面体（后续替换成真正的 3D 简历卡片/时间线）
  const geometry = new THREE.IcosahedronGeometry(1.4, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x4f8cff, wireframe: true })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // 粒子背景
  const starCount = 300
  const positions = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount * 3; i++) positions[i] = (Math.random() - 0.5) * 20
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03 })
  scene.add(new THREE.Points(starGeo, starMat))

  const tick = () => {
    mesh.rotation.x += 0.004
    mesh.rotation.y += 0.006
    renderer.render(scene, camera)
    rafId = requestAnimationFrame(tick)
  }
  tick()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  renderer?.dispose()
})
</script>

<template>
  <div ref="container" class="scene-container">
    <span class="scene-name">{{ props.name ?? 'skilitlab' }}</span>
  </div>
</template>

<style scoped>
.scene-container {
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 12px;
  overflow: hidden;
  background: radial-gradient(circle at center, #101828, #0b1120);
}
.scene-name {
  position: absolute;
  bottom: 12px;
  left: 16px;
  color: #fff;
  font-size: 14px;
  opacity: 0.8;
  pointer-events: none;
}
</style>
