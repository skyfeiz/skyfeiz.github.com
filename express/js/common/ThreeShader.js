dym.shader = {
    'line': {
        uniforms: {
            tDiffuse: {type: "t", value: null},
            color:    {type: "c", value: new THREE.Color( 0xffffff )},
            opacity:  {type: "f", value: 1.0}
        },

        vertexShader: [
            "attribute float size;",
            "attribute vec3 aColor;",
            "attribute float aOpacity;",
            "varying vec3 vColor;",
            "varying float vOpacity;",

            "void main() {",
                "vColor = aColor;",
                "vOpacity = aOpacity;",
                "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
                "gl_PointSize = size;",
                "// gl_PointSize = size * ( 300.0 / length( mvPosition.xyz ) );",
                "gl_Position = projectionMatrix * mvPosition;",
            "}"
        ].join("\n"),

        fragmentShader: [
            "uniform vec3 color;",
            "uniform float opacity;",
            "uniform sampler2D texture;",
            "varying vec3 vColor;",
            "varying float vOpacity;",

            "void main() {",
                "float uOpacity = texture2D( texture, gl_PointCoord ).a;",
                "gl_FragColor = vec4( color * vColor, 1. );",
            "}"
        ].join("\n")
    },

    'point': {
        uniforms: {
            tDiffuse: {type: "t", value: null},
            color:    {type: "c", value: new THREE.Color( 0xffffff )},
            opacity:  {type: "f", value: 1.0}
        },

        vertexShader: [
            "attribute float size;",
            "attribute vec3 aColor;",
            "attribute float aOpacity;",
            "varying vec3 vColor;",
            "varying float vOpacity;",

            "void main() {",
                "vColor = aColor;",
                "vOpacity = aOpacity;",
                "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
                "gl_PointSize = size;",
                "// gl_PointSize = size * ( 300.0 / length( mvPosition.xyz ) );",
                "gl_Position = projectionMatrix * mvPosition;",
            "}"
        ].join("\n"),

        fragmentShader: [
            "uniform vec3 color;",
            "uniform float opacity;",
            "uniform sampler2D texture;",
            "varying vec3 vColor;",
            "varying float vOpacity;",

            "void main() {",
                "gl_FragColor = vec4( color * vColor, opacity * vOpacity );",
                "// gl_FragColor = vec4( color * vColor, 1.0 );",
                "gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );",
            "}"
        ].join("\n")
    },

    'column':{
        uniforms: {
            color:   { type: "c", value: new THREE.Color(0xffffff) },
            opacity: { type: "f", value: 1 }
        },
        vertexShader: [
            "attribute vec3 aColor;",
            "attribute float aOpacity;",
            "varying vec3 vColor;",
            "varying float vOpacity;",
            "varying vec2 vUV;",
            "varying vec3 N;",

            "void main() {",
                "vUV = uv;",
                "N = normal * normalMatrix;",
                "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
                "vColor = aColor;",
                "vOpacity = aOpacity;",
                "gl_Position = projectionMatrix * mvPosition;",
            "}"
        ].join("\n"),

        fragmentShader: [
            "uniform vec3 color;",
            "uniform float opacity;",
            "uniform sampler2D textureMap;",
            "uniform float fogNear;",
            "uniform float fogFar;",
            "uniform vec3 fogColor;",
            "varying vec3 vColor;",
            "varying float vOpacity;",
            "varying vec2 vUV;",
            "varying vec3 N;",

            "void main() {",
                /*"gl_FragColor = vec4( color * vColor, opacity * vOpacity );",*/
                "float a = texture2D( textureMap, vUV ).a * ( 0.2 + 0.8 * max( dot( N, normalize( vec3( -1., 0., 2. ) ) ), 0. ) );",
                "gl_FragColor = vec4( color * texture2D( textureMap, vUV ).rgb, a );",

                "float depth = gl_FragCoord.z / gl_FragCoord.w;",
                "float fogFactor = smoothstep( fogNear, fogFar, depth );",
                "gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",
            "}"
        ].join("\n")
    }
};

