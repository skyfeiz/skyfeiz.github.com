var shaders = {
	lineShader:{
		vertexShader:[
			'varying vec3 vPosition;',
			'void main(){',
				'vPosition = position;',
				'gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition,1.);',
			'}'
		].join(''),
		fragmentShader:[
			'uniform float t;',
			'uniform float w;',
			'uniform float speed;',
			'varying vec2 vUv;',
			'varying vec3 vPosition;',
			'float vP;',
			'float vT;',
			'void main(){',
				'vP = (vPosition.x/w+1.)/2.;',
				'vP = 1.-abs(vP-t);',
				'vT = max(vP*vP*vP*vP,0.1);',
				'gl_FragColor = vec4(vT,vT,vT,1.);',
			'}'
		].join('')
	},
	objShader:{
		vertexShader:[
			'varying vec2 vUv;',
			'varying vec3 vPosition;',
			'void main(){',
				'vUv = uv;',
				'vPosition = position;',
				'gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);',
			'}'
		].join(''),
		fragmentShader:[
			'uniform sampler2D texture;',
			'uniform float t;',
			'uniform float yMax;',
			'varying vec3 vPosition;',
			'varying vec2 vUv;',
			'float vP;',
			'float vT;',
			'void main(){',
				'vP = vPosition.y/yMax;',
				'vP = 1.-abs(vP-t);',
				'vT = vP*vP*vP;',
				'vec3 color = texture2D( texture, vUv ).rgb;',
				'gl_FragColor = vec4(vT);',
			'}'
		].join('')
	}
};