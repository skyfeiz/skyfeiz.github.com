this.Charts = this.Charts || {};

(function () {

    var dataArr = [
        {name: '快件包装问题', value: 300},
        {name: '快件未及时送达', value: 600},
        {name: '快件质量问题', value: 500},
        {name: '其他', value: 200}
    ];
    var colorArr = [0xffffff, 0x0153b8, 0x308bfb, 0x30c7fb];
    var innerRadius = 60, outerRadius = 140, bigRadius = 190;

    var Chart3 = function (scene, resourcesMap) {
        this.scene = scene;
        this.resourcesMap = resourcesMap;
        this.init();
    }

    var p = Chart3.prototype;

    p.init = function () {
        this.container = new THREE.Object3D();
        this.container.position.x = positionInfo[2].x;
        this.container.position.y = positionInfo[2].y;
        this.container.position.z = positionInfo[2].z;
        this.scene.add(this.container);

        this.setData(dataArr);
    }

    p.setData = function (value) {
        var cur = this;
        this.datas = value;
        this.sum = 0;
        value.map(function (item) {
            cur.sum += item['value'];
        });

        this.createTitle();
        this.createCenter();
        this.createSector();
        // this.startRender();
    }

    p.render = function () {
        this.lightSectorRender();
    }
    
    p.startRender = function () {
        var cur = this;
        if (this.titleContainer) {
            TweenMax.to(this.titleContainer.position, 0.8, {
                z: cur.titleContainer.userData['z'],
                delay: 0.7,
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
        this.sectorTxtArr.map(function (item, index) {
            TweenMax.to(item.position, 0.6, {
                x: item.userData['position'].x,
                y: item.userData['position'].y,
                delay: index * 0.15,
                ease: Power3.easeInOut,
                onStartParams: [item],
                onStart: function (temp) {
                    TweenMax.to(temp.material, 0.6, {
                        opacity: 1,
                        ease: Power3.easeInOut
                    });

                    var line = cur.sectorLineArr[index];
                    line.children.map(function (child, i) {
                        TweenMax.to(child.material, 0.6, {
                            opacity: i == 1 ? 0.5 : 1,
                            ease: Power3.easeInOut
                        });
                    });
                }
            });
        })
    }

    //------------------------------------ 创建标题 --------------------------------------

    p.createTitle = function () {
        this.titleContainer = new THREE.Object3D();
        this.titleContainer.position.set(-150, 0, -500);
        this.titleContainer.rotation.x = -Math.PI / 2;
        this.titleContainer.userData['z'] = 250;
        this.container.add(this.titleContainer);

        var g = new THREE.PlaneBufferGeometry(450, 150);
        var m = new THREE.MeshBasicMaterial({
            map: this.resourcesMap['title']['result'],
            transparent: true,
            opacity: 0,
            depthTest: false
        });
        this.titleContainer.add(new THREE.Mesh(g, m));

        var obj = this.createTxtMaterial(300, 64, 0, 36, 'center', true, '#2cc1ff');
        var title = new THREE.Mesh(new THREE.PlaneBufferGeometry(300, 64), obj['material']);
        obj['context'].clearRect(0, 0, 300, 64);
        obj['context'].fillText('快件拒收原因概览', 150, 32);
        obj['material'].map.needsUpdate = true;
        this.titleContainer.add(title);

        var obj = this.createTxtMaterial(400, 64, 0, 24, 'center', true, '#2cc1ff');
        var subTitle = new THREE.Mesh(new THREE.PlaneBufferGeometry(400, 64), obj['material']);
        obj['context'].clearRect(0, 0, 400, 64);
        obj['context'].fillText('AN OVERVIEW OF THE REASONS', 200, 32);
        obj['material'].map.needsUpdate = true;
        subTitle.position.y = -40;
        this.titleContainer.add(subTitle);
    }

    p.createSector = function () {
        var cur = this;
        this.sectorArr = [];
        this.lightSectorArr = [];
        this.sectorTxtArr = [];
        this.sectorLineArr = [];
        this.columnItems = [];

        var startA = -0.2, endA = 0;
        this.datas.map(function (item, index) {
            var sectorContainer = new THREE.Object3D();
            sectorContainer.position.y = 170;
            sectorContainer.rotation.x = -0.2;
            cur.container.add(sectorContainer);
            cur.sectorArr.push(sectorContainer);

            var outerR = outerRadius + index * 7;
            var angle = item['value'] / cur.sum * 360 * radian;
            endA = startA + angle;
            var sector = cur.createSectorItem(startA, endA, innerRadius, outerR, 20 + 5 * index, colorArr[index % colorArr.length]);
            sectorContainer.add(sector);
            sector.userData['clickable'] = item['name'] == '快件未及时送达';
            cur.columnItems.push(sector);

            var sectorTxt = cur.createLineAndText(item, startA + angle / 2, innerRadius, outerR, bigRadius);
            sectorContainer.add(sectorTxt);

            startA = endA;

            // 饼图的光效太难看，之后需要再考虑其他的效果
            // var lightSector = cur.createLightSectorItem(angle, index);
            // sectorContainer.add(lightSector);
            // cur.lightSectorArr.push(lightSector);

            // sectorContainer.children.map(function (child) {
            //     child.material && (child.material.opacity = 0);
            // });
        });
    }

    // 创建扇形的指引线和文字
    p.createLineAndText = function (item, angle, innerR, outerR, bigR) {
        var container = new THREE.Object3D();

        outerR = innerR + (outerR - innerR) / 2;
        var startP = new THREE.Vector3(outerR * Math.cos(angle), outerR * Math.sin(angle), 40);
        var middleP = new THREE.Vector3(bigR * Math.cos(angle), bigR * Math.sin(angle), 40);
        if (angle > Math.PI / 2 && angle < 1.5 * Math.PI) {
            var textAlign = 'right';
            var textOffset = -5;
            var endP = new THREE.Vector3(middleP.x - 50, middleP.y, 40);
        } else {
            textAlign = 'left';
            textOffset = 10;
            endP = new THREE.Vector3(middleP.x + 50, middleP.y, 40);
        }

        var lineContainer = new THREE.Object3D();
        container.add(lineContainer);
        this.sectorLineArr.push(lineContainer);

        var g = new THREE.Geometry();
        g.vertices.push(startP);
        var m = new THREE.PointsMaterial({
            color: 0x6ed5ff,
            transparent: true,
            opacity: 0,
            size: 10
        });
        var p = new THREE.Points(g, m);
        lineContainer.add(p);

        g = new THREE.SphereBufferGeometry(6, 10, 10);
        m = new THREE.MeshBasicMaterial({
            color: 0x6ed5ff,
            transparent: true,
            opacity: 0,
            size: 15
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
            size: 5
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
            opacity: 0
        });
        var l = new THREE.Line(g, m);
        lineContainer.add(l);
        // l.position.set(startP.x, startP.y, startP.z);
        // l.scale.x = 0;
        // l.scale.y = 0;
        //
        // TweenMax.to(l.scale, 1.6, {
        //     x: 1,
        //     y: 1
        // });


        var obj = this.createTxtMaterial(400, 64, 0, 26, textAlign, true, '#2ca3ff');
        var nameItem = new THREE.Mesh(new THREE.PlaneBufferGeometry(400, 64), obj['material']);
        obj['context'].clearRect(0, 0, 400, 64);
        obj['context'].fillText(item['name'], 200, 32);
        obj['material'].map.needsUpdate = true;
        nameItem.position.set(0, 0, middleP.z);
        nameItem.userData['position'] = {x: middleP.x + textOffset, y: middleP.y + 10, z: middleP.z};
        container.add(nameItem);
        this.sectorTxtArr.push(nameItem);

        return container;
    }

    // 创建中心的圆球和虚线圆环
    p.createCenter = function () {
        var g = new THREE.SphereBufferGeometry(10, 10, 10);
        var m = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true
        });
        var sphere = new THREE.Mesh(g, m);
        sphere.position.set(0, 170, 20);
        this.container.add(sphere);

        var shape = new THREE.Shape();
        shape.arc(0, 0, 28, 0, 2 * Math.PI);
        g = shape.createPointsGeometry();
        g.computeLineDistances();
        m = new THREE.LineDashedMaterial({
            vertexColors: false,
            dashSize: 3,
            gapSize: 3,
            color: 0x00aeff,
            transparent: true
        });
        var line = new THREE.Line(g, m);
        line.position.set(0, 170, 20);
        this.container.add(line);
    }

    p.createSectorItem = function (startA, endA, innerR, outerR, amount, color) {
        var shape = this.createShape(startA, endA, innerR, outerR);
        var g = new THREE.ExtrudeGeometry(shape, {
            amount: amount,
            bevelEnabled: true,
            bevelSegments: 0,
            steps: 1,
            bevelSize: 0,
            bevelThickness: 0
        });
        var m = new THREE.MeshLambertMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            wireframe: false
        });

        return new THREE.Mesh(g, m);
    }

    p.createLightSectorItem = function (startA, endA, innerR, outerR, t) {
        var material = new THREE.ShaderMaterial({
            uniforms: {
                color:   { type: "c", value: new THREE.Color(0xffffff) },
                opacity: { type: "f", value: 1 }
            },
            vertexShader: dym.shader.column.vertexShader,
            fragmentShader: dym.shader.column.fragmentShader,
            blending: THREE.NormalBlending,
            depthTest: false,
            transparent: true
        });

        var o = 8 * Math.ceil(1 - 0.05 * t * 2);
        var shape = this.createShape(startA, endA, innerR, outerR);
        var geometry = new THREE.ExtrudeGeometry(shape, {
            amount: 30,
            bevelEnabled: true,
            bevelSegments: 1,
            steps: 1,
            bevelSize: 1,
            bevelThickness: 1,
            curveSegments: 10
        });
        var g = new THREE.BufferGeometry();
        g.fromGeometry(geometry);
        g.userData = {};
        g.userData['center'] = -200 - 150 * t;
        g.userData['r'] = 100;

        var positionArr = g.attributes.position.array;
        var colorArr = g.attributes.color.array;
        var particleNum = positionArr.length / 3;
        var opacityArr = new Float32Array(particleNum);

        var i = particleNum;
        var i3 = i * 3;
        while (i3 > 0) {
            i--;
            i3 -= 3;

            var u = [0x3b90f8, 0x2f5dc4];
            var color = new THREE.Color(u[Math.floor(u.length * Math.random())]);
            var y = 1 - Math.abs(g.userData['center'] - positionArr[i3 + 1] / g.userData['r']);
            opacityArr[i] = .1 * y;
            color.toArray(colorArr, i * 3);
        }

        g.addAttribute('aOpacity', new THREE.BufferAttribute(opacityArr, 1));
        g.addAttribute('aColor', new THREE.BufferAttribute(colorArr, 3));
        g.attributes.aOpacity.needsUpdate = true;
        g.attributes.aColor.needsUpdate = true;

        return new THREE.Mesh(g, material);
    }

    p.lightSectorRender = function () {
        var cur = this;
        this.lightSectorArr.map(function (lightSector, index) {
            cur.lightSectorItemRender(lightSector);
        });
    }
    p.lightSectorItemRender = function (t) {
        var positionArr = t.geometry.attributes.position.array;
        var opacityArr = t.geometry.attributes.aOpacity.array;

        t.geometry.userData['center'] += 4;
        t.geometry.userData['center'] > 400 && (t.geometry.userData['center'] = -400);

        var i = opacityArr.length;
        var i3 = i * 3;
        while (i3 > 0) {
            i--;
            i3 -= 3;

            var y = 1 - Math.abs(t.geometry.userData['center'] - positionArr[i3]) / t.geometry.userData['r'];
            opacityArr[i] = .9 * y;
        }
        t.geometry.attributes.aOpacity.needsUpdate = true;
    }

    p.createShape = function(startA, endA, innerR, outerR) {
        var shape = new THREE.Shape();
        shape.moveTo(innerR * Math.cos(startA), innerR * Math.sin(startA));
        shape.absarc(0, 0, innerR, startA, endA);
        shape.lineTo(outerR * Math.cos(endA), outerR * Math.sin(endA));
        shape.absarc(0, 0, outerR, endA, startA, true);
        shape.lineTo(innerR * Math.cos(startA), innerR * Math.sin(startA));
        shape.closePath();

        return shape;
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

    Charts.Chart3 = Chart3;
})();