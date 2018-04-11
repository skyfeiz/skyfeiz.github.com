this.Charts = this.Charts || {};

(function () {

    var dataArr = [
        {name: '客户地址禁止快递进入', value: 105},
        {name: '退回', value: 212},
        {name: '拒收', value: 700},
        {name: '节假日', value: 783},
        {name: '联系不上客户', value: 1000}
    ];
    var columnW = 450, columnH = 40;

    var Chart2 = function (scene, resourcesMap) {
        this.scene = scene;
        this.resourcesMap = resourcesMap;
        this.init();
    }

    var p = Chart2.prototype;

    p.init = function () {
        this.container = new THREE.Object3D();
        this.container.position.x = positionInfo[1].x;
        this.container.position.y = positionInfo[1].y + columnH / 2;
        this.container.position.z = positionInfo[1].z;
        this.scene.add(this.container);

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
        this.createColumns();
        // this.startColumns();
    }

    p.render = function () {
        this.lightColumnRender();
    }

    p.startRender = function () {
        var cur = this;
        if (this.titleContainer) {
            TweenMax.to(this.titleContainer.position, 0.8, {
                z: cur.titleContainer.userData['z'],
                delay: 1,
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
        if (this.columnTxtArr) {
            this.columnTxtArr.map(function (item, index) {
                TweenMax.to(item.position, 0.8, {
                    x: item.userData['x'],
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
        }
        if (this.columnNumArr) {
            this.columnNumArr.map(function (item, index) {
                TweenMax.to(item.scale, 0.5, {
                    x: 1,
                    delay: (index) * 0.2 + 0.5,
                    ease: Power3.easeOut,
                    onStartParams: [item],
                    onStart: function (temp) {
                        temp.children.map(function (child) {
                            child.material.opacity = 1;
                            // TweenMax.to(child.material, 0.2, {
                            //     opacity: 1,
                            //     ease: Power3.easeInOut
                            // });
                        });
                    }
                });
            });
        }
    }

    //------------------------------------ 创建标题 --------------------------------------

    p.createTitle = function () {
        this.titleContainer = new THREE.Object3D();
        this.titleContainer.position.set(-150, 30, -500);
        this.titleContainer.rotation.x = -Math.PI / 2;
        this.titleContainer.userData['z'] = 250;
        this.container.add(this.titleContainer);

        var g = new THREE.PlaneBufferGeometry(400, 150);
        var m = new THREE.MeshBasicMaterial({
            map: this.resourcesMap['title']['result'],
            transparent: true,
            opacity: 0
        });
        this.titleContainer.add(new THREE.Mesh(g, m));

        var obj = this.createTxtMaterial(300, 64, 0, 36, 'center', true, '#2cc1ff');
        var title = new THREE.Mesh(new THREE.PlaneBufferGeometry(300, 64), obj['material']);
        obj['context'].clearRect(0, 0, 300, 64);
        obj['context'].fillText('异常件原因概览', 150, 32);
        obj['material'].map.needsUpdate = true;
        this.titleContainer.add(title);

        var obj = this.createTxtMaterial(350, 64, 0, 24, 'center', true, '#2cc1ff');
        var subTitle = new THREE.Mesh(new THREE.PlaneBufferGeometry(350, 64), obj['material']);
        obj['context'].clearRect(0, 0, 350, 64);
        obj['context'].fillText('CAUSE OF ABNORMAL PARTS', 175, 32);
        obj['material'].map.needsUpdate = true;
        subTitle.position.y = -40;
        this.titleContainer.add(subTitle);
    }

    p.createColumns = function () {
        var cur = this;

        this.columnArr = [];
        this.lightColumnArr = [];
        this.columnTxtArr = [];
        this.columnNumArr = [];
        this.columnItems = [];

        this.datas.map(function (item, index) {
            var columnContainer = new THREE.Object3D();
            columnContainer.position.set(-250, (columnH + 40) * index, 0);
            columnContainer.rotation.x = -0.2;
            // columnContainer.scale.x = 0;
            cur.container.add(columnContainer);
            cur.columnArr.push(columnContainer);

            var column = cur.createColumnItem();
            column.scale.x = item['value'] / cur.maxValue;
            columnContainer.add(column);
            column.userData['clickable'] = item['name'] == '拒收';
            cur.columnItems.push(column);

            // var lightColumn = cur.createLightColumnItem(index);
            // lightColumn.scale.x = item['value'] / cur.maxValue;
            // columnContainer.add(lightColumn);
            // cur.lightColumnArr.push(lightColumn);

            cur.createColumnTxt(item, index);
            var columnNum = cur.createColumnNum(item);
            columnContainer.add(columnNum);
            cur.columnNumArr.push(columnNum);

            //
            // columnContainer.children.map(function (child) {
            //     child.material && (child.material.opacity = 0);
            // });
        });
    }

    // 创建柱子右侧的虚线和数值
    p.createColumnNum = function (item) {
        var container = new THREE.Object3D();
        var x = item['value'] / this.maxValue * columnW + 40;
        container.position.x = x;
        container.scale.x = 0;

        // 柱子后面的虚线
        var m = new THREE.LineDashedMaterial({
            vertexColors: false,
            dashSize: 3,
            gapSize: 3,
            color: 0xffff00,
            transparent: true,
            opacity: 0
        });
        var g = new THREE.Geometry();
        var p1 = new THREE.Vector3(0, 0, 0);
        var p2 = new THREE.Vector3(columnW - x + 100, 0, 0);
        g.vertices.push(p1);
        g.vertices.push(p2);
        g.computeLineDistances();
        container.add(new THREE.Line(g, m));

        // 虚线后面的点
        var g = new THREE.Geometry();
        var p = new THREE.Vector3(columnW - x + 105, 0, 0);
        g.vertices.push(p);
        var m = new THREE.PointsMaterial({
            color: 0xffff00,
            size: 10,
            transparent: true,
            opacity: 0
        });
        container.add(new THREE.Points(g, m));

        var obj = this.createTxtMaterial(128, 32, 0, 24, 'left', false, '#2ca3ff');
        var numItem = new THREE.Mesh(new THREE.PlaneBufferGeometry(128, 32), obj['material']);
        obj['context'].clearRect(0, 0, 128, 32);
        obj['context'].fillText(item['value'], 64, 22);
        obj['material'].map.needsUpdate = true;
        numItem.position.set(columnW - x + 130, 0, 0);
        container.add(numItem);

        return container;
    }

    // 创建柱子左侧的点和文字
    p.createColumnTxt = function (item, index) {
        var container = new THREE.Object3D();
        container.position.set(0, (columnH + 40) * index, 0);
        container.userData['x'] = -330;
        this.container.add(container);
        this.columnTxtArr.push(container);

        var obj = this.createTxtMaterial(450, 64, 0, 24, 'right', false, '#2ca3ff');
        var nameItem = new THREE.Mesh(new THREE.PlaneBufferGeometry(450, 64), obj['material']);
        obj['context'].clearRect(0, 0, 450, 64);
        obj['context'].fillText(item['name'], 250, 32);
        obj['material'].map.needsUpdate = true;

        nameItem.position.set(0, -8, 0);
        container.add(nameItem);

        // 柱子前面的点
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
        point.position.set(50, 0, 0);
        container.add(point);
    }

    p.createColumnItem = function () {
        var material = new THREE.ShaderMaterial({
            uniforms: {
                color:   { type: "c", value: new THREE.Color(0x0061e6) },
                opacity: { type: "f", value: 1 },
                textureMap: { value: this.resourcesMap['column2']['result'] },
                fogColor:   { type: "c", value: this.scene.fog.color },
                fogNear:    { type: "f", value: this.scene.fog.near },
                fogFar:     { type: "f", value: this.scene.fog.far }
            },
            vertexShader: dym.shader.column.vertexShader,
            fragmentShader: dym.shader.column.fragmentShader,
            blending: THREE.NormalBlending,
            // depthTest: false,
            transparent: true
        });

        var g = new THREE.BoxBufferGeometry(columnW, columnH, columnH);
        var positionArr = g.attributes.position.array;
        for (var i = 0; i < positionArr.length; i += 3) {
            positionArr[i] += columnW / 2;
        }

        return new THREE.Mesh(g, material);

        // var geometry = new THREE.BoxGeometry(columnW, columnH, columnH);
        // geometry.vertices.map(function (vector3) {
        //     vector3.x += columnW / 2;
        // });
        // var material = new THREE.MeshLambertMaterial({
        //     color: 0x0061e6,
        //     transparent: true,
        //     opacity: 1,
        //     blending: THREE.NormalBlending
        // });
        // return new THREE.Mesh(geometry, material);
    }

    p.createLightColumnItem = function (t) {
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

        var a = 15 * (1 - t * 0.16);
        var geometry = new THREE.BoxGeometry(columnW, columnH, columnH, a, 2, 2);
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

            positionArr[i3] += columnW / 2;

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

    p.lightColumnRender = function () {
        var cur = this;
        this.lightColumnArr.map(function (lightColumn, index) {
            cur.lightColumnItemRender(lightColumn);
        });
    }
    p.lightColumnItemRender = function (t) {
        var positionArr = t.geometry.attributes.position.array;
        var opacityArr = t.geometry.attributes.aOpacity.array;

        t.geometry.userData['center'] += 4;
        t.geometry.userData['center'] > columnW && (t.geometry.userData['center'] = -columnW);

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

    p.startColumns = function () {
        this.columnArr.map(function (item, index) {
            TweenMax.to(item.scale, 1.6, {
                x: 1,
                delay: index * 0.4,
                ease: Power3.easeOut,
                onStartParams: [item],
                onStart: function (temp) {
                    temp.children.map(function (child) {
                        child.material && (child.material.opacity = 1);
                    });
                }
            });
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

    Charts.Chart2 = Chart2;
})();