this.Charts = this.Charts || {};

(function () {

    var dataArr = [
        {date: '2017-11-14', errorNum: 8512, noSolveNum: 3000, left: 0},
        {date: '2017-11-15', errorNum: 8000, noSolveNum: 3500, left: 3000}
    ];
    var columnW = 90, columnH = 450;

    var Chart1 = function (scene, resourcesMap) {
        this.scene = scene;
        this.resourcesMap = resourcesMap;
        this.init();
    }

    var p = Chart1.prototype;

    p.init = function () {
        this.container = new THREE.Object3D();
        this.container.position.x = positionInfo[0].x;
        this.container.position.y = positionInfo[0].y;
        this.container.position.z = positionInfo[0].z;
        this.scene.add(this.container);

        this.setData(dataArr);
    }

    p.setData = function (value) {
        this.datas = value;
        var cur = this;
        this.maxValue = -Number.MAX_VALUE;
        this.minValue = Number.MAX_VALUE;
        value.map(function (data) {
            cur.maxValue = Math.max(data.errorNum, cur.maxValue);
            cur.minValue = Math.min(data.errorNum, cur.minValue);
        });

        // 先将原有的numItem删除
        if (this.numItemArr) {
            this.numItemArr.map(function (numItem) {
                cur.container.remove(numItem);
            });
            this.numItemArr.length = 0;
        } else {
            this.numItemArr = [];
        }
        // 规范化坐标轴数值
        var array = standardAxisNumber(this.maxValue, 0, 8);
        this.maxValue = array[0];
        this.minValue = array[1];

        this.createTitle();
        this.createAxisNumAndTick(array);
        this.createColumns();
        // this.startColumns();
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
            TweenMax.to(item.position, 0.8, {
                x: item.userData['x'],
                delay: index * 0.2 + 0.4,
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
        this.columnNumItemArr.map(function (item, index) {
            TweenMax.to(item.position, 0.8, {
                y: item.userData['y'],
                delay: index * 0.2 + 0.2,
                ease: Power3.easeInOut,
                onStartParams: [item],
                onStart: function (temp) {
                    TweenMax.to(temp.material, 0.8, {
                        opacity: 1,
                        ease: Power3.easeInOut
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
            opacity: 0
        });
        this.titleContainer.add(new THREE.Mesh(g, m));

        var obj = this.createTxtMaterial(200, 64, 0, 36, 'center', true, '#2cc1ff');
        var title = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 64), obj['material']);
        obj['context'].clearRect(0, 0, 200, 64);
        obj['context'].fillText('异常件概览', 100, 32);
        obj['material'].map.needsUpdate = true;
        this.titleContainer.add(title);

        var obj = this.createTxtMaterial(300, 64, 0, 24, 'center', true, '#2cc1ff');
        var subTitle = new THREE.Mesh(new THREE.PlaneBufferGeometry(300, 64), obj['material']);
        obj['context'].clearRect(0, 0, 300, 64);
        obj['context'].fillText('EXCEPTIONAL OVERVIEW', 150, 32);
        obj['material'].map.needsUpdate = true;
        subTitle.position.y = -40;
        this.titleContainer.add(subTitle);

        // var m = new THREE.MeshBasicMaterial({
        //     color: 0x2cc1ff
        // });
        // new THREE.FontLoader().load('fonts/helvetiker_regular.typeface.json', function (font) {
        //     var txtG = new THREE.TextGeometry('异常件概览', {
        //         font: font,
        //         size: 18,
        //         height: 6
        //     });
        //     this.titleContainer.add(new THREE.Mesh(txtG, m));
        //
        //     txtG = new THREE.TextGeometry('EXCEPTIONAL OVERVIEW', {
        //         font: font,
        //         size: 12,
        //         height: 6
        //     });
        //     this.titleContainer.add(new THREE.Mesh(txtG, m));
        // });
    }

    //------------------------------------ 创建刻度轴 --------------------------------------

    // 创建刻度点和坐标轴数值
    p.createAxisNumAndTick = function (array) {
        var splitNum = array[3];
        var space = columnH / splitNum;

        // axisNum
        for (var i = 0; i <= splitNum; i++) {
            var container = new THREE.Object3D();
            container.position.set(0, i * space, 0);
            container.userData['x'] = -220;
            this.container.add(container);
            this.numItemArr.push(container);

            var obj = this.createTxtMaterial(128, 32, 0, 26, 'right', false, '#2ca3ff');
            var numItem = new THREE.Mesh(new THREE.PlaneGeometry(128, 32), obj['material']);
            container.add(numItem);

            var value = array[1] + i * array[2] + '';
            obj['context'].clearRect(0, 0, 128, 32);
            obj['context'].fillText(value, 70, 20);
            obj['material'].map.needsUpdate = true;

            var g = new THREE.Geometry();
            g.vertices.push(new THREE.Vector3(30, 0, 0));
            var m = new THREE.PointsMaterial({
                color: 0xffff00,
                size: 10,
                transparent: true,
                opacity: 0
            });
            container.add(new THREE.Points(g, m));
        }
    }

    p.createColumns = function () {
        var cur = this;

        this.columnArr = [];
        this.lightColumnArr = [];
        this.dateItemArr = [];
        this.columnNumItemArr = [];
        this.columnItems = [];

        this.datas.map(function (item, index) {
            // 第一列的容器
            var column1Container = new THREE.Object3D();
            // column1Container.scale.y = 0;
            column1Container.position.x = ((columnW * 2 + 30) + 70) * index - 90;
            cur.container.add(column1Container);
            cur.columnArr.push(column1Container);

            // 新增的异常快件
            var offsetY = item['left'] / cur.maxValue * columnH;
            var newColumn = cur.createColumnItem(0x00fff6, 0.5, offsetY * 2, 'column1');
            newColumn.scale.y = (item['errorNum'] - item['left']) / cur.maxValue;
            // newColumn.position.y = item['left'] / cur.maxValue * columnH;
            column1Container.add(newColumn);
            newColumn.userData['clickable'] = true;
            cur.columnItems.push(newColumn);

            cur.createColumnNumAndTxt(item, 'errorNum', '异常件量', column1Container);

            // 昨日遗留的异常快件
            if (item['left'] > 0) {
                var leftColumn = cur.createColumnItem(0x2996f6, 0.8, 0, 'column3');
                leftColumn.scale.y = item['left'] / cur.maxValue;
                column1Container.add(leftColumn);
                leftColumn.userData['clickable'] = true;
                cur.columnItems.push(leftColumn);

                cur.createColumnNumAndTxt(item, 'left', '昨日未处理', column1Container);
            }

            // 第一列的光柱
            // var lightColumn = cur.createLightColumnItem(index);
            // lightColumn.scale.y = item['errorNum'] / cur.maxValue;
            // column1Container.add(lightColumn);
            // cur.lightColumnArr.push(lightColumn);

            // 第一列的线框
            // var lineColumn = cur.createLineColumnItem();
            // lineColumn.position.y = -3;
            // lineColumn.scale.y = item['errorNum'] / cur.maxValue;
            // column1Container.add(lineColumn);

            // 第二列的容器
            var column2Container = new THREE.Object3D();
            // column2Container.scale.y = 0;
            column2Container.position.x = ((columnW * 2 + 30) + 70) * index - 60 + columnW;
            cur.container.add(column2Container);
            cur.columnArr.push(column2Container);

            // 未处理的快件
            var noSolveColumn = cur.createColumnItem(0x0072c2, 0.6, 0, 'column2');
            noSolveColumn.scale.y = item['noSolveNum'] / cur.maxValue;
            column2Container.add(noSolveColumn);
            noSolveColumn.userData['clickable'] = true;
            cur.columnItems.push(noSolveColumn);

            cur.createColumnNumAndTxt(item, 'noSolveNum', '未处理', column2Container);

            // 第二列的光柱
            // var lightColumn = cur.createLightColumnItem(index);
            // lightColumn.scale.y = item['noSolveNum'] / cur.maxValue;
            // column2Container.add(lightColumn);
            // cur.lightColumnArr.push(lightColumn);

            // 第二列的线框
            // var lineColumn = cur.createLineColumnItem();
            // lineColumn.position.y = -3;
            // lineColumn.scale.y = item['noSolveNum'] / cur.maxValue;
            // column2Container.add(lineColumn);

            var date = cur.createDate(item['date']);
            date.position.x = ((columnW * 2 + 30) + 55 ) * index - 30;
            cur.container.add(date);
            cur.dateItemArr.push(date);

            //
            // column1Container.children.map(function (child) {
            //     child.material && (child.material.opacity = 0);
            // });
            // column2Container.children.map(function (child) {
            //     child.material && (child.material.opacity = 0);
            // });
        });
    }

    //------------------------------------ 创建列的文本和数字 --------------------------------------

    p.createColumnNumAndTxt = function (item, key, txt, container) {
        var cur = this;
        var numMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0
        });

        var obj = this.createTxtMaterial(128, 32, 1, 18, 'center', true, '#ffffff');
        var errorTxt = new THREE.Mesh(new THREE.PlaneBufferGeometry(128, 32), obj['material']);
        errorTxt.position.y = item[key] / this.maxValue * columnH - 20;
        errorTxt.position.z = columnW / 2 + 5;
        obj['context'].clearRect(0, 0, 128, 32);
        obj['context'].fillText(txt, 64, 22);
        obj['material'].map.needsUpdate = true;
        container.add(errorTxt);

        // var obj = this.createTxtMaterial(128, 32, 1, 32, 'center', true, '#ffffff');
        // var numTxt = new THREE.Mesh(new THREE.PlaneBufferGeometry(128, 32), obj['material']);
        // numTxt.position.x = -columnW / 2 + 45;
        // numTxt.position.y = item[key] / this.maxValue * columnH;
        // numTxt.rotation.x = -Math.PI / 2;
        // // numTxt.position.z = columnW / 2 + 5;
        // obj['context'].clearRect(0, 0, 128, 32);
        // obj['context'].fillText(item[key], 64, 26);
        // obj['material'].map.needsUpdate = true;
        // container.add(numTxt);
        var txtG = new THREE.TextGeometry(item[key], {
            font: this.resourcesMap['font']['result'],
            size: 26,
            height: 10
        });
        var num = new THREE.Mesh(txtG, numMaterial);
        num.position.x = -columnW / 2 + 5;
        num.position.y = item[key] / cur.maxValue * columnH;
        num.userData['y'] = item[key] / cur.maxValue * columnH + 20;
        // if (key == 'left') {
        //     num.position.z = columnW / 2 + 5;
        // }
        container.add(num);
        this.columnNumItemArr.push(num);
    }

    //------------------------------------ 创建下面的日期 --------------------------------------

    p.createDate = function (date) {
        var container = new THREE.Object3D();
        container.position.z = -500;
        container.userData['z'] = columnW * 1.3;
        container.rotation.x = -Math.PI / 2;

        // 列下面的小点
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
        point.position.set(0, 0, 30);
        container.add(point);

        // 列下面的日期
        var g = new THREE.PlaneBufferGeometry(200, 70);
        var m = new THREE.MeshBasicMaterial({
            map: this.resourcesMap['date']['result'],
            transparent: true,
            opacity: 0
        });
        container.add(new THREE.Mesh(g, m));

        var obj = this.createTxtMaterial(128, 32, 0, 18, 'center', false, '#2ca3ff');
        var dateItem = new THREE.Mesh(new THREE.PlaneBufferGeometry(150, 62.5), obj['material']);
        obj['context'].clearRect(0, 0, 128, 32);
        obj['context'].fillText(date, 65, 22);
        obj['material'].map.needsUpdate = true;
        container.add(dateItem);

        return container;
    }

    //------------------------------------- 创建柱子，包括默认柱、线柱、光柱 -------------------------------------

    p.createColumnItem = function (color, opacity, offsetY) {
        var material = new THREE.ShaderMaterial({
            uniforms: {
                color:   { type: "c", value: new THREE.Color(color) },
                opacity: { type: "f", value: 1 },
                textureMap: { value: this.resourcesMap['column1']['result'] },
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

        var g = new THREE.BoxBufferGeometry(columnW, columnH, columnW);
        var positionArr = g.attributes.position.array;
        for (var i = 1; i < positionArr.length; i += 3) {
            positionArr[i] += columnH / 2 + offsetY;
        }

        return new THREE.Mesh(g, material);

        // var geometry = new THREE.BoxGeometry(columnW, columnH, columnW);
        // geometry.vertices.map(function (vector3) {
        //     vector3.y += columnH / 2 + offsetY;
        // });
        // var material = new THREE.MeshLambertMaterial({
        //     color: color,
        //     transparent: true,
        //     opacity: 1
        // });
        // material.userData['opacity'] = 1;
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
        var geometry = new THREE.BoxGeometry(columnW, columnH, columnW, 2, a, 2);
        var g = new THREE.BufferGeometry();
        g.fromGeometry(geometry);
        g.userData = {};
        g.userData['center'] = -300 - 150 * t;
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

            positionArr[i3 + 1] += columnH / 2;

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
    p.createLineColumnItem = function () {
        var g = new THREE.BoxGeometry(columnW + 15, columnH + 15, columnW + 15);
        g.vertices.map(function (vector3) {
            vector3.y += (columnH + 15) / 2;
        });
        var m = new THREE.MeshBasicMaterial({
            color: 0x00aeff,
            blending: THREE.NormalBlending,
            wireframe: true,
            transparent: true,
            // opacity: .15
        });
        return new THREE.Mesh(g, m);
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
        t.geometry.userData['center'] > columnH && (t.geometry.userData['center'] = -columnH);

        var i = opacityArr.length;
        var i3 = i * 3;
        while (i3 > 0) {
            i--;
            i3 -= 3;

            var y = 1 - Math.abs(t.geometry.userData['center'] - positionArr[i3 + 1]) / t.geometry.userData['r'];
            opacityArr[i] = .9 * y;
        }
        t.geometry.attributes.aOpacity.needsUpdate = true;
    }

    p.startColumns = function () {
        this.columnArr.map(function (item, index) {
            TweenMax.to(item.scale, 1.6, {
                y: 1,
                delay: index * 0.4,
                ease: Power3.easeOut,
                onStartParams: [item],
                onStart: function (temp) {
                    temp.children.map(function (child) {
                        if (child.material) {
                            if (child.material.userData['opacity']) {
                                child.material.opacity = child.material.userData['opacity'];
                            } else {
                                child.material.opacity = 1;
                            }
                        }
                    });
                }
            });
            // TweenMax.to(item.rotation, 1.5, {
            //     y: -0.2,
            //     delay: index * 0.2
            // });
        });
        // this.columnNames.map(function (item, index) {
        //     TweenMax.to(item.rotation, 3, {
        //         y: 0,
        //         delay: index * 0.2 + 1
        //     });
        //     TweenMax.to(item.userData['material'], 3, {
        //         opacity: 1,
        //         delay: index * 0.2 + 1
        //     });
        // });
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

    Charts.Chart1 = Chart1;
})();