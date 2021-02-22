import { Mesh, Program, Texture } from 'ogl'

import fragment from 'shaders/image-fragment.glsl'
import vertex from 'shaders/image-vertex.glsl'

import { map } from 'utils/math'

import Number from './Number'
import Title from './Title'

export default class {
  constructor ({ geometry, gl, image, index, length, renderer, scene, screen, text, viewport }) {
    this.extra = 0

    this.geometry = geometry
    this.gl = gl
    this.image = image
    this.index = index
    this.length = length
    this.renderer = renderer
    this.scene = scene
    this.screen = screen
    this.text = text
    this.viewport = viewport

    this.createShader()
    this.createMesh()
    this.createTitle()

    this.onResize()
  }

  createShader () {
    const texture = new Texture(this.gl, {
      generateMipmaps: false
    })

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      fragment,
      vertex,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uViewportSizes: { value: [this.viewport.width, this.viewport.height] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() }
      },
      transparent: true
    })

    const image = new Image()

    image.src = this.image
    image.onload = _ => {
      texture.image = image

      this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight]
    }
  }

  createMesh () {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.plane.setParent(this.scene)
  }

  createTitle () {
    this.number = new Number({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.index % (this.length / 2),
    })

    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
    })
  }

  update (scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra
    this.plane.position.y = Math.cos((this.plane.position.x / this.widthTotal) * Math.PI) * 75 - 74.5
    this.plane.rotation.z = map(this.plane.position.x, -this.widthTotal, this.widthTotal, Math.PI, -Math.PI)

    this.speed = scroll.current - scroll.last

    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed

    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width

    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal

      this.isBefore = false
      this.isAfter = false
    }

    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal

      this.isBefore = false
      this.isAfter = false
    }
  }

  /**
   * Events.
   */
  onResize ({ screen, viewport } = {}) {
    if (screen) {
      this.screen = screen
    }

    if (viewport) {
      this.viewport = viewport

      this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height]
    }

    this.scale = this.screen.height / 1500

    this.plane.scale.y = this.viewport.height * (900 * this.scale) / this.screen.height
    this.plane.scale.x = this.viewport.width * (700 * this.scale) / this.screen.width

    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]

    this.padding = 2

    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length

    this.x = this.width * this.index
  }
}
