/**
 * Created by 丁月明 on 15/10/29.
 * 项目中常用到的shader(仅针对Threejs)
 */

this.dym = this.dym||{};

dym.shader2 = {

    /*---------------------------带贴图的粒子-------------------------------*/
    'point': {

        uniforms: {
            tDiffuse: {type: "t", value: null},
            color: {type: "c", value: new THREE.Color( 0xffffff )},
            opacity: {type: "f", value: 1.0}
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

                "gl_PointSize = size*( 600.0 / length( mvPosition.xyz ) );",

                "gl_Position = projectionMatrix * mvPosition;",
            "}"

        ].join("\n"),

        fragmentShader: [

            "uniform vec3 color;",

            "uniform float opacity;",

            "uniform sampler2D texture;",

            "uniform float fogNear;",

            "uniform float fogFar;",

            "varying vec3 vColor;",

            "varying float vOpacity;",

            "void main() {",

                "gl_FragColor = vec4( color * vColor, opacity*vOpacity );",

                "gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );",

                "float depth = gl_FragCoord.z / gl_FragCoord.w;",

                "const vec3 fogColor = vec3( 0.0 );",

                "float fogFactor = smoothstep( fogNear, fogFar, depth );",
                // mix按照比例s 混合color1,color2    (1-s)color1+ s*colro2  ,相当于渐变色
                "gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",

            "}"


        ].join("\n")

    },

    /*---------------------------自定义每个点的颜色及透明度-------------------------------*/

    'line':{

        uniforms: {
            color:    { type: "c", value: new THREE.Color( 0xffffff ) },
            opacity:  { type: "f", value: 1.0 }
        },

        vertexShader: [

            "attribute vec3 aColor;",

            "attribute float aOpacity;",

            "varying vec3 vColor;",

            "varying float vOpacity;",

            "void main() {",

                "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

                "vColor = aColor;",

                "vOpacity = aOpacity;",

                "gl_Position = projectionMatrix * mvPosition;",
            "}"

        ].join("\n"),

        fragmentShader: [

            "uniform vec3 color;",

            "uniform float opacity;",

            "varying vec3 vColor;",

            "varying float vOpacity;",

            "void main() {",

                "gl_FragColor = vec4( color * vColor, opacity*vOpacity );",

            "}"

        ].join("\n")

    }
};
