/** True when the browser can create a WebGL context (WebGL2 preferred, WebGL1 accepted). */
export function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")
    const ok = Boolean(context)
    ;(context as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext()
    return ok
  } catch {
    return false
  }
}
