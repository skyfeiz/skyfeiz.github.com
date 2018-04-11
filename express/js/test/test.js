this.jf = this.jf || {};

/**
 * 该示例中，测试了通过代码生成简单几何体、简单几何体之间的转换等功能
 */

(function () {

    var Test = function () {
        dym.ThreeBase.call(this, document.getElementById('container3d'));
        this.init();
    }

    var p = Test.prototype = Object.create(dym.ThreeBase.prototype);
    Test.prototype.constructor = Test;

    p.init = function () {
        var array = [
            {id: 'spark', type: 'texture', url: 'image/spark.png'}
        ];
        this.threeBaseInit(array);
    }

    p.particleMaterialCreate = function()
    {
        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color:    {type: 'c', value: new THREE.Color(0xffffff)},
                opacity:  {type: 'f', value: 1},
                texture:  {type: 't', value: this.resourcesMap['spark']['result']}
            },
            vertexShader:   document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,
            blending:       THREE.AdditiveBlending,
            depthTest:      false,
            transparent:    true
        });
    }

    p.initObject3D = function () {
        this.particleMaterialCreate();

        var geometry = new THREE.BufferGeometry();

        var angle = Math.atan2(60, 300);

        var pointNum = 4000;
        var opacityArr = new Float32Array(pointNum);
        var positionArr = new Float32Array(pointNum * 3);

        for (var i = 0; i < 80; i++) {

            var y = 300 * i / 80;
            // 当前高度
            var h = 300 - y;
            // 当前半径
            var r = Math.tan(angle) * h;

            for (var j = 0; j < 50; j++) {

                var a = 360 * j / 50 * Math.PI / 180;
                var x = r * Math.cos(a);
                var z = r * Math.sin(a);

                opacityArr[i * 50 + j] = 1;//0.5 - (i * 50) / pointNum;

                positionArr[(i * 50 + j) * 3] = x;
                positionArr[(i * 50 + j) * 3 + 1] = y;
                positionArr[(i * 50 + j) * 3 + 2] = z;
            }
        }
        geometry.addAttribute('position', new THREE.BufferAttribute(positionArr, 3));
        geometry.addAttribute('aOpacity', new THREE.BufferAttribute(opacityArr, 1));

        var material = new THREE.PointsMaterial({color: 0xff0000, size: 3});
        // this._mesh = new THREE.Points(geometry, material);
        this._mesh = new THREE.Points(geometry, this.particleMaterial);
        this._mesh.position.y = -100;
        this.scene.add(this._mesh);


        // 上面是一个通过粒子组成的圆锥，下面是将其展开为平面的最终坐标，具体展开动画在testRender方法中
        // 其实可以再进行扩展，比如先将圆锥展开为圆柱，然后再展开为平面


        // 终点位置
        var endPositionArr = new Float32Array(positionArr.length);
        for (var i = 0; i < 80; i++) {

            var y = 300 * i / 80;

            for (var j = 0; j < 50; j++) {
                var x = -60 * Math.PI + j * (2 * Math.PI * 60 / 50);
                var z = 60;

                endPositionArr[(i * 50 + j) * 3] = x;
                endPositionArr[(i * 50 + j) * 3 + 1] = y;
                endPositionArr[(i * 50 + j) * 3 + 2] = z;
            }
        }
        this._endPositionArr = endPositionArr;

        // 下面是华仔写的，用PlaneBufferGeometry包成一个圆锥体的示例
        // var u = 10, v = 10, H = 200, W = 40;
        // var g = new THREE.PlaneBufferGeometry(100, 100, u-1, v-1);
        // var position = new Float32Array(u*v*3);
        // for(var i=0; i<v; i++){
        //     var r = (1-i/(v-1))*W;
        //     for(var j=0; j<u; j++){
        //         var a = j/(u-1) * Math.PI * 2;
        //
        //         position[(i*u + j)*3 + 0] = Math.cos(a) * r;
        //         position[(i*u + j)*3 + 1] = i/(v-1) * H;
        //         position[(i*u + j)*3 + 2] = Math.sin(a) * r;
        //     }
        // }
        // g.addAttribute("position", new THREE.BufferAttribute(position, 3));
        // var m = new THREE.MeshBasicMaterial({ color: new THREE.Color("red") });
        //
        // this.scene.add(new THREE.Mesh(g,m));
    }

    p.testRender = function () {
        var positionArr = this._mesh.geometry.attributes.position.array;

        var i = 4000;
        var i3 = i * 3;
        while (i3 > 0) {
            i--;
            i3 -= 3;

            positionArr[i3] += (this._endPositionArr[i3] - positionArr[i3]) * 0.008;
            positionArr[i3 + 1] += (this._endPositionArr[i3 + 1] - positionArr[i3 + 1]) * 0.008;
            positionArr[i3 + 2] += (this._endPositionArr[i3 + 2] - positionArr[i3 + 2]) * 0.008;
        }

        this._mesh.geometry.attributes.position.needsUpdate = true;
    }

    p.renderFun = function () {
        if (this._endPositionArr) {
            this.testRender();
        }
    }

    jf.Test = Test;
})();