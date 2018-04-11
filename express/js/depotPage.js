this.Exhibition = this.Exhibition || {};

var radian = Math.PI / 180;

var positionInfo = [
    {x: 0,     y: -200, z: 0},
    {x: -800,  y: -200, z: -3000},
    {x: 800,   y: -200, z: -6000},
    {x: -800,  y: -200, z: -9000}
];

// 是否单个组件测试
var singleTest = false;

(function() {

    var DepotPage = function () {
        dym.ThreeBase.call(this, document.getElementById('container3d'));
        this.init();
    }

    var p = DepotPage.prototype = Object.create(dym.ThreeBase.prototype);
    DepotPage.prototype.constructor = DepotPage;
    
    p.init = function () {
        var cur = this;
        this.canOrbit = singleTest;

        var loader = new THREE.OBJLoader();
        loader.load('model/CangKu2.obj', function (object) {
            cur.depotModel = object;
            // console.log(object);

            var array = [
                // {id: 'spark', type: 'texture', url: 'image/spark.png'},
                // {id: 'spark1', type: 'texture', url: 'image/spark1.png'},
                {id: 'title', type: 'texture', url: 'image/title.png'},
                {id: 'date', type: 'texture', url: 'image/date.png'},
                {id: 'ground', type: 'texture', url: 'image/errorPage/ground1.jpg'},
                {id: 'column1', type: 'texture', url: 'image/chartTexture/column1.png'},
                // {id: 'column2', type: 'texture', url: 'image/chartTexture/column2.png'},
                // {id: 'cylinder1', type: 'texture', url: 'image/chartTexture/cylinder1.png'},
                // {id: 'cylinder2', type: 'texture', url: 'image/chartTexture/cylinder2.png'},
                {id: 'font', type: 'font', url: 'fonts/helvetiker_regular.typeface.json'}
            ];
            cur.threeBaseInit(array);
        });
    }

    p.initObject3D = function() {
        $('.loading').fadeOut();

        this.groundContainer = new THREE.Object3D();
        this.scene.add(this.groundContainer);

        this.createParticleMaterial();

        this.createLight();
        this.createDepot();
        // this.createBgParticles();
        this.createGroundGridLine();
        this.createGroundTexture();
        // this.createGroundGridLineParticles();
        // this.startGroundGridLineParticles();

        this.createCharts();
        this.chartIndex = -1;
        var cur = this;
        setTimeout(function () {
            if (!singleTest) {
                cur.moveCamera(0);
            }
        }, 1000);

        // 鼠标交互
        this.mouse = new THREE.Vector2(1, 1);
        this.raycaster = new THREE.Raycaster();
        document.addEventListener('mousemove', function(event) {
            cur.onDocumentMouseMove(event);
        });
        document.addEventListener('click', function(event) {
            cur.onDocumentMouseClick(event);
        });
    }

    p.reset3D = function() {
        if (singleTest) {
            this.camera.position.set(-200, 300, 1100);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        } else {
            this.camera.position.set(-800, 300, 4100);
            this.camera.lookAt(new THREE.Vector3(-600, 0, 3000));
        }
    }

    p.renderFun = function() {
        // this.bgParticleRender();
        // this.groundGridLineParticlesRender();

        // this.charts.map(function (chart) {
        //     chart.render();
        // });


        // 鼠标交互
        this.raycaster.setFromCamera(this.mouse, this.camera);
        var intersects = this.raycaster.intersectObjects(this.columnItems);
        if (intersects.length > 0) {
            if (this.currentItem != intersects[0].object) {
                if (this.currentItem) {
                    if (this.currentItem.material.color) {
                        this.currentItem.material.color.setHex(this.currentItem.userData['currentColor']);
                    } else {
                        this.currentItem.material.uniforms.color.value.setHex(this.currentItem.userData['currentColor']);
                    }
                }

                this.currentItem = intersects[0].object;
                if (this.currentItem.material.color) {
                    this.currentItem.userData['currentColor'] = this.currentItem.material.color.getHex();
                    this.currentItem.material.color.setHex(0xfffd00);
                } else {
                    this.currentItem.userData['currentColor'] = this.currentItem.material.uniforms.color.value.getHex();
                    this.currentItem.material.uniforms.color.value.setHex(0xfffd00);
                }
            }
        } else {
            if (this.currentItem) {
                if (this.currentItem.material.color) {
                    this.currentItem.material.color.setHex(this.currentItem.userData['currentColor']);
                } else {
                    this.currentItem.material.uniforms.color.value.setHex(this.currentItem.userData['currentColor']);
                }
            }
            this.currentItem = null;
        }
    }

    p.onDocumentMouseClick = function (event) {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        if (this.currentItem && this.currentItem.userData['clickable']) {
            // this.moveCamera(this.chartIndex + 1);
            // console.log()
            menuClick(3 - (this.chartIndex + 1), $($('.menu-icon')[3 - (this.chartIndex + 1)]));
        }
    }
    p.onDocumentMouseMove = function (event) {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    //------------------------------ 创建光源 ---------------------------

    p.createLight = function () {
        var directionalLight = new THREE.DirectionalLight(0x888888);
        directionalLight.position.set(50, 50, 50);
        directionalLight.position.normalize();
        this.scene.add(directionalLight);

        var ambientLight = new THREE.AmbientLight(0x888888);
        this.scene.add(ambientLight);


        // var directionalLight = new THREE.DirectionalLight(0xff0000);
        // directionalLight.position.set(0, 200, 0);
        // directionalLight.position.normalize();
        // this.scene.add(directionalLight);

        // var pointLight = new THREE.PointLight(0xff0000, 100, 3800);
        // pointLight.position.set(0, 600, 1000);
        // this.scene.add(pointLight);
    }

    //------------------------------ 处理场景中的组件 ---------------------------

    p.createCharts = function () {
        this.charts = [];

        this.chart1 = new Charts.Chart11(this.scene, this.resourcesMap);
        this.charts.push(this.chart1);

        this.chart2 = new Charts.Chart22(this.scene, this.resourcesMap);
        this.charts.push(this.chart2);

        this.chart3 = new Charts.Chart33(this.scene, this.resourcesMap);
        this.charts.push(this.chart3);

        this.chart4 = new Charts.Chart44(this.scene, this.resourcesMap);
        this.charts.push(this.chart4);
    }

    p.moveCamera = function (index) {
        var cur = this;
        var direction = this.chartIndex < index ? 'forward' : 'back';

        this.chartIndex = index;
        if (this.chartIndex > 4) return;
        var newChartP = positionInfo[this.chartIndex];

        var startP = this.camera.position;
        var controlP = direction == 'forward' ?
            {x: startP.x - 100, y: startP.y, z: startP.z - 1500} :
            {x: startP.x, y: startP.y, z: startP.z + 1500};
        var endP = {x: newChartP.x - 200, y: newChartP.y + 550, z: newChartP.z + 1100};

        var easeType = direction == 'forward' ? Power2.easeInOut : Power1.easeInOut;

        this.chartRenderFlag = false;
        TweenMax.to(this.camera.position, 3, {
            // x: endP.x,
            // y: endP.y,
            // z: endP.z,
            bezier: [{x: startP.x, y: startP.y, z: startP.z}, controlP, endP],
            ease: easeType,
            onUpdate: function () {
                cur.camera.lookAt(new THREE.Vector3(cur.camera.position.x + 200, 0, cur.camera.position.z - 1100));

                if (Math.abs(cur.camera.position.z - endP.z) < 700 && !cur.chartRenderFlag) {
                    cur.chartRenderFlag = true;
                    cur.charts[cur.chartIndex].startRender();
                }
            },
            onComplete: function () {
                cur.columnItems = cur.charts[cur.chartIndex].columnItems;
            }
        });
    }

    //------------------------------ 创建粒子材质 ---------------------------

    p.createParticleMaterial = function()
    {
        // this.particleMaterial = new THREE.ShaderMaterial({
        //     uniforms: {
        //         color:    {type: 'c', value: new THREE.Color(0xffffff)},
        //         opacity:  {type: 'f', value: 1},
        //         texture:  {type: 't', value: this.resourcesMap['spark']['result']}
        //     },
        //     vertexShader:   dym.shader.point.vertexShader,
        //     fragmentShader: dym.shader.point.fragmentShader,
        //     blending:       THREE.AdditiveBlending,
        //     depthTest:      false,
        //     transparent:    true
        // });
        //
        // this.particleMaterial1 = new THREE.ShaderMaterial({
        //     uniforms: {
        //         color:    {type: 'c', value: new THREE.Color(0xffffff)},
        //         opacity:  {type: 'f', value: 1},
        //         texture:  {type: 't', value: this.resourcesMap['spark1']['result']}
        //     },
        //     vertexShader:   dym.shader.point.vertexShader,
        //     fragmentShader: dym.shader.point.fragmentShader,
        //     blending:       THREE.AdditiveBlending,
        //     depthTest:      false,
        //     transparent:    true
        // });
    }

    //------------------------------ 模型 ---------------------------
    
    p.createDepot = function () {
        var m = new THREE.MeshLambertMaterial({
            color: 0x264292,
            transparent: true,
            opacity: 0.4
        });

        for (var i = 0; i < this.depotModel.children.length; i++) {
            this.depotModel.children[i].material = m;
        }
        this.depotModel.position.set(0, -250, -4000);
        this.depotModel.rotation.y = Math.PI / 2;
        this.scene.add(this.depotModel);
    }

    //------------------------------ 创建背景粒子 ---------------------------

    p.createBgParticles = function() {
        var particleNum = 2500;
        var positionArr = new Float32Array(particleNum * 3);
        var vYArr = new Float32Array(particleNum);
        var colorArr = new Float32Array(particleNum * 3);
        var opacityArr = new Float32Array(particleNum);
        var sizeArr = new Float32Array(particleNum);

        var color = new THREE.Color(0x710488);

        var i = particleNum;
        var i3 = i * 3;
        while (i3 > 0) {
            i--;
            i3 -= 3;

            // 计算位置，其中Y值需要根据X值计算，以保证随机生成的粒子位置在一个钝角范围内。
            positionArr[i3] = 6000 * (Math.random() - 0.5);
            var offsetY = positionArr[i3] * Math.tan(20 * Math.PI / 180);
            if (positionArr[i3] >= 0) {
                positionArr[i3 + 1] = 2300 * (Math.random() + 0.5) + offsetY;
            } else {
                positionArr[i3 + 1] = 2300 * (Math.random() + 0.5) - offsetY;
            }
            positionArr[i3 + 2] = -6000 * Math.random();

            vYArr[i] = 6 * Math.random() + 5;
            opacityArr[i] = 0.5 + 0.5 * Math.random();
            sizeArr[i] = 5 * Math.random() + 2;
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

        this.bgParticle = new THREE.Points(geometry, this.particleMaterial1);
        this.scene.add(this.bgParticle);
    }
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
            if (positionArr[i3 + 2] > -3000) {
                positionArr[i3 + 2] = -6000;
            }

            // if (i % 50 == 0) {
            //     colorArr[i3] = 164;
            //     colorArr[i3 + 1] = 18;
            //     colorArr[i3 + 2] = 195;
            // }
        }
        this.bgParticle.geometry.attributes.position.needsUpdate = true;
        this.bgParticle.geometry.attributes.aOpacity.needsUpdate = true;
        this.bgParticle.geometry.attributes.aColor.needsUpdate = true;
        this.bgParticle.geometry.attributes.size.needsUpdate = true;
    }

    //------------------------------ 创建地面贴图 ---------------------------

    p.createGroundTexture = function () {
        var groundTexture = this.resourcesMap['ground']['result'];
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(50, 50);
        groundTexture.anisotropy = 4;
        var groundMaterial = new THREE.MeshLambertMaterial({
            map: groundTexture,
            color: 0x012662,
            transparent: true,
            opacity: 0.6
        });
        var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(15000, 25000), groundMaterial);
        mesh.rotation.z = -Math.PI / 2;
        this.groundContainer.add(mesh);

        // this.groundContainer.add(new THREE.Mesh(
        //     new THREE.PlaneBufferGeometry(20000, 20000),
        //     new THREE.MeshBasicMaterial({
        //         color: 0x012662,
        //         transparent: true,
        //         opacity: 0.5
        //     })
        // ));
    }

    //------------------------------ 创建地面网格线 ---------------------------

    p.createGroundGridLine = function () {
        var geometry = new THREE.Geometry();

        // 横向线
        var p1 = new THREE.Vector3(-15000, 0, 0);
        var p2 = new THREE.Vector3(15000, 0, 0);
        geometry.vertices.push(p1);
        geometry.vertices.push(p2);
        for (var i = 0; i <= 300; i++) {
            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
            line.position.y = (i * 100) - 15000;
            this.groundContainer.add(line);
        }

        // 纵向线，由于纵向线需要有流光效果，所以这里用到了LineCurve
        // 这里有几个坑，不能把p1、p2放到循环体外面创建，然后在循环体内改变x值，暂时不知道什么道理
        // 不能把geometry，不能把geometry放到循环体外面创建，暂时不知道什么道理
        this.verLines = [];
        for (var i = 0; i <= 300; i++) {
            p1 = new THREE.Vector3(i * 100 - 15000, -15000, 0);
            p2 = new THREE.Vector3(i * 100 - 15000, 15000, 0);
            var lineCurve = new THREE.LineCurve(p1, p2);
            var g = new THREE.Geometry();
            g.vertices = lineCurve.getPoints(70);

            var line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
            line.userData['lineCurve'] = lineCurve;
            this.groundContainer.add(line);
            this.verLines.push(line);
        }
        this.groundContainer.position.y = -250;
        this.groundContainer.position.z = -9000;
        this.groundContainer.rotation.x = -Math.PI / 2;
        this.groundContainer.rotation.z = -Math.PI / 2;
    }

    //------------------------------ 创建地面网格线上的粒子 ---------------------------

    p.createGroundGridLineParticles = function() {
        this.groundGridLineParticlesArr = [];
        var array = this.verLines;
        for (var i = 0; i < array.length; i++) {
            if (i % 12 != 0) continue;
            var lineParticlesItem = this.createGroundGridLineParticlesItem(array[i], i / array.length);
            this.groundContainer.add(lineParticlesItem);
            lineParticlesItem.userData['cirV'] = 0;
            lineParticlesItem.userData['opacity'] = 0;
            this.groundGridLineParticlesArr.push(lineParticlesItem);
        }
    }

    p.createGroundGridLineParticlesItem = function(line, n) {
        var lineCurve = line.userData['lineCurve'];
        var particleNum = Math.ceil(lineCurve.getLength() / 3);
        var positionArr = new Float32Array(particleNum * 3);
        var colorArr = new Float32Array(particleNum * 3);
        var opacityArr = new Float32Array(particleNum);
        var sizeArr = new Float32Array(particleNum);
        var perArr = new Float32Array(particleNum);

        var color = new THREE.Color(0x004f75);

        var i = particleNum;
        var i3 = i * 3;
        while (i3 > 0) {
            i--;
            i3 -= 3;

            opacityArr[i] = 0;
            color.toArray(colorArr, i * 3);

            var t = (i / particleNum) * 0.3;
            perArr[i] = t;

            sizeArr[i] = 5 * t;
            var v = lineCurve.getPoint(t);
            positionArr[i3] = v.x;
            positionArr[i3 + 1] = v.y;
            positionArr[i3 + 2] = v.z;
        }

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positionArr, 3));
        geometry.addAttribute('aColor', new THREE.BufferAttribute(colorArr, 3));
        geometry.addAttribute('aOpacity', new THREE.BufferAttribute(opacityArr, 1));
        geometry.addAttribute('size', new THREE.BufferAttribute(sizeArr, 1));
        geometry.addAttribute('per', new THREE.BufferAttribute(perArr, 1));

        var particles = new THREE.Points(geometry, this.particleMaterial);
        particles.userData['lineCurve'] = lineCurve;
        return particles;
    }

    //------------------------------ 渲染地面网格线上的粒子 ---------------------------

    p.groundGridLineParticlesRender = function() {
        var cur = this;
        if (cur.groundGridLineParticlesArr) {
            cur.groundGridLineParticlesArr.map(function(lineParticlesItem, index) {
                cur.groundGridLineParticlesItemRender(lineParticlesItem);
            });
        }
    }
    p.groundGridLineParticlesItemRender = function(lineParticlesItem) {
        var lineCurve = lineParticlesItem.userData['lineCurve'];
        var cirV = lineParticlesItem.userData['cirV'];

        var positionArr = lineParticlesItem.geometry.attributes.position.array;
        var sizeArr = lineParticlesItem.geometry.attributes.size.array;
        var opacityArr = lineParticlesItem.geometry.attributes.aOpacity.array;
        var perArr = lineParticlesItem.geometry.attributes.per.array;
        var particleNum = sizeArr.length;

        var i = particleNum;
        var i3 = i * 3;
        while (i3 > 0) {
            i--;
            i3 -= 3;

            perArr[i] += cirV;
            if (perArr[i] > 1) perArr[i] = 0;
            var t = perArr[i];
            var v = lineCurve.getPoint(t);

            opacityArr[i] = lineParticlesItem.userData['opacity'] * t - 0.4;
            positionArr[i3] = v.x;
            positionArr[i3 + 1] = v.y;
            positionArr[i3 + 2] = v.z;
        }
        lineParticlesItem.geometry.attributes.position.needsUpdate = true;
        lineParticlesItem.geometry.attributes.aOpacity.needsUpdate = true;
        lineParticlesItem.geometry.attributes.size.needsUpdate = true;
    }

    p.startGroundGridLineParticles = function() {
        if (this.groundGridLineParticlesArr) {
            this.groundGridLineParticlesArr.map(function(lineParticlesItem, index) {
                TweenMax.to(lineParticlesItem.userData, 0.5, {
                    opacity: 1,
                    delay: 10 * Math.random() * 0.8,
                    onStartScope: lineParticlesItem,
                    onStart: function() {
                        this.userData['cirV'] = 0.0022;
                    }
                });
            });
        }
    }
    
    Exhibition.DepotPage = DepotPage;
    
})();




