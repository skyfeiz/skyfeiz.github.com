/* globals Exhibition,dym,THREE,Linear,Power2 */
this.Exhibition = this.Exhibition || {};

(function() {

	var Earth = function() {
		dym.ThreeBase.call(this, document.getElementById('container3d'));
		this.init();
	};

	var p = Earth.prototype = Object.create(dym.ThreeBase.prototype);
    Earth.prototype.constructor = Earth;

    p.init = function() {
        this.canOrbit = false;
        this.earthR = 260;
        // this.offX = -0.012;
        // this.offY = -0.002;
        this.offX = 0;
        this.offY = 0;
        this.init2();
        var array = [
            {id: 'spark', type: 'texture', url: 'image/spark.png'},
            {id: 'china', type: 'texture', url: 'image/earth/china.png'},
            {id: 'earth', type: 'texture', url: 'image/earth/world.png'},
            {id: 'bgSpark', type: 'texture', url: 'image/earth/spark.png'},
            // {id: 'm2', type: 'texture', url: 'image/earth/m2.png'},
            // {id: 'normal', type: 'texture', url: 'image/earth/normal.jpg'},
            {id: 'ringLight', type: 'texture', url: 'image/earth/ringLight.png'},
            // {id: 'blueLight', type: 'texture', url: 'image/earth/blueLight.png'},
            // {id: 'yellowLight', type: 'texture', url: 'image/earth/yellowLight.png'},
            {id: 'dotLight', type: 'texture', url: 'image/earth/dotLight.png'},
            {id: 'pointCir0', type: 'texture', url: 'image/pointCir.png'},
            {id: 'pointCir1', type: 'texture', url: 'image/pointCir1.png'}
        ];
        this.threeBaseInit(array);
    };

    p.init2 = function() {
        var cur = this;
        this.cityNameAry = [];
        this.cityItemAry = [];
        this.lineData = {
            links:[
                {"start": "北京", "end": "哈尔滨"},
                {"start": "北京", "end": "长春"},
                {"start": "北京", "end": "沈阳"},
                {"start": "北京", "end": "天津"},
                {"start": "北京", "end": "石家庄"},
                {"start": "北京", "end": "太原"},
                {"start": "北京", "end": "呼和浩特"},
                {"start": "北京", "end": "济南"},
                {"start": "北京", "end": "银川"},
                {"start": "北京", "end": "西安"},
                {"start": "北京", "end": "郑州"},
                {"start": "北京", "end": "乌鲁木齐"},
                {"start": "上海", "end": "济南"},
                {"start": "上海", "end": "石家庄"},
                {"start": "上海", "end": "南京"},
                {"start": "上海", "end": "合肥"},
                {"start": "上海", "end": "合肥"},
                {"start": "上海", "end": "郑州"},
                {"start": "上海", "end": "武汉"},
                {"start": "上海", "end": "南昌"},
                {"start": "上海", "end": "杭州"},
                {"start": "上海", "end": "福州"},
                {"start": "上海", "end": "长沙"},
                {"start": "上海", "end": "台北"},
                {"start": "武汉", "end": "郑州"},
                {"start": "武汉", "end": "西安"},
                {"start": "武汉", "end": "合肥"},
                {"start": "武汉", "end": "南京"},
                {"start": "武汉", "end": "杭州"},
                {"start": "武汉", "end": "福州"},
                {"start": "武汉", "end": "广州"},
                {"start": "武汉", "end": "长沙"},
                {"start": "武汉", "end": "重庆"},
                {"start": "武汉", "end": "兰州"},
                {"start": "武汉", "end": "贵阳"},
                {"start": "广州", "end": "南昌"},
                {"start": "广州", "end": "贵阳"},
                {"start": "广州", "end": "郑州"},
                {"start": "广州", "end": "成都"},
                {"start": "广州", "end": "昆明"},
                {"start": "广州", "end": "海口"},
                {"start": "广州", "end": "南宁"},
                {"start": "广州", "end": "重庆"},
                {"start": "广州", "end": "福州"},
                {"start": "广州", "end": "杭州"},
                {"start": "广州", "end": "台北"},
                {"start": "广州", "end": "澳门"},
                {"start": "广州", "end": "香港"},
                {"start": "成都", "end": "拉萨"},
                {"start": "成都", "end": "西宁"},
                {"start": "成都", "end": "乌鲁木齐"},
                {"start": "成都", "end": "兰州"},
                {"start": "成都", "end": "西安"},
                {"start": "成都", "end": "重庆"},
                {"start": "成都", "end": "贵阳"},
                {"start": "成都", "end": "南宁"},
                {"start": "成都", "end": "长沙"},
                {"start": "成都", "end": "昆明"}
            ],
            points:[
                {"name": "乌鲁木齐", "E": 87.564988, "N": 43.84038,"offsetX":0,"offsetY":40},
                {"name": "拉萨", "E": 91.111891, "N": 29.662557,"offsetX":0,"offsetY":40},
                {"name": "西宁", "E": 101.767921, "N": 36.640739,"offsetX":0,"offsetY":40},
                {"name": "昆明", "E": 102.714601, "N": 24.882,"offsetX":0,"offsetY":-40},
                {"name": "兰州", "E": 103.823305, "N": 36.064226,"offsetX":0,"offsetY":40},
                {"name": "成都", "E": 104.0648, "N": 30.57,"offsetX":0,"offsetY":85,"ind":1},
                {"name": "银川", "E": 106.206479, "N": 38.502621,"offsetX":0,"offsetY":40},
                {"name": "重庆", "E": 106.55, "N": 29.5647,"offsetX":60,"offsetY":0},
                {"name": "贵阳", "E": 106.709177, "N": 26.629907,"offsetX":0,"offsetY":-40},
                {"name": "南宁", "E": 108.297234, "N": 22.806493,"offsetX":0,"offsetY":40},
                {"name": "西安", "E": 108.939, "N": 34.342,"offsetX":0,"offsetY":40},
                {"name": "海口", "E": 110.330802, "N": 20.022071  - 0.5,"offsetX":0,"offsetY":-40},
                {"name": "呼和浩特", "E": 111.660351, "N": 40.828319,"offsetX":0,"offsetY":40},
                {"name": "太原", "E": 112.550864, "N": 37.890277,"offsetX":0,"offsetY":40},
                {"name": "长沙", "E": 112.979353, "N": 28.213478,"offsetX":0,"offsetY":40},
                {"name": "广州", "E": 113.30765, "N": 23.120049,"offsetX":0,"offsetY":85,"ind":1},
                {"name": "澳门", "E": 113.02, "N": 22.2,"offsetX":0,"offsetY":-40},
                {"name": "郑州", "E": 113.649644, "N": 34.75661,"offsetX":0,"offsetY":40},
                {"name": "香港", "E": 114.10000, "N": 22.2 + 0.2,"offsetX":0,"offsetY":-40},
                {"name": "武汉", "E": 114.3162, "N": 30.581084,"offsetX":0,"offsetY":85,"ind":1},
                {"name": "石家庄", "E": 114.522082, "N": 38.048958,"offsetX":0,"offsetY":-40},
                {"name": "南昌", "E": 115.893528, "N": 28.689578,"offsetX":0,"offsetY":-40},
                {"name": "北京", "E": 116.395645, "N": 39.929986,"offsetX":0,"offsetY":85,"ind":1},
                {"name": "济南", "E": 117.024967, "N": 36.682785,"offsetX":0,"offsetY":40},
                {"name": "天津", "E": 117.210813, "N": 39.14393,"offsetX":60,"offsetY":0},
                {"name": "合肥", "E": 117.282699, "N": 31.866942,"offsetX":0,"offsetY":40},
                {"name": "南京", "E": 118.778074, "N": 32.057236,"offsetX":0,"offsetY":40},
                {"name": "福州", "E": 119.330221, "N": 26.047125,"offsetX":0,"offsetY":-40},
                {"name": "杭州", "E": 120.219375, "N": 30.259244,"offsetX":0,"offsetY":40},
                {"name": "上海", "E": 121.4788, "N": 31.2303,"offsetX":0,"offsetY":85,"ind":1},
                {"name": "台北", "E": 121.5365 , "N": 25.0192 - 0.5,"offsetX":0,"offsetY":-40},
                {"name": "沈阳", "E": 123.432791, "N": 41.808645,"offsetX":60,"offsetY":0},
                {"name": "长春", "E": 125.3222, "N": 43.816,"offsetX":60,"offsetY":0},
                {"name": "哈尔滨", "E": 126.657717, "N": 45.7732,"offsetX":0,"offsetY":40}
            ].map(function(item){
                var pos = cur.lglt2xyz(item.E-90,item.N,cur.earthR);
                item.x = pos.x;
                item.y = pos.y;
                item.z = pos.z;
                return item;
            })
        };
    };

    p.initObject3D = function() {
        this.container = new THREE.Object3D();
        this.container.scale.set(0, 0, 0);
        this.scene.add(this.container);

        this.earthContainer = new THREE.Object3D();
        this.earthContainer.rotation.x = 0.5;
        this.earthContainer.rotation.y = Math.PI;
        this.earthContainer.rotation.z = 0;
        this.container.add(this.earthContainer);

        this.createLight();
        this.createEarth();
        this.createLine();
        this.createAroundLine();
        this.createEarthLine();
        this.createTxt();
        // this.createRingParticles();

        this.createParticleMaterial();
        this.createAroundLineParticles();
        this.startAroundLineParticles();
        this.createBgParticles();

        this.startRender();

        this.scale = 1;
        this.mapContainer = new THREE.Object3D();
        this.earthContainer.add(this.mapContainer);
        this.mapContainer.rotation.x = this.offX;
        this.mapContainer.rotation.y = this.offY;
        this.parseData();
        this.initMap();
        this.createLinkLine();
        this.createLineParticles();
        this.creatCity();
    };

    p.reset3D = function() {
    };

    p.renderFun = function() {
        this.aroundLineParticlesRender();
        this.bgParticleRender();
        if (this.bOk) {
        }
        this.lineParticlesRender();
        // this.ringParticlesRender();
    };
    
    p.startRender = function () {
        var cur = this;
        this.bOk = true;
        if (this.earthContainer) {
            TweenMax.to(this.earthContainer.rotation, 3, {
                // x: 0.5,
                y: -0.05,
                // z: -0.1,
                ease: Power2.easeInOut,
                onComplete:function(){
                    $(document).click(function(){
                        if (cur.bOk) {
                            cur.toChina();
                            cur.bOk = false;
                        }
                    });
                }
            });
        }
        if (this.container) {
            TweenMax.to(this.container.scale, 3, {
                x: 1,
                y: 1,
                z: 1,
                ease: Power2.easeInOut
            });
        }
        if (this.txtLine) {
            TweenMax.to(this.txtLine.scale, 1, {
                x: 1,
                y: 1,
                z: 1,
                delay: 1.8,
                ease: Power2.easeInOut,
                onComplete: function () {
                    cur.txtLinePoint.material.opacity = 1;
                }
            });
        }
        if (this.txtArr) {
            this.txtArr.map(function (item, index) {
                TweenMax.to(item.position, 0.8, {
                    x: item.userData['x'],
                    delay: index * 0.3 + 2.7,
                    ease: Linear.easeNone,
                    onStartParams: [item],
                    onStart: function (temp) {
                        TweenMax.to(temp.material, 0.8, {
                            opacity: 1,
                            ease: Linear.easeNone
                        });
                    }
                });
            });
        }
        if (this.numItem) {
            this.numPer = 0;
            TweenMax.to(this, 3, {
                numPer: 1,
                delay: 2.7,
                ease: Linear.easeNone,
                onUpdate: function () {
                    var num = Math.round(10312756 + (16416832 - 10312756) * cur.numPer);
                    var numStr = num.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');

                    cur.numItem['context'].clearRect(0, 0, 400, 64);
                    cur.numItem['context'].fillText(numStr, 150, 36);
                    cur.numItem['material'].map.needsUpdate = true;
                }
            })
        }
        if (this.aroundLineArr) {
            this.aroundLineArr.map(function (line) {
                TweenMax.to(line.material, 0.6, {
                    opacity: 0.2,
                    delay: 2,
                    ease: Linear.easeNone
                });
            });
        }
        if (this.lineArr) {
            this.lineArr.map(function (line, index) {
                TweenMax.to(line.scale, 0.4, {
                    x: 1,
                    y: 1,
                    z: 1,
                    delay: index * 0.1 + 2,
                    ease: Power2.easeInOut,
                    onCompleteParams: [index],
                    onComplete: function (i) {
                        cur.linePointArr[i].material.opacity = 1;
                    }
                });
            });
        }
    };

    //--------------------------------------------------------------------
    
    p.createParticleMaterial = function () {
        this.lineParticleMaterial = new THREE.ShaderMaterial({

            uniforms: {
                color:    {type: "c", value: new THREE.Color(0xffffff)},
                opacity:  {type: "f", value: 1},
                texture:  {type: "t", value: this.resourcesMap['spark'].result}
            },
            vertexShader:   dym.shader.line.vertexShader,
            fragmentShader: dym.shader.line.fragmentShader,
            // blending:       THREE.AdditiveBlending,
            // depthTest:      false,
            transparent:    true
        });

        this.bgParticleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color:    {type: "c", value: new THREE.Color(0xffffff)},
                opacity:  {type: "f", value: 1},
                texture:  {type: "t", value: this.resourcesMap['bgSpark'].result}
            },
            vertexShader:   dym.shader.point.vertexShader,
            fragmentShader: dym.shader.point.fragmentShader,
            blending:       THREE.AdditiveBlending,
            // depthTest:      false,
            transparent:    true
        });

        var texture = this.resourcesMap["spark"].result;
        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: {type: "c", value: new THREE.Color(0xffffff)},
                opacity: {type: "f", value: 1},
                texture: {type: "t", value: texture},
                fogColor: {type: "c", value: this.scene.fog.color},
                fogNear: {type: "f", value: 0.0/*this.scene.fog.near*/},
                fogFar: {type: "f", value: 100.0/*this.scene.fog.far*/}
            },
            vertexShader: dym.shader2.point.vertexShader,
            fragmentShader: dym.shader2.point.fragmentShader,
            // blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            fog: true
        });
    };

    //--------------------------------- 创建光照 -----------------------------------

    p.createLight = function () {
        // 左上
        var directionalLight = new THREE.DirectionalLight(0x1b99e9, 0.6);
        directionalLight.position.x = -this.earthR * 3;
        directionalLight.position.y = this.earthR * 2;
        directionalLight.position.z = 0;
        directionalLight.position.normalize();
        this.scene.add(directionalLight);
        // 右上
        var directionalLight = new THREE.DirectionalLight(0xff0000, 0.9);
        directionalLight.position.x = this.earthR;
        directionalLight.position.y = this.earthR;
        directionalLight.position.z = 0;
        directionalLight.position.normalize();
        this.scene.add(directionalLight);
        // 左下
        var directionalLight = new THREE.DirectionalLight(0x204ab7, 0.5);
        directionalLight.position.x = -this.earthR * 3;
        directionalLight.position.y = -this.earthR;
        directionalLight.position.z = this.earthR * 2;
        directionalLight.position.normalize();
        this.scene.add(directionalLight);
        // 右下
        var directionalLight = new THREE.DirectionalLight(0x0000ff, 0.1);
        directionalLight.position.x = this.earthR * 2;
        directionalLight.position.y = -this.earthR;
        directionalLight.position.z = this.earthR;
        directionalLight.position.normalize();
        this.scene.add(directionalLight);
        // 正前方
        var directionalLight = new THREE.DirectionalLight(0xfef4bd, 0.5);
        directionalLight.position.x = 0;
        directionalLight.position.y = this.earthR / 2;
        directionalLight.position.z = this.earthR * 2;
        directionalLight.position.normalize();
        this.scene.add(directionalLight);
    };

    //--------------------------------- 创建地球 -----------------------------------
    
    p.createEarth = function () {
        var geometry = new THREE.SphereGeometry(this.earthR, 40, 40, 180 * Math.PI / 180);
        // var material = new THREE.MeshBasicMaterial({
        //     map: this.resourcesMap['earth'].result,
        //     wireframe: false,
        //     // transparent: true
        // });
        var material = new THREE.MeshStandardMaterial({
            // color: 0x2064a8,
            map: this.resourcesMap['earth']['result'],
            roughness: 1,
            metalness: 0,
            // normalMap: this.resourcesMap['normal']['result'],
            // normalScale: new THREE.Vector2(1, 0.3),
            transparent: true,
            // depthTest: false
        });
        this.earth = new THREE.Mesh(geometry, material);
        // this.container.rotation.y = Math.PI;
        // this.container.rotation.x = 0.5;
        // this.container.rotation.z = -0.1;
        // this.container.add(this.earth);
        this.earthContainer.add(this.earth);

        this.createEarthLight();
    };
    p.createEarthLight = function () {
        var g = new THREE.PlaneBufferGeometry(this.earthR * 3.1, this.earthR * 3.1);
        // var m = new THREE.MeshBasicMaterial({
        //     map: this.resourcesMap['ringLight']['result'],
        //     transparent: true,
        //     depthTest: false
        // });
        var m = new THREE.MeshStandardMaterial({
            map: this.resourcesMap['ringLight']['result'],
            roughness: 1,
            metalness: 0,
            transparent: true,
            depthTest: false
        });
        this.ringLight = new THREE.Mesh(g, m);
        this.ringLight.position.set(-3, -3, 0);
        this.container.add(this.ringLight);

        // var g = new THREE.PlaneBufferGeometry(512, 512);
        // var m = new THREE.MeshBasicMaterial({
        //     map: this.resourcesMap['dotLight']['result'],
        //     transparent: true,
        //     depthTest: false
        // });
        // this.dotLight1 = new THREE.Mesh(g, m);
        // // this.dotLight1.scale.set(0.5, 0.3, 0);
        // this.dotLight1.rotation.z = 0.4;
        // this.dotLight1.position.set(this.earthR - 205, this.earthR - 85, 0);
        // this.container.add(this.dotLight1);
        var g = new THREE.PlaneBufferGeometry(512, 512);
        var m = new THREE.MeshBasicMaterial({
            map: this.resourcesMap['dotLight']['result'],
            transparent: true,
            depthTest: false
        });
        this.dotLight1 = new THREE.Mesh(g, m);
        this.dotLight1.scale.set(0.5, 0.3, 0);
        this.dotLight1.rotation.z = -0.5;
        this.dotLight1.position.set(this.earthR - 135, this.earthR - 20, 3);
        this.container.add(this.dotLight1);
    };
    p.createEarthLine = function () {
        var geometry = new THREE.SphereBufferGeometry(this.earthR, 40, 40, 180 * Math.PI / 180);
        var material1 = new THREE.MeshBasicMaterial({
            color: 0x107df0,
            transparent: true,
            opacity: 1,
            wireframe: true,
        });
        var material = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: this.resourcesMap['earth']['result'] },
                color: { value: new THREE.Color(0x2a71c0) }
            },
            transparent: true,
            vertexShader: [
                "varying vec2 vUV;",
                "varying vec3 N;",

                "void main() {",
                "vUV = uv;",
                    "N = normal * normalMatrix;",
                    "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
                    "gl_Position = projectionMatrix * mvPosition;",
                "}"
            ].join("\n"),

            fragmentShader: [
                "uniform vec3 color;",
                "uniform sampler2D map;",
                "varying vec2 vUV;",
                "varying vec3 N;",

                "void main() {",
                    "float a = texture2D( map, vUV ).a;",
                    "float b = max( 0., dot( N, vec3( 0., 0., 1. ) ) );",
                    "gl_FragColor = vec4( color, (1. - a) * 0.4 );",
                "}"
            ].join("\n")
        });
        this.earthLine = new THREE.Line(geometry, material);
        // this.container.add(this.earthLine);
        this.earthContainer.add(this.earthLine);
    };

    //--------------------------------------------------------------------
    
    p.lngLatToSphere = function (lng, lat, r) {
        var theta = (180 - lng) * Math.PI / 180;
        var phi = (90 - lat) * Math.PI / 180;

        var posX = r * Math.sin(phi) * Math.cos(theta);
        var posY = r * Math.cos(phi);
        var posZ = r * Math.sin(phi) * Math.sin(theta);
        return new THREE.Vector3(posX, posY, posZ);
    };

    //--------------------------------- 创建圆环粒子 -----------------------------------

    // p.createRingParticles = function () {
    //     var m = new THREE.ShaderMaterial({
    //         uniforms: {
    //             color:    {type: "c", value: new THREE.Color(0xffffff)},
    //             opacity:  {type: "f", value: 1},
    //             texture:  {type: "t", value: this.resourcesMap['spark'].result}
    //         },
    //         vertexShader: [
    //             "attribute float aOpacity;",
    //             "varying float vOpacity;",
    //
    //             "void main() {",
    //                 "vOpacity = aOpacity;",
    //                 "gl_PointSize = 1.;",
    //                 "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    //             "}"
    //         ].join("\n"),
    //
    //         fragmentShader: [
    //             "uniform vec3 color;",
    //             "uniform float opacity;",
    //             "uniform sampler2D texture;",
    //             "varying float vOpacity;",
    //
    //             "void main() {",
    //                 "gl_FragColor = vec4( color, opacity * vOpacity );",
    //                 "gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );",
    //             "}"
    //         ].join("\n"),
    //         blending:       THREE.AdditiveBlending,
    //         // depthTest:      false,
    //         transparent:    true
    //     });
    //
    //     var g = new THREE.RingBufferGeometry(1, 50, 128, 32);
    //     var positionArr = g.attributes.position.array;
    //     var opacityArr = new Float32Array(positionArr.length / 3);
    //
    //     for (var i = 0; i < 33; i++) {
    //         for (var j = 0; j < 129; j++) {
    //             opacityArr[i * 129 + j] = (i / 33) * 0.2;
    //         }
    //     }
    //
    //     g.addAttribute('aOpacity', new THREE.BufferAttribute(opacityArr, 1));
    //     this.circle = new THREE.Points(g, m);
    //     this.circle.userData['r'] = 0;
    //     this.container.add(this.circle);
    //
    //     this.test = 0;
    // }
    // p.ringParticlesRender = function () {
    //     var positionArr = this.circle.geometry.attributes.position.array;
    //     var opacityArr = new Float32Array(positionArr.length / 3);
    //
    //     this.circle.userData['r'] += 4;
    //     if (this.circle.userData['r'] > 50) this.circle.userData['r'] = 0
    //
    //     for (var i = 0; i < 33; i++) {
    //         for (var j = 0; j < 129; j++) {
    //             opacityArr[i * 129 + j] = 0.9 * (1 - Math.abs(this.circle.userData['r'] - 33) / 100);
    //         }
    //     }
    //     this.circle.geometry.attributes.aOpacity.needsUpdate = true;
    // }

    //--------------------------------- 创建显示文本 -----------------------------------

    p.createTxt = function () {
        this.txtArr = [];
        var container = new THREE.Object3D();
        container.position.set(this.earthR - 50, 120, this.earthR);
        this.container.add(container);

        var obj = this.createTxtMaterial(400, 64, 0, 22, 'left', false, '#ffffff');
        obj['context'].clearRect(0, 0, 400, 64);
        obj['context'].fillText('订单总量', 200, 32);
        obj['material'].map.needsUpdate = true;
        var g = new THREE.PlaneBufferGeometry(400, 64);
        var titleItem = new THREE.Mesh(g, obj['material']);
        titleItem.position.x = -50;
        titleItem.userData['x'] = 0;
        container.add(titleItem);
        this.txtArr.push(titleItem);

        var obj = this.createTxtMaterial(400, 64, 0, 36, 'left', true, '#ffffff');
        obj['context'].clearRect(0, 0, 400, 64);
        obj['context'].fillText('13,312,756', 150, 36);
        obj['material'].map.needsUpdate = true;
        var g = new THREE.PlaneBufferGeometry(400, 64);
        var numItem = new THREE.Mesh(g, obj['material']);
        numItem.position.x = -50;
        numItem.position.y = -35;
        numItem.userData['x'] = 42;
        container.add(numItem);
        this.txtArr.push(numItem);
        this.numItem = obj;

        var today = new Date(), startDate = today.getDate() - 2, endDate = today.getDate() - 1;
        var obj = this.createTxtMaterial(400, 64, 0, 14, 'left', false, '#6edfff');
        obj['context'].clearRect(0, 0, 400, 64);
        obj['context'].fillText('2017.11.' + startDate + '-2017.11.' + endDate, 150, 32);
        obj['material'].map.needsUpdate = true;
        var g = new THREE.PlaneBufferGeometry(400, 64);
        var dateItem = new THREE.Mesh(g, obj['material']);
        dateItem.position.x = -50;
        dateItem.position.y = -65;
        dateItem.userData['x'] = 50;
        container.add(dateItem);
        this.txtArr.push(dateItem);

        var pointInfo = {"lng":108.46,"lat":-4.07};
        var point1 = this.lngLatToSphere(pointInfo.lng, pointInfo.lat, this.earthR);
        var point2 = new THREE.Vector3(container.position.x - 10, container.position.y, container.position.z);
        var startP = new THREE.Vector3(0, 0, 0);
        var endP = new THREE.Vector3(point2.x - point1.x, point2.y - point1.y, point2.z - point1.z);
        var g = new THREE.Geometry();
        g.vertices.push(startP);
        g.vertices.push(endP);
        var m = new THREE.LineBasicMaterial({
            color: 0xff1414,
            lineWidth: 0.5,
            transparent: true,
            opacity: 0.5
        });
        this.txtLine = new THREE.Line(g, m);
        this.txtLine.position.set(point1.x, point1.y, point1.z);
        this.txtLine.scale.set(0, 0, 0);
        this.container.add(this.txtLine);
        // 线段末端的小点
        g = new THREE.Geometry();
        g.vertices.push(endP);
        m = new THREE.PointsMaterial({
            color: 0xff1414,
            size: 4,
            transparent: true,
            opacity: 0
        });
        this.txtLinePoint = new THREE.Points(g, m);
        this.txtLinePoint.position.set(point1.x, point1.y, point1.z);
        this.container.add(this.txtLinePoint);
    };

    //--------------------------------- 创建放射线 -----------------------------------

    p.createLine = function () {
        this.lineArr = [];
        this.linePointArr = [];

        var cur = this;
        var arr = [
            {"lng":-169.0559369761356,"lat":12.828594432334327,"r":447.4483313019495},
            {"lng":145.9092713997644,"lat":16.821849719027853,"r":586.606161101495},
            {"lng":-149.0924917892608,"lat":-30.66977447703515,"r":640.3850978684785},
            {"lng":50.08547516661577,"lat":36.480388556632036,"r":453.4946202674991},
            {"lng":12.10938799529552,"lat":-55.320595272216224,"r":500.5365841948952},
            {"lng":-138.4844088090413,"lat":50.34564217909372,"r":600.7617469076512},
            {"lng":40.8320806200813,"lat":-37.99608911751325,"r":392.18398993807506},
            {"lng":100.93998579180226,"lat":-70.670695261115895,"r":563.0497611320055},
            {"lng":18.089642544913545,"lat":23.823045420660208,"r":510.4006069608261},
            {"lng":30.43329644547389,"lat":16.446621242394016,"r":590.4534420713061},
            {"lng":70.71242921773512,"lat":64.4275965740988,"r":499.7451097680112},
            {"lng":-4.261678448605551,"lat":-15.160273897547796,"r":640.0721698687252},
            {"lng":-180.720434576782196,"lat":-70.09345066705876,"r":532.7408722413492},
            {"lng":6.761505861342101,"lat":-33.836756636446445,"r":530.9934858507011},
            {"lng":150.32646409188987,"lat":-25.014193882121873,"r":552.2521776847976},
            {"lng":-150.2707140767036,"lat":-40.932931727557246,"r":624.4945744885393}
        ];

        arr.map(function (item) {
            var point1 = cur.lngLatToSphere(item.lng, item.lat, cur.earthR);
            var point2 = cur.lngLatToSphere(item.lng, item.lat, item.r);

            var startP = new THREE.Vector3(0, 0, 0);
            var endP = new THREE.Vector3(point2.x - point1.x, point2.y - point1.y, point2.z - point1.z)

            var g = new THREE.Geometry();
            g.vertices.push(startP);
            g.vertices.push(endP);
            var m = new THREE.LineBasicMaterial({
                color: 0xff1414,
                lineWidth: 0.5,
                transparent: true,
                opacity: 0.5
            });
            var line = new THREE.Line(g, m);
            line.position.set(point1.x, point1.y, point1.z);
            line.scale.set(0, 0, 0);
            cur.container.add(line);
            cur.lineArr.push(line);


            g = new THREE.Geometry();
            g.vertices.push(endP);
            m = new THREE.PointsMaterial({
                color: 0xff1414,
                size: 4,
                transparent: true,
                opacity: 0
            });
            var point = new THREE.Points(g, m);
            point.position.set(point1.x, point1.y, point1.z);
            cur.container.add(point);
            cur.linePointArr.push(point);
        });

        // var arr = [];
        // for (var i = 0; i < 16; i++) {
        //     var lng = Math.random() * 360 - 180;
        //     var lat = Math.random() * 140 - 70;
        //     var r = (1.5 + Math.random()) * this.earthR;
        //
        //     var startP = this.lngLatToSphere(lng, lat, this.earthR);
        //     var endP = this.lngLatToSphere(lng, lat, r);
        //
        //     var g = new THREE.Geometry();
        //     g.vertices.push(startP, endP);
        //
        //     var m = new THREE.LineBasicMaterial({
        //         color: 0xff1414,
        //         lineWidth: 0.5,
        //         transparent: true,
        //         opacity: 0.5
        //     });
        //
        //     this.container.add(new THREE.Line(g, m));
        //
        //     var obj = {lng: lng, lat: lat, r: r};
        //     arr.push(obj);
        // }
        //
        // console.log(JSON.stringify(arr));
    };

    //--------------------------------- 创建环绕线 -----------------------------------

    p.createAroundLine = function () {
        this.aroundLineArr = [];
        for (var i = 0; i < 3; i++) {
            var container = new THREE.Object3D();
            container.rotation.z = Math.PI / 2;
            this.container.add(container);

            if (i == 0) {
                var offsetR = 80;
                container.rotation.x = -Math.PI / 2.5;
            } else if (i == 1) {
                offsetR = 90;
                container.rotation.x = -1.2;
                container.rotation.y = 0.5;
            } else if (i == 2) {
                offsetR = 160;
                container.rotation.x = -1.2;
                container.rotation.y = -0.5;
            } else if (i == 3) {
                offsetR = 40;
            }

            var shape = new THREE.Shape();
            shape.arc(0, 0, this.earthR + offsetR, 0, 2 * Math.PI);

            var g = shape.createPointsGeometry(32);
            var m = new THREE.LineBasicMaterial({
                color: 0x448dda,
                linewidth: 2,
                transparent: true,
                opacity: 0
            });
            var line = new THREE.Line(g, m);
            container.add(line);

            this.aroundLineArr.push(line);
            line.userData['curve'] = shape;
            line.userData['container'] = container;
        }
    };

    //--------------------------------- 创建环绕线上的粒子 -----------------------------------
    
    p.createAroundLineParticles = function () {
        var cur = this;
        cur.aroundLineParticlesArr = [];
        var array = cur.aroundLineArr;
        array.map(function(aroundLine, index) {
            var item = cur.createAroundLineParticlesItem(aroundLine, index / array.length);
            aroundLine.userData['container'].add(item);
            item.userData['cirV'] = 0;
            item.userData['opacity'] = 0;
            cur.aroundLineParticlesArr.push(item);

            var item = cur.createAroundLineParticlesItem(aroundLine, index / array.length);
            aroundLine.userData['container'].add(item);
            item.userData['cirV'] = 0;
            item.userData['opacity'] = 0;
            cur.aroundLineParticlesArr.push(item);
        });
    };
    p.createAroundLineParticlesItem = function (aroundLine, n) {
        var curve = aroundLine.userData['curve'];
        var particleNum = Math.ceil(curve.getLength());
        var positionArray = new Float32Array(particleNum * 3);
        var colorArray = new Float32Array(particleNum * 3);
        var opacityArray = new Float32Array(particleNum);
        var sizeArray = new Float32Array(particleNum);
        var perArray = new Float32Array(particleNum);
        var color = new THREE.Color(0x89ffff);

        var i = particleNum;
        var i3 = i * 3;
        while (i3 > 0) {
            i--;
            i3 -= 3;

            opacityArray[i] = 0;
            color.toArray(colorArray, i * 3);

            var t = (i / particleNum) * 0.08;
            perArray[i] = t;

            sizeArray[i] = 60 * t;
            var v = curve.getPoint(t);
            positionArray[i3] = v.x;
            positionArray[i3 + 1] = v.y;
            positionArray[i3 + 2] = 0;
        }

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positionArray, 3));
        geometry.addAttribute('aColor', new THREE.BufferAttribute(colorArray, 3));
        geometry.addAttribute('aOpacity', new THREE.BufferAttribute(opacityArray, 1));
        geometry.addAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
        geometry.addAttribute('per', new THREE.BufferAttribute(perArray, 1));

        var particles = new THREE.Points(geometry, this.lineParticleMaterial);
        geometry.attributes.position.needsUpdate = true;
        particles.userData['curve'] = curve;
        return particles;
    };

    //-------------------------------- 渲染环绕线上的粒子 ------------------------------------
    
    p.aroundLineParticlesRender = function () {
        var cur = this;
        if (cur.aroundLineParticlesArr) {
            cur.aroundLineParticlesArr.map(function(item, index) {
                if (item.stop) {return;}
                cur.aroundLineParticlesItemRender(item);
            });
        }
    };
    p.aroundLineParticlesItemRender = function (item) {
        var curve = item.userData['curve'];
        var cirV = item.userData['cirV'];

        var positionArray = item.geometry.attributes.position.array;
        var sizeArray = item.geometry.attributes.size.array;
        // var opacityArray = item.geometry.attributes.aOpacity.array;
        var perArray = item.geometry.attributes.per.array;
        var particleNum = sizeArray.length;

        var index = 0;
        var i = particleNum;
        var i3 = i * 3;
        while (i3 > 0) {
            i--;
            i3 -= 3;

            index += 0.00005;

            perArray[i] += cirV;
            // if (perArray[i] > 1) perArray[i] = 0;
            perArray[i] %= 1;
            var t = perArray[i];
            var v = curve.getPoint(t - index);

            // opacityArray[i] = item.userData['opacity'] * t;
            positionArray[i3] = v.x;
            positionArray[i3 + 1] = v.y;
            positionArray[i3 + 2] = 0;
        }
        item.geometry.attributes.position.needsUpdate = true;
        // item.geometry.attributes.aOpacity.needsUpdate = true;
        item.geometry.attributes.size.needsUpdate = true;
    };

    //-------------------------------- 环绕线上粒子的入场 ------------------------------------
    
    p.startAroundLineParticles = function () {
        var cur = this;
        if (this.aroundLineParticlesArr) {
            for (var i = 0; i < this.aroundLineParticlesArr.length; i += 2) {
                var item = this.aroundLineParticlesArr[i];
                TweenMax.to(item.userData, 0.5, {
                    opacity: 1,
                    delay: i * (1 + Math.random()),
                    onStartParams: [item, i],
                    onStart: function(obj, index) {
                        obj.userData['cirV'] = 0.003;


                        var nextItem = cur.aroundLineParticlesArr[index + 1];
                        TweenMax.to(nextItem.userData, 0.5, {
                            opacity: 1,
                            delay: 3,
                            onStartScope: nextItem,
                            onStart: function() {
                                this.userData['cirV'] = 0.003;
                            }
                        });
                    }
                });
            }
        }
    };

    //------------------------------ 创建背景粒子 ---------------------------

    p.createBgParticles = function() {
        var particleNum = 600;
        var positionArr = new Float32Array(particleNum * 3);
        var vYArr = new Float32Array(particleNum);
        var colorArr = new Float32Array(particleNum * 3);
        var opacityArr = new Float32Array(particleNum);
        var sizeArr = new Float32Array(particleNum);

        var color = new THREE.Color(0xebcc68);

        var i = particleNum;
        var i3 = i * 3;
        while (i3 > 0) {
            i--;
            i3 -= 3;

            positionArr[i3] = 3000 * (Math.random() - 0.5);
            positionArr[i3 + 1] = 1500 * (Math.random() - 0.5);
            positionArr[i3 + 2] = -10000 * (Math.random() - 0.5);

            vYArr[i] = 3 * Math.random() + 5;
            opacityArr[i] = 0.5 + 0.5 * Math.random();
            sizeArr[i] = 20 * Math.random() + 2;
            // var angle = (Math.atan2(positionArr[i3], positionArr[i3 + 1]) + 2 * Math.PI) % (2 * Math.PI);
            // if (angle > 120 * (Math.PI / 180) && angle < 240 * (Math.PI / 180)) {
            //     color = new THREE.Color(0x710488);
            // }
            color.toArray(colorArr, i * 3);
        }
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positionArr, 3));
        geometry.addAttribute('vY', new THREE.BufferAttribute(vYArr, 1));
        geometry.addAttribute('aColor', new THREE.BufferAttribute(colorArr, 3));
        geometry.addAttribute('aOpacity', new THREE.BufferAttribute(opacityArr, 1));
        geometry.addAttribute('size', new THREE.BufferAttribute(sizeArr, 1));

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.aOpacity.needsUpdate = true;

        this.bgParticle = new THREE.Points(geometry, this.bgParticleMaterial);
        this.scene.add(this.bgParticle);
    };
    p.bgParticleRender = function() {
        var positionArr = this.bgParticle.geometry.attributes.position.array;
        var vYArr = this.bgParticle.geometry.attributes.vY.array;
        var opacityArr = this.bgParticle.geometry.attributes.aOpacity.array;
        var colorArr = this.bgParticle.geometry.attributes.aColor.array;

        var i = vYArr.length;
        var i3 = i * 3;
        while (i3 > 0) {
            i--;
            i3 -= 3;

            positionArr[i3 + 2] += vYArr[i];
            if (positionArr[i3 + 2] > 1000) {
                positionArr[i3 + 2] = -6000;
            }
        }
        this.bgParticle.geometry.attributes.position.needsUpdate = true;
        this.bgParticle.geometry.attributes.aOpacity.needsUpdate = true;
        this.bgParticle.geometry.attributes.aColor.needsUpdate = true;
        this.bgParticle.geometry.attributes.size.needsUpdate = true;
    };

    //--------------------------------------------------------------------------

    p.createTxtMaterial = function (width, height, opacity, fontSize, textAlign, shadowFlag, fillStyle) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        context.textAlign = textAlign;
        context.font = 'normal ' + fontSize + 'px Arial';
        context.fillStyle = fillStyle;
        context.fillText('0', 0, 0);

        if (shadowFlag) {
            context.shadowColor = 'rgba(7, 151, 218, 0.6)';
            context.shadowBlur = 10;
        }

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var material = new THREE.MeshBasicMaterial({map: texture, opacity: opacity, side: THREE.DoubleSide, transparent: true, depthTest: false});
        var obj = {'material': material, 'context': context};
        return obj;
    };

    /*skyz*/

    p.initMap = function(){
        var geometry = new THREE.SphereGeometry(this.earthR, 40, 40,Math.PI);
        var material = new THREE.MeshStandardMaterial({
            map: this.resourcesMap['china'].result,
            // color:0x286aaa,
            roughness: 1,
            metalness: 0,
            wireframe: false,
            transparent: true,
            depthTest:false,
            opacity:0
        });
        this.china = new THREE.Mesh(geometry, material);
        this.china.rotation.x = this.offX;
        this.china.rotation.y = this.offY;
        this.earthContainer.add(this.china); 
    };

    p.appear = function(t) {
        this.chinaAppear(0);
        this.cityAppear(t/2+0.5);
        this.linkLineAppear(t/2+1);
        this.lineParticlesStart(t/2+1.5);
    };

    p.chinaAppear = function(delayTime) {
        TweenMax.to(this.china.material, 0.5,
        {
            delay: delayTime + Math.random() * 0.5,
            opacity: 0.5
            /*ease: Back.easeOut.config(1.2)*/
        });
    };

    p.cityAppear = function(delayTime) {
        var itemAry = this.cityItemAry;
        for (var i = 0; i < itemAry.length; i++) {
            var cityItem = itemAry[i];
            TweenMax.to(cityItem.material, 0.5,
                {
                    delay: delayTime + Math.random() * 0.5,
                    opacity: 1
                    /*ease: Back.easeOut.config(1.2)*/
                });
        }

        var nameAry = this.cityNameAry;
        for (var i = 0; i < nameAry.length; i++) {
            var cityItem = nameAry[i];
            TweenMax.to(cityItem.material, 0.5,
                {
                    delay: delayTime + Math.random() * 0.5,
                    opacity: 1
                    /*ease: Back.easeOut.config(1.2)*/
                });
        }

    };

    p.linkLineAppear = function (delayTime) {
        var ary = this.linkLineAry;
        for (var i = 0; i < ary.length; i++) {
            var cityItem = ary[i];
            TweenMax.to(cityItem.material, 0.5,
                {
                    delay: delayTime + Math.random() * 0.5,
                    opacity: 1
                    /*ease: Back.easeOut.config(1.2)*/
                });
        }
    };

    p.creatCity = function() {
        var points = this.lineData.points;
        var cityGroup = new THREE.Object3D();
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var cityItem = this.createCityItem(p.ind);
            cityItem.position.x = p.x* this.scale;
            cityItem.position.y = p.y * this.scale;
            cityItem.position.z = p.z * this.scale;
            cityItem.lookAt(new THREE.Vector3(p.x,p.y,p.z).multiplyScalar(1000));
            var nameItem = this.drawCityName(p.name,p.offsetX,p.offsetY);
            nameItem.position.x = p.x* this.scale;
            nameItem.position.y = p.y * this.scale;
            nameItem.position.z = p.z * this.scale;
            nameItem.lookAt(new THREE.Vector3(p.x,p.y,p.z).multiplyScalar(1000));
            // nameItem.rotation.y = Math.PI;
            this.cityItemAry.push(cityItem);
            this.cityNameAry.push(nameItem);
            cityGroup.add(cityItem);
            cityGroup.add(nameItem);
        }
        cityGroup.rotation.x = this.offX;
        cityGroup.rotation.y = this.offY;
        this.earthContainer.add(cityGroup);
    };

    p.createCityItem = function (ind) {
        var ind = ind || 0;
        var texture = this.resourcesMap["pointCir"+ind].result;
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            opacity: 0,
            transparent: true,
            depthTest: false
        });
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry(w, h);
        // geometry.lookAt(new THREE.Vector3(0,0,0));
        var pointCir = new THREE.Mesh(geometry, material);
        //pointCir.position.z = 10;
        // pointCir.renderOrder = 10;
        pointCir.scale.set(0.2, 0.2, 1);
        return pointCir;
    };

    p.drawCityName = function(name,x,y) {
        var W = 12*4 + 10 + Math.abs(x);
        var H = 20 + Math.abs(y);
        var oCanvas = document.createElement('canvas');
        oCanvas.width = W;
        oCanvas.height = H;
        var ctx = oCanvas.getContext('2d');
        ctx.textAlign = 'center';
        ctx.textBaseline="middle";
        ctx.font="normal 12px Microsoft";
        ctx.fillStyle = '#67f5ff';
        ctx.fillText(name,W/2 + x/2,H/2 - y/2);

        var texture = new THREE.Texture(oCanvas);
        texture.needsUpdate = true;

        var g = new THREE.PlaneGeometry(W, H);

        var material = new THREE.MeshBasicMaterial({
            map: texture,
            opacity: 0,
            transparent: true,
            depthTest: false,
        });

        var m = new THREE.Mesh(g,material);
        m.scale.set(0.2,0.2,1);
        return m;
    };

    p.degToRad = function(deg) {
        return deg/180*Math.PI;
    };

    /**
     * 经纬度转xyz
     * @param longitude 经度
     * @param latitude 纬度
     * @param radius 半径
     */
    p.lglt2xyz = function(longitude,latitude,radius){
        var lg = this.degToRad(longitude) , lt = this.degToRad(latitude);
        var y = radius * Math.sin(lt);
        var temp = radius * Math.cos(lt);
        var x = temp * Math.sin(lg);
        var z = temp * Math.cos(lg);
        return {x:x , y:y ,z:z};
    };

    p.parseData = function () {
        var pointMap = {};
        var ary = this.lineData.points;
        for (var i = 0; i < ary.length; i++) {
            var key = ary[i]["name"];
            pointMap[key] = ary[i];
        }
        this.lineData.pointMap = pointMap;
    };

    /*---------------------------------------------- 3d连线上的粒子 -------------------------------------*/
    p.createLineParticles = function () {
        this.lineParticlesAry = [];
        var ary = this.linkLineAry;
        for (var i = 0; i < ary.length; i++) {
            var lineParticlesItem = this.createLineParticlesItem(ary[i], i / ary.length);
            this.mapContainer.add(lineParticlesItem);
            lineParticlesItem.userData["cirV"] = 0;
            lineParticlesItem.userData["opacity"] = 0;
            this.lineParticlesAry.push(lineParticlesItem);
        }
    };

    p.createLineParticlesItem = function (linkLine, n) {
        var curve = linkLine.userData["curve"];
        var particleNum = Math.ceil(curve.getLength());
        var positionAry = new Float32Array(particleNum * 3);
        var startPosAry = new Float32Array(particleNum * 3);
        var endPosAry = new Float32Array(particleNum * 3);
        var colorAry = new Float32Array(particleNum * 3);
        var opacityAry = new Float32Array(particleNum);
        var sizeAry = new Float32Array(particleNum);
        var color = new THREE.Color(0xFFFFFF);
        var perAry = new Float32Array(particleNum);
        // color.setHSL(n * 0.2, 1, 0.5);
        //
        var i = particleNum;
        var i3 = positionAry.length;
        while (i3 > 0) {
            i--;
            i3 -= 3;
            //
            var t = (i / particleNum) * 0.2;
            opacityAry[i] = 0;
            // if(t<0.2) t = Math.max(t-0.1,0);
            sizeAry[i] = 10 * window.devicePixelRatio * t;

            color.toArray(colorAry, i * 3);
            //
            var v = curve.getPoint(t);
            perAry[i] = t;
            positionAry[i3] = v.x;
            positionAry[i3 + 1] = v.y;
            positionAry[i3 + 2] = v.z;
        }

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positionAry, 3));
        geometry.addAttribute('startPos', new THREE.BufferAttribute(startPosAry, 3));
        geometry.addAttribute('endPos', new THREE.BufferAttribute(endPosAry, 3));
        geometry.addAttribute('aColor', new THREE.BufferAttribute(colorAry, 3));
        geometry.addAttribute('aOpacity', new THREE.BufferAttribute(opacityAry, 1));
        geometry.addAttribute('size', new THREE.BufferAttribute(sizeAry, 1));
        geometry.addAttribute('per', new THREE.BufferAttribute(perAry, 1));
        //
        var particles = new THREE.Points(geometry, this.particleMaterial);
        geometry.attributes.position.needsUpdate = true;
        particles.userData["curve"] = curve;
        return particles;
    };

    p.lineParticlesRender = function () {
        if (this.lineParticlesAry) {
            var ary = this.lineParticlesAry;
            for (var i = 0; i < ary.length; i++) {
                this.lineParticlesItemRender(ary[i]);
            }
        }
    };

    p.lineParticlesItemRender = function (lineParticlesItem) {
        var curve = lineParticlesItem.userData["curve"];
        var cirV = lineParticlesItem.userData["cirV"];

        var positionAry = lineParticlesItem.geometry.attributes.position.array;
        var sizeAry = lineParticlesItem.geometry.attributes.size.array;
        var opacityAry = lineParticlesItem.geometry.attributes.aOpacity.array;
        var perAry = lineParticlesItem.geometry.attributes.per.array;
        var particleNum = sizeAry.length;
        var i = particleNum;
        var i3 = i * 3;
        while (i3 > 0) {
            i--;
            i3 -= 3;
            //
            perAry[i] += cirV;
            // if (perAry[i] > 1) perAry[i] = 0;
            perAry[i] %= 1;
            var t = perAry[i];
            var v = curve.getPoint(t);
            //
            opacityAry[i] = lineParticlesItem.userData["opacity"] * t;
            //sizeAry[i] = 15*webInfo.scale*window.devicePixelRatio*t;
            positionAry[i3] = v.x;
            positionAry[i3 + 1] = v.y;
            positionAry[i3 + 2] = v.z;
        }
        lineParticlesItem.geometry.attributes.position.needsUpdate = true;
        lineParticlesItem.geometry.attributes.aOpacity.needsUpdate = true;
        lineParticlesItem.geometry.attributes.size.needsUpdate = true;
    };

    p.lineParticlesStart = function (delayTime) {
        if (this.lineParticlesAry) {
            var ary = this.lineParticlesAry;
            for (var i = 0; i < ary.length; i++) {
                var lineParticlesItem = ary[i];
                TweenMax.to(lineParticlesItem.userData, 0.5, {
                    opacity: 1,
                    delay: i * 0.2 + delayTime,
                    onStartScope: lineParticlesItem,
                    onStart: function () {
                        this.userData["cirV"] = 0.015;
                    }
                });
            }
        }
    };

    p.createLinkLine = function () {
        this.linkLineAry = [];
        var ary = this.lineData.links;
        for (var i = 0; i < ary.length; i++) {
            var startPoint = this.lineData.pointMap[ary[i].start];
            var endPoint = this.lineData.pointMap[ary[i].end];
            var linkLine = this.createLineItem(startPoint, endPoint);
            this.mapContainer.add(linkLine);
            this.linkLineAry.push(linkLine);
        }
    };

    p.createLineItem = function (sCity, eCity) {
        var sPoint = this.cityToV(sCity);
        var ePoint = this.cityToV(eCity);

        //注意，一定要使用clone() lerp()返回的是调用该方法的对象。
        var p2 = sPoint.clone().lerp(ePoint, 0.1);
        p2.normalize().multiplyScalar(this.earthR + Math.random()*15+5);
        p2.y += Math.random()*15+5;
        //
        var p3 = sPoint.clone().lerp(ePoint, 0.7);
        p3.normalize().multiplyScalar(this.earthR + Math.random()*5+5);
        p3.y += Math.random()*5+5;
        //三次曲线
        var curve = new THREE.CubicBezierCurve3(sPoint, p2, p3, ePoint);

        var geometry = new THREE.Geometry();
        geometry.vertices = curve.getPoints(500);
        var material = new THREE.LineBasicMaterial({
            color: 0xdfe43c,
            transparent: true,
            opacity: 0,
            depthTest: false
        });
        var curveObject = new THREE.Line(geometry, material);
        curveObject.userData["curve"] = curve;
        return curveObject;
    };

    p.cityToV = function (city) {
        var posX = city["x"] * this.scale;
        var posY = city["y"] * this.scale;
        var posZ = city["z"] * this.scale;
        return new THREE.Vector3(posX, posY, posZ);
    };

    /*转换前状态
     *container         position-   x:0,     y:0,        z:0
     *earthContainer    rotation-   x:0.5,   y:-0.05     z:0
     *camera            position.z : 1000
     */
    p.toChina = function() {
        var cur = this;
        var json = {per:0};
        var t = 0.6;
        new TweenMax(json,t,{
            per:1,
            ease:Linear.easeNone,
            onUpdate:function(){
                var t = json.per;
                cur.container.position.x = cur.s2e(0,30,t);
                cur.container.position.y = cur.s2e(0,-100,t);
                cur.earthContainer.rotation.x = cur.s2e(0.5,0.16,t);
                cur.earthContainer.rotation.y = cur.s2e(-0.05,-0.38,t);
                cur.camera.position.z = cur.s2e(1000,418,t);
                cur.earth.material.opacity = cur.s2e(1,0.2,t);
                cur.aroundLineArr.map(function (line) {
                    line.material.opacity = cur.s2e(0.2,0,t);
                });
                cur.ringLight.material.opacity = cur.s2e(1,0,t);
                cur.dotLight1.material.opacity = cur.s2e(1,0,t);
                cur.lineParticleMaterial.uniforms.opacity = 0;
                
                cur.aroundLineParticlesArr.map(function(line){
                    line.visible = false;
                });
            },
            onStart:function(){
                cur.appear(t);
            },
            onComplete:function(){
                cur.onComplete && cur.onComplete();
            }
        });
    };

    p.s2e = function(s,e,t){
        return s+(e-s)*t;
    };

    Exhibition.Earth = Earth;

})();