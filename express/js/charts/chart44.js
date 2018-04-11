this.Charts = this.Charts || {};

(function () {

    var Chart44 = function (scene, resourcesMap) {
        this.scene = scene;
        this.resourcesMap = resourcesMap;
        this.init();
    }

    var p = Chart44.prototype;

    p.init = function () {
        this.container = new THREE.Object3D();
        this.container.position.x = positionInfo[3].x;
        this.container.position.y = positionInfo[3].y;
        this.container.position.z = positionInfo[3].z;
        this.scene.add(this.container);

        this.initObj();
    }

    p.initObj = function () {
        this.createTitle();
        this.createGeometry();
        // this.startRender();
    }

    p.render = function () {
        // this.lightSectorRender();
    }
    
    p.startRender = function () {
        var cur = this;
        if (this.titleContainer) {
            TweenMax.to(this.titleContainer.position, 0.8, {
                z: cur.titleContainer.userData['z'],
                delay: 0.4,
                ease: Power3.easeInOut,
                onStartParams: [cur.titleContainer],
                onStart: function (temp) {
                    temp.children.map(function (child) {
                        TweenMax.to(child.material, 0.8, {
                            opacity: 1,
                            ease: Power3.easeInOut
                        });
                    });
                }
            });
        }
        this.txtItemArr.map(function (item, index) {
            item.children.map(function (txtItem) {
                TweenMax.to(txtItem.position, 0.8, {
                    x: txtItem.userData['position'].x,
                    y: txtItem.userData['position'].y,
                    z: txtItem.userData['position'].z,
                    delay: index * 0.2,
                    ease: Power3.easeInOut,
                    onStartParams: [txtItem],
                    onStart: function (temp) {
                        TweenMax.to(temp.material, 0.6, {
                            opacity: 1,
                            ease: Power3.easeInOut
                        });

                        var line = cur.txtLineArr[index];
                        line.children.map(function (child, i) {
                            TweenMax.to(child.material, 0.8, {
                                opacity: i == 1 ? 0.5 : 1,
                                ease: Power3.easeInOut
                            });
                        });
                    }
                });
            });
        })
    }

    //------------------------------------ 创建标题 --------------------------------------

    p.createTitle = function () {
        this.titleContainer = new THREE.Object3D();
        this.titleContainer.position.set(200, 0, -500);
        this.titleContainer.rotation.x = -Math.PI / 2;
        this.titleContainer.userData['z'] = 300;
        this.container.add(this.titleContainer);

        var g = new THREE.PlaneBufferGeometry(450, 150);
        var m = new THREE.MeshBasicMaterial({
            map: this.resourcesMap['title']['result'],
            transparent: true,
            opacity: 0,
            depthTest: false
        });
        this.titleContainer.add(new THREE.Mesh(g, m));

        var obj = this.createTxtMaterial(300, 64, 0, 36, 'center', true, '#00aeff');
        var title = new THREE.Mesh(new THREE.PlaneBufferGeometry(300, 64), obj['material']);
        obj['context'].clearRect(0, 0, 300, 64);
        obj['context'].fillText('仓储预测', 150, 32);
        obj['material'].map.needsUpdate = true;
        this.titleContainer.add(title);

        var obj = this.createTxtMaterial(400, 64, 0, 24, 'center', true, '#00aeff');
        var subTitle = new THREE.Mesh(new THREE.PlaneBufferGeometry(400, 64), obj['material']);
        obj['context'].clearRect(0, 0, 400, 64);
        obj['context'].fillText('WAREHOUSING FORECASTING', 200, 32);
        obj['material'].map.needsUpdate = true;
        subTitle.position.y = -40;
        this.titleContainer.add(subTitle);
    }

    //------------------------------------ 创建几何体 --------------------------------------

    p.createGeometry = function () {
        this.txtItemArr = [];
        this.txtLineArr = [];
        this.columnItems = [];


        var topM = new THREE.ShaderMaterial({
            uniforms: {
                color:   { type: "c", value: new THREE.Color(0x0061e6) },
                opacity: { type: "f", value: 1 },
                textureMap: { value: this.resourcesMap['column1']['result'] },
                fogColor:   { type: "c", value: this.scene.fog.color },
                fogNear:    { type: "f", value: this.scene.fog.near },
                fogFar:     { type: "f", value: this.scene.fog.far }
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
                    "gl_FragColor = vec4( color * texture2D( textureMap, vUV ).rgb, texture2D( textureMap, vUV ).a );",

                    "float depth = gl_FragCoord.z / gl_FragCoord.w;",
                    "float fogFactor = smoothstep( fogNear, fogFar, depth );",
                    "gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",
                "}"
            ].join("\n"),
            blending: THREE.NormalBlending,
            // depthTest: false,
            transparent: true
        });
        var topG = new THREE.CylinderBufferGeometry(0, 100, 250, 4);
        // var topM = new THREE.MeshLambertMaterial({
        //     color: 0x0061e6,
        //     transparent: true,
        //     opacity: 1
        // });
        var top = new THREE.Mesh(topG, topM);
        top.position.y = 260;
        this.container.add(top);
        top.userData['clickable'] = false;
        this.columnItems.push(top);

        var textItem = this.createLineAndText(
            {x: -50, y: 260, z: 70},
            {x: -80, y: 320, z: 70},
            {x: -140, y: 320, z: 70},
            {text: '实际需补货', num: '3000'},
            'left',
            -130
        );
        this.container.add(textItem);



        var bottomM = new THREE.ShaderMaterial({
            uniforms: {
                color:   { type: "c", value: new THREE.Color(0x0061e6) },
                opacity: { type: "f", value: 1 },
                textureMap: { value: this.resourcesMap['column1']['result'] },
                fogColor:   { type: "c", value: this.scene.fog.color },
                fogNear:    { type: "f", value: this.scene.fog.near },
                fogFar:     { type: "f", value: this.scene.fog.far }
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
                    "gl_FragColor = vec4( color * texture2D( textureMap, vUV ).rgb, texture2D( textureMap, vUV ).a );",

                    "float depth = gl_FragCoord.z / gl_FragCoord.w;",
                    "float fogFactor = smoothstep( fogNear, fogFar, depth );",
                    "gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",
                "}"
            ].join("\n"),
            blending: THREE.NormalBlending,
            // depthTest: false,
            transparent: true
        });
        var bottomG = new THREE.CylinderBufferGeometry(110, 200, 250, 4);
        // var bottomM = new THREE.MeshLambertMaterial({
        //     color: 0x0061e6,
        //     transparent: true,
        //     opacity: 1
        // });
        var bottom = new THREE.Mesh(bottomG, bottomM);
        this.container.add(bottom);
        bottom.userData['clickable'] = false;
        this.columnItems.push(bottom);

        var textItem = this.createLineAndText(
            {x: 80, y: 50, z: 90},
            {x: 120, y: 110, z: 90},
            {x: 180, y: 110, z: 90},
            {text: '计划需补货', num: '5000'},
            'left',
            10
        );
        this.container.add(textItem);
    }

    //------------------------------------ 创建指引线和文字 --------------------------------------

    p.createLineAndText = function (startP, middleP, endP, data, textAlign, textOffset) {
        var container = new THREE.Object3D();

        var lineContainer = new THREE.Object3D();
        container.add(lineContainer);
        this.txtLineArr.push(lineContainer);

        var g = new THREE.Geometry();
        g.vertices.push(startP);
        var m = new THREE.PointsMaterial({
            color: 0x6ed5ff,
            transparent: true,
            opacity: 0,
            size: 10,
            depthTest: false
        });
        var p = new THREE.Points(g, m);
        lineContainer.add(p);

        g = new THREE.SphereBufferGeometry(6, 10, 10);
        m = new THREE.MeshBasicMaterial({
            color: 0x6ed5ff,
            transparent: true,
            opacity: 0,
            size: 15,
            depthTest: false
        });
        p = new THREE.Mesh(g, m);
        p.position.set(startP.x, startP.y, startP.z);
        lineContainer.add(p);

        g = new THREE.Geometry();
        g.vertices.push(endP);
        m = new THREE.PointsMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            size: 5,
            depthTest: false
        });
        var p = new THREE.Points(g, m);
        lineContainer.add(p);

        g = new THREE.Geometry();
        g.vertices.push(startP);
        g.vertices.push(middleP);
        g.vertices.push(endP);
        m = new THREE.LineBasicMaterial({
            color: 0x6ed5ff,
            transparent: true,
            opacity: 0,
            depthTest: false
        });
        var l = new THREE.Line(g, m);
        lineContainer.add(l);



        var txtContainer = new THREE.Object3D();
        container.add(txtContainer);
        this.txtItemArr.push(txtContainer);

        var obj = this.createTxtMaterial(350, 64, 0, 26, textAlign, true, '#00aeff');
        var nameItem = new THREE.Mesh(new THREE.PlaneBufferGeometry(350, 64), obj['material']);
        obj['context'].clearRect(0, 0, 350, 64);
        obj['context'].fillText(data.text, 170, 32);
        obj['material'].map.needsUpdate = true;
        nameItem.position.set(0, 0, 0);
        nameItem.userData['position'] = {x: endP.x + textOffset, y: endP.y, z: endP.z};
        txtContainer.add(nameItem);


        var obj = this.createTxtMaterial(350, 64, 0, 38, textAlign, true, '#ffffff');
        var nameItem = new THREE.Mesh(new THREE.PlaneBufferGeometry(350, 64), obj['material']);
        obj['context'].clearRect(0, 0, 350, 64);
        obj['context'].fillText(data.num, 170, 32);
        obj['material'].map.needsUpdate = true;
        nameItem.position.set(0, 0, 0);
        nameItem.userData['position'] = {x: endP.x + textOffset, y: endP.y - 40, z: endP.z};
        txtContainer.add(nameItem);

        return container;
    }

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
            // context.shadowColor = '#2cc1ff';
            // context.shadowBlur = 3;
            // context.shadowOffsetX = -2;
            // context.shadowOffsetY = 2;
        }

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var material = new THREE.MeshBasicMaterial({map: texture, opacity: opacity, side: THREE.DoubleSide, transparent: true, depthTest: false});
        var obj = {'material': material, 'context': context};
        return obj;
    }

    Charts.Chart44 = Chart44;
})();