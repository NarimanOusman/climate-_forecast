
// Shaders
const vertexShader = `
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);

  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;

  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) {
    return baseColor;
  }

  vec3 gradientColor;
  
  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);

    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];
    
    gradientColor = mix(c1, c2, f);
  }
  
  return gradientColor * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend, int waveType, float bendRadius, float bendStrength, float bendInfluence, float iTime, float animationSpeed) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius); // radial falloff around cursor
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);

  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }
  
  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      
      // wave(uv, offset, screenUv, mouseUv, shouldBend, waveType, ...)
      // We essentially just need to call the wave logic. The original shader had wave() taking args.
      // I refactored wave() to take uniforms as args because they are accessible in global scope in Fragment shader?
      // actually, in GLSL, uniforms are global. I added extra args to wave function signature above which is wrong for GLSL.
      // Let's fix the shader string for GLSL carefully.
    }
  }
  // WAIT, the provided fragment shader accessed uniforms directly in wave() or was concise.
  // The provided snippet had:
  // float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) { ... }
  // And it accessed 'iTime', 'animationSpeed', 'bendRadius', 'bendStrength', 'bendInfluence' directly.
  // YES, uniforms are global in GLSL. I should not have changed the signature in my JS string copy above.
  // I will correct this in the actual string below.
}
`;


// Let's rewrite the shader string properly to match the React code exactly
const fragmentShaderSource = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);

  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;

  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) {
    return baseColor;
  }

  vec3 gradientColor;
  
  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);

    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];
    
    gradientColor = mix(c1, c2, f);
  }
  
  return gradientColor * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius); // radial falloff around cursor
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);

  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }
  
  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.1;
    }
  }

  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

function hexToVec3(hex) {
    let value = hex.trim();
    if (value.startsWith('#')) {
        value = value.slice(1);
    }
    let r = 255;
    let g = 255;
    let b = 255;
    if (value.length === 3) {
        r = parseInt(value[0] + value[0], 16);
        g = parseInt(value[1] + value[1], 16);
        b = parseInt(value[2] + value[2], 16);
    } else if (value.length === 6) {
        r = parseInt(value.slice(0, 2), 16);
        g = parseInt(value.slice(2, 4), 16);
        b = parseInt(value.slice(4, 6), 16);
    }
    return new THREE.Vector3(r / 255, g / 255, b / 255);
}

class FloatingLines {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            linesGradient: options.linesGradient || [],
            enabledWaves: options.enabledWaves || ['top', 'middle', 'bottom'],
            lineCount: options.lineCount || [6],
            lineDistance: options.lineDistance || [5],
            topWavePosition: options.topWavePosition,
            middleWavePosition: options.middleWavePosition,
            bottomWavePosition: options.bottomWavePosition || { x: 2.0, y: -0.7, rotate: -1 },
            animationSpeed: options.animationSpeed || 1,
            interactive: options.interactive !== undefined ? options.interactive : true,
            bendRadius: options.bendRadius || 5.0,
            bendStrength: options.bendStrength || -0.5,
            mouseDamping: options.mouseDamping || 0.05,
            parallax: options.parallax !== undefined ? options.parallax : true,
            parallaxStrength: options.parallaxStrength || 0.2,
        };

        this.init();
    }

    init() {
        const {
            linesGradient, enabledWaves, lineCount, lineDistance,
            topWavePosition, middleWavePosition, bottomWavePosition,
            animationSpeed, interactive, bendRadius, bendStrength,
            mouseDamping, parallax, parallaxStrength
        } = this.options;

        const getLineCount = (waveType) => {
            if (typeof lineCount === 'number') return lineCount;
            if (!enabledWaves.includes(waveType)) return 0;
            const index = enabledWaves.indexOf(waveType);
            return lineCount[index] ?? 6;
        };

        const getLineDistance = (waveType) => {
            if (typeof lineDistance === 'number') return lineDistance;
            if (!enabledWaves.includes(waveType)) return 0.1;
            const index = enabledWaves.indexOf(waveType);
            return lineDistance[index] ?? 0.1;
        };

        const topLineCountVal = enabledWaves.includes('top') ? getLineCount('top') : 0;
        const middleLineCountVal = enabledWaves.includes('middle') ? getLineCount('middle') : 0;
        const bottomLineCountVal = enabledWaves.includes('bottom') ? getLineCount('bottom') : 0;

        const topLineDistanceVal = enabledWaves.includes('top') ? getLineDistance('top') * 0.01 : 0.01;
        const middleLineDistanceVal = enabledWaves.includes('middle') ? getLineDistance('middle') * 0.01 : 0.01;
        const bottomLineDistanceVal = enabledWaves.includes('bottom') ? getLineDistance('bottom') * 0.01 : 0.01;

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.camera.position.z = 1;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.container.appendChild(this.renderer.domElement);

        this.uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector3(1, 1, 1) },
            animationSpeed: { value: animationSpeed },

            enableTop: { value: enabledWaves.includes('top') },
            enableMiddle: { value: enabledWaves.includes('middle') },
            enableBottom: { value: enabledWaves.includes('bottom') },

            topLineCount: { value: topLineCountVal },
            middleLineCount: { value: middleLineCountVal },
            bottomLineCount: { value: bottomLineCountVal },

            topLineDistance: { value: topLineDistanceVal },
            middleLineDistance: { value: middleLineDistanceVal },
            bottomLineDistance: { value: bottomLineDistanceVal },

            topWavePosition: {
                value: new THREE.Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4)
            },
            middleWavePosition: {
                value: new THREE.Vector3(
                    middleWavePosition?.x ?? 5.0,
                    middleWavePosition?.y ?? 0.0,
                    middleWavePosition?.rotate ?? 0.2
                )
            },
            bottomWavePosition: {
                value: new THREE.Vector3(
                    bottomWavePosition?.x ?? 2.0,
                    bottomWavePosition?.y ?? -0.7,
                    bottomWavePosition?.rotate ?? 0.4
                )
            },

            iMouse: { value: new THREE.Vector2(-1000, -1000) },
            interactive: { value: interactive },
            bendRadius: { value: bendRadius },
            bendStrength: { value: bendStrength },
            bendInfluence: { value: 0 },

            parallax: { value: parallax },
            parallaxStrength: { value: parallaxStrength },
            parallaxOffset: { value: new THREE.Vector2(0, 0) },

            lineGradient: {
                value: Array.from({ length: 8 }, () => new THREE.Vector3(1, 1, 1))
            },
            lineGradientCount: { value: 0 }
        };

        if (linesGradient && linesGradient.length > 0) {
            const stops = linesGradient.slice(0, 8);
            this.uniforms.lineGradientCount.value = stops.length;
            stops.forEach((hex, i) => {
                const color = hexToVec3(hex);
                this.uniforms.lineGradient.value[i].set(color.x, color.y, color.z);
            });
        }

        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShaderSource
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        this.clock = new THREE.Clock();

        // Mouse interaction state
        this.targetMouse = new THREE.Vector2(-1000, -1000);
        this.currentMouse = new THREE.Vector2(-1000, -1000);
        this.targetInfluence = 0;
        this.currentInfluence = 0;
        this.targetParallax = new THREE.Vector2(0, 0);
        this.currentParallax = new THREE.Vector2(0, 0);
        this.mouseDamping = mouseDamping;
        this.parallax = parallax;
        this.parallaxStrength = parallaxStrength;

        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());

        if (interactive) {
            this.renderer.domElement.addEventListener('pointermove', (e) => this.handlePointerMove(e));
            this.renderer.domElement.addEventListener('pointerleave', () => this.handlePointerLeave());
        }

        this.animate();
    }

    handleResize() {
        const width = this.container.clientWidth || 1;
        const height = this.container.clientHeight || 1;
        this.renderer.setSize(width, height, false);
        this.uniforms.iResolution.value.set(this.renderer.domElement.width, this.renderer.domElement.height, 1);
    }

    handlePointerMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const dpr = this.renderer.getPixelRatio();

        this.targetMouse.set(x * dpr, (rect.height - y) * dpr);
        this.targetInfluence = 1.0;

        if (this.parallax) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const offsetX = (x - centerX) / rect.width;
            const offsetY = -(y - centerY) / rect.height;
            this.targetParallax.set(offsetX * this.parallaxStrength, offsetY * this.parallaxStrength);
        }
    }

    handlePointerLeave() {
        this.targetInfluence = 0.0;
    }

    animate() {
        this.rafId = requestAnimationFrame(() => this.animate());

        this.uniforms.iTime.value = this.clock.getElapsedTime();

        if (this.options.interactive) {
            this.currentMouse.lerp(this.targetMouse, this.mouseDamping);
            this.uniforms.iMouse.value.copy(this.currentMouse);

            this.currentInfluence += (this.targetInfluence - this.currentInfluence) * this.mouseDamping;
            this.uniforms.bendInfluence.value = this.currentInfluence;
        }

        if (this.parallax) {
            this.currentParallax.lerp(this.targetParallax, this.mouseDamping);
            this.uniforms.parallaxOffset.value.copy(this.currentParallax);
        }

        this.renderer.render(this.scene, this.camera);
    }
}
