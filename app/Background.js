import { Color, Mesh, Plane, Program } from 'ogl'

import fragment from 'shaders/background-fragment.glsl'
import vertex from 'shaders/background-vertex.glsl'

import { random } from 'utils/math'

export default class {
  constructor ({ gl, scene, viewport }) {
    this.gl = gl
    this.scene = scene
    this.viewport = viewport

    const geometry = new Plane(this.gl)
    const program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        uColor: { value: new Color('#c4c3b6') }
      },
      transparent: true
    })

    this.meshes = []

    for (let i = 0; i < 50; i++) {
      let mesh = new Mesh(this.gl, {
        geometry,
        program,
      })

      const scale = random(0.75, 1)

      mesh.scale.x = 1.6 * scale
      mesh.scale.y = 0.9 * scale

      mesh.speed = random(0.75, 1)

      mesh.xExtra = 0

      mesh.x = mesh.position.x = random(-this.viewport.width * 0.5, this.viewport.width * 0.5)
      mesh.y = mesh.position.y = random(-this.viewport.height * 0.5, this.viewport.height * 0.5)

      this.meshes.push(mesh)

      this.scene.addChild(mesh)
    }
  }

  update (scroll, direction) {
    this.meshes.forEach(mesh => {
      mesh.position.x = mesh.x - scroll.current * mesh.speed - mesh.xExtra

      const viewportOffset = this.viewport.width * 0.5
      const widthTotal = this.viewport.width + mesh.scale.x

      mesh.isBefore = mesh.position.x < -viewportOffset
      mesh.isAfter = mesh.position.x > viewportOffset

      if (direction === 'right' && mesh.isBefore) {
        mesh.xExtra -= widthTotal

        mesh.isBefore = false
        mesh.isAfter = false
      }

      if (direction === 'left' && mesh.isAfter) {
        mesh.xExtra += widthTotal

        mesh.isBefore = false
        mesh.isAfter = false
      }

      mesh.position.y += 0.05 * mesh.speed

      if (mesh.position.y > this.viewport.height * 0.5 + mesh.scale.y) {
        mesh.position.y -= this.viewport.height + mesh.scale.y
      }
    })
  }
}