/**
 * 规范化坐标轴数值，当数值太大或出现负数时，此方法还有bug
 * @param cormax    数据中的最大值
 * @param cormin    数据中的最小值
 * @param cornumber 坐标轴划分段数
 * @returns {[规范化之后的最大值,规范化之后的最小值,步长,规范之后的划分段数]}
 */
function standardAxisNumber(cormax, cormin, cornumber) {
    var corstep, tmpstep, tmpnumber, temp, extranumber;
    if (cormax <= cormin) {
        return [cormax, cormin, 0, cornumber];
    }

    // 计算原始步长
    corstep = (cormax - cormin) / cornumber;
    // 计算步长的数量级
    if (Math.pow(10, parseInt(Math.log(corstep) / Math.LN10)) == corstep) {
        temp = Math.pow(10, parseInt(Math.log(corstep) / Math.LN10));
    } else {
        temp = Math.pow(10, (parseInt(Math.log(corstep) / Math.LN10) + 1));
    }
    // 将步长修正到0-1之间
    tmpstep = (corstep / temp).toFixed(6);

    // 选取规范步长
    if (tmpstep >= 0 && tmpstep <= 0.1) {
        tmpstep = 0.1;
    } else if (tmpstep >= 0.100001 && tmpstep <= 0.2) {
        tmpstep = 0.2;
    } else if (tmpstep >= 0.200001 && tmpstep <= 0.25) {
        tmpstep = 0.25;
    } else if (tmpstep >= 0.250001 && tmpstep <= 0.5) {
        tmpstep = 0.5
    } else {
        tmpstep = 1;
    }
    // 把规范步长按数量级还原，也即最终步长
    tmpstep = tmpstep * temp;
    // 依据最终步长修正起点值
    if (parseInt(cormin / tmpstep) != (cormin / tmpstep)) {
        cormin = parseInt(cormin / tmpstep) * tmpstep;
    }
    // 依据最终步长修正终点值
    if (parseInt(cormax / tmpstep) != (cormax / tmpstep)) {
        cormax = parseInt(cormax / tmpstep + 1) * tmpstep;
    }

    // 计算最终的刻度数
    tmpnumber = (cormax - cormin) / tmpstep;

    // 最新计算的刻度数与传进来的刻度数不一致时，是否再做处理，视情况而定
    // if (tmpnumber < cornumber) {
    //     extranumber = cornumber - tmpnumber;
    //     tmpnumber = cornumber;
    //     if (extranumber % 2 == 0) {
    //         cormax = cormax + tmpstep * parseInt(extranumber / 2);
    //     } else {
    //         cormax = cormax + tmpstep * parseInt(extranumber / 2 + 1);
    //     }
    //     cormin = cormin - tmpstep * parseInt(extranumber / 2);
    // }
    // cornumber = tmpnumber;
    return [cormax, cormin, tmpstep, tmpnumber];
}