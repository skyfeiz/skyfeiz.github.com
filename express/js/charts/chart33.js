this.Charts = this.Charts || {};

(function () {

    var dataArr = [
        {date: '2017-11-15', value: 1000},
        {date: '2017-11-15', value: 1500},
        {date: '2017-11-15', value: 1409},
        {date: '2017-11-15', value: 1700},
        {date: '2017-11-15', value: 1630},
        {date: '2017-11-15', value: 2300},
        {date: '2017-11-15', value: 2520}
    ];
    var areaW = 700, areaH = 400;

    var Chart33 = function (scene, resourcesMap) {
        this.scene = scene;
        this.resourcesMap = resourcesMap;
        this.init();
    }

    var p = Chart33.prototype;

    p.init = function () {
        this.container = new THREE.Object3D();
        this.container.position.x = positionInfo[2].x - 250;
        this.container.position.y = positionInfo[2].y;
        this.container.position.z = positionInfo[2].z;
        this.scene.add(this.container);

        this.initDate();
    }

    p.initDate = function () {
        var today = new Date();
        dataArr.map(function (data, index) {
            data.date = '11-' + (today.getDate() - (dataArr.length - index));
        });

        this.setData(dataArr);
    }

    p.setData = function (value) {
        this.datas = value;
        var cur = this;
        this.maxValue = -Number.MAX_VALUE;
        this.minValue = Number.MAX_VALUE;
        value.map(function (data) {
            cur.maxValue = Math.max(data.value, cur.maxValue);
            cur.minValue = Math.min(data.value, cur.minValue);
        });

        this.createTitle();
        this.createArea();
        // this.startArea();
        // this.startRender();
    }

    p.render = function () {
        this.lightColumnRender();
    }
    
    p.startRender = function () {
        var cur = this;
        if (this.titleContainer) {
            TweenMax.to(this.titleContainer.position, 0.8, {
                z: cur.titleContainer.userData['z'],
                delay: 1.4,
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
        this.dateItemArr.map(function (item, index) {
            TweenMax.to(item.position, 0.8, {
                z: item.userData['z'],
                delay: index * 0.2,
                ease: Power3.easeInOut,
                onStartParams: [item],
                onStart: function (temp) {
                    temp.children.map(function (child) {
                        TweenMax.to(child.material, 0.8, {
                            opacity: 1,
                            ease: Power3.easeInOut
                        });
                    });
                }
            });
        });
        this.numItemArr.map(function (item, index) {
            TweenMax.to(item.scale, 0.8, {
                y: 1,
                delay: index * 0.2 + 1,
                ease: Power3.easeInOut,
                onStartParams: [item],
                onStart: function (temp) {
                    temp.children.map(function (child) {
                        TweenMax.to(child.material, 0.8, {
                            opacity: 1,
                            ease: Power3.easeInOut
                        });
                    });
                }
            });
        });
    }

    //------------------------------------ 创建标题 --------------------------------------

    p.createTitle = function () {
        this.titleContainer = new THREE.Object3D();
        this.titleContainer.position.set(-240, 0, -500);
        this.titleContainer.rotation.x = -Math.PI / 2;
        this.titleContainer.userData['z'] = 250;
        this.container.add(this.titleContainer);

        var g = new THREE.PlaneBufferGeometry(400, 150);
        var m = new THREE.MeshBasicMaterial({
            map: this.resourcesMap['title']['result'],
            transparent: true,
            opacity: 0,
            depthTest: false
        });
        this.titleContainer.add(new THREE.Mesh(g, m));

        var obj = this.createTxtMaterial(200, 64, 0, 36, 'center', true, '#00aeff');
        var title = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 64), obj['material']);
        obj['context'].clearRect(0, 0, 200, 64);
        obj['context'].fillText('销售趋势', 100, 32);
        obj['material'].map.needsUpdate = true;
        this.titleContainer.add(title);

        var obj = this.createTxtMaterial(300, 64, 0, 24, 'center', true, '#00aeff');
        var subTitle = new THREE.Mesh(new THREE.PlaneBufferGeometry(300, 64), obj['material']);
        obj['context'].clearRect(0, 0, 300, 64);
        obj['context'].fillText('SALES TRENDS', 150, 32);
        obj['material'].map.needsUpdate = true;
        subTitle.position.y = -40;
        this.titleContainer.add(subTitle);
    }

    //------------------------------------ 创建序列 --------------------------------------

    p.createArea = function () {
        this.numItemArr = [];
        this.dateItemArr = [];
        this.columnItems = [];

        var cur = this;
        var space = areaW / this.datas.length;
        var shape = new THREE.Shape();
        var x = 0, y = 0, topY;
        shape.moveTo(x, y);
        dataArr.map(function (data, index) {
            x = space * index;
            y = data['value'] / cur.maxValue * areaH / 2.5;
            topY = data['value'] / cur.maxValue * areaH;
            shape.lineTo(x, y);

            var container = new THREE.Object3D();
            container.position.x = x;
            container.scale.y = 0;
            cur.container.add(container);
            cur.numItemArr.push(container);

            // 虚线
            var startP = new THREE.Vector3(0, y, 20);
            var endP = new THREE.Vector3(0, topY, 20);
            var g = new THREE.Geometry();
            g.vertices.push(startP, endP);
            g.computeLineDistances();
            m = new THREE.LineDashedMaterial({
                vertexColors: false,
                dashSize: 2,
                gapSize: 2,
                color: 0xffff00,
                transparent: true,
                opacity: 0
            });
            var l = new THREE.Line(g, m);
            container.add(l);

            // 虚线上面的点
            var g = new THREE.Geometry();
            g.vertices.push(endP);
            var m = new THREE.PointsMaterial({
                color: 0xffff00,
                transparent: true,
                opacity: 0,
                size: 8
            });
            var p = new THREE.Points(g, m);
            container.add(p);

            // 虚线上面的文字
            var obj = cur.createTxtMaterial(128, 32, 0, 22, 'center', true, '#ffffff');
            var numTxt = new THREE.Mesh(new THREE.PlaneBufferGeometry(128, 32), obj['material']);
            numTxt.position.x = 0;
            numTxt.position.y = topY + 20;
            obj['context'].clearRect(0, 0, 128, 32);
            obj['context'].fillText(data['value'], 64, 26);
            obj['material'].map.needsUpdate = true;
            container.add(numTxt);

            // 日期
            var dateItem = cur.createDate(data['date']);
            dateItem.position.x = x;
            cur.container.add(dateItem);
            cur.dateItemArr.push(dateItem);
        });
        shape.lineTo(x, 0);
        shape.lineTo(0, 0);

        var g = new THREE.ExtrudeGeometry(shape, {
            amount: 40,
            bevelEnabled: true,
            bevelSegments: 0,
            steps: 1,
            bevelSize: 0,
            bevelThickness: 0
        });
        // var m = new THREE.MeshLambertMaterial({
        //     color: 0x00aeff,
        //     transparent: true,
        //     opacity: 0.5,
        //     wireframe: false
        // });
        var m = new THREE.ShaderMaterial({
            uniforms: {
                color:   { type: "c", value: new THREE.Color(0x00aeff) },
                opacity: { type: "f", value: 1 },
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
                    "gl_FragColor = vec4( color, ( 0.2 + 0.8 * max( dot( N, normalize( vec3( 0., 1., 0. ) ) ), 0. ) ) );",

                    "float depth = gl_FragCoord.z / gl_FragCoord.w;",
                    "float fogFactor = smoothstep( fogNear, fogFar, depth );",
                    "gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",
                "}"
            ].join("\n"),
            blending: THREE.NormalBlending,
            // depthTest: false,
            transparent: true
        });
        this.area = new THREE.Mesh(g, m);
        // this.area.scale.x = 0;
        this.container.add(this.area);
        this.area.userData['clickable'] = true;
        this.columnItems.push(this.area);
    }

    //------------------------------------ 创建下面的日期 --------------------------------------

    p.createDate = function (date) {
        var container = new THREE.Object3D();
        container.position.z = -300;
        container.userData['z'] = 80;
        container.rotation.x = -Math.PI / 2;

        // 日期前面的小点
        var g = new THREE.Geometry();
        var p = new THREE.Vector3(0, 0, 0);
        g.vertices.push(p);
        var m = new THREE.PointsMaterial({
            color: 0xffff00,
            size: 10,
            transparent: true,
            opacity: 0
        });
        var point = new THREE.Points(g, m);
        point.position.set(0, 20, 0);
        container.add(point);

        // 日期
        var g = new THREE.PlaneBufferGeometry(90, 50);
        var m = new THREE.MeshBasicMaterial({
            map: this.resourcesMap['date']['result'],
            transparent: true,
            opacity: 0,
            depthTest: false
        });
        var bg = new THREE.Mesh(g, m);
        bg.position.y = -20;
        container.add(bg);

        var obj = this.createTxtMaterial(128, 32, 0, 18, 'center', false, '#00aeff');
        var dateItem = new THREE.Mesh(new THREE.PlaneBufferGeometry(150, 62.5), obj['material']);
        obj['context'].clearRect(0, 0, 128, 32);
        obj['context'].fillText(date, 65, 22);
        obj['material'].map.needsUpdate = true;
        dateItem.position.y = -20;
        container.add(dateItem);

        return container;
    }

    p.startArea = function () {
        TweenMax.to(this.area.scale, 0.6, {
            x: 1,
            ease: Power3.easeInOut
        });
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

    Charts.Chart33 = Chart33;
})();