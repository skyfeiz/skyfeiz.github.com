this.jf = this.jf || {};

/**
 * 该示例中，想要达到改变相机轨迹的同时改变相机的角度(lookAt)，以达到逼真的穿梭效果，但是发现相机的角度并不好计算，所以未实现
 */

(function () {

    var Test1 = function () {
        dym.ThreeBase.call(this, document.getElementById('container3d'));
        this.init();
    }

    var p = Test1.prototype = Object.create(dym.ThreeBase.prototype);
    Test1.prototype.constructor = Test1;

    p.init = function () {
        this.canOrbit = false;
        this.threeBaseInit();

        var cur = this;
        // document.onclick = function () {
        //     var startP = cur.mesh.position;//cur.camera.position;
        //     var controlP = new THREE.Vector3(0, 0, -1000);
        //     var endP = new THREE.Vector3(-500, 0, -1000);
        //     var curve = new THREE.QuadraticBezierCurve3(startP, controlP, endP);
        //
        //     var g = new THREE.Geometry();
        //     g.vertices = curve.getPoints(70);
        //     var m = new THREE.LineBasicMaterial({
        //         color: 0xffffff
        //     });
        //     cur.scene.add(new THREE.Line(g, m));
        //
        //     var lineCurve = new THREE.LineCurve(controlP, endP);
        //
        //     cur.per = 0;
        //     var ppp = curve.getPoint(0.6);
        //     console.log(999)
        //     // cur.mesh.position.set(ppp.x, ppp.y, ppp.z);
        //     // cur.mesh.position.x = ppp.x;
        //     // cur.mesh.position.z = ppp.z;
        //
        //     TweenMax.to(cur, 5, {
        //         per: 1,
        //         onUpdate: function () {
        //             console.log(cur.per)
        //             var p = curve.getPoint(cur.per);
        //             cur.mesh.position.x = p.x;
        //             cur.mesh.position.z = p.z;
        //             // console.log(p)
        //         },
        //         // ease: Power2.easeInOut
        //         ease: Linear.easeNone
        //     });
        // }
        setTimeout(function () {
            var startP = cur.camera.position;
            var controlP = new THREE.Vector3(0, 0, 0);
            var endP = new THREE.Vector3(-500, 0, 0);
            var curve = new THREE.QuadraticBezierCurve3(startP, controlP, endP);

            // var g = new THREE.Geometry();
            // g.vertices = curve.getPoints(70);
            // var m = new THREE.LineBasicMaterial({
            //     color: 0xffffff
            // });
            // cur.scene.add(new THREE.Line(g, m));
            //
            var lineCurve = new THREE.LineCurve(controlP, endP);

            cur.per = 0;

            cur.curve = curve;
            cur.lineCurve = lineCurve;
            // var ppp = curve.getPoint(0.6);
            // cur.mesh.position.set(ppp.x, ppp.y, ppp.z);
            // cur.mesh.position.x = ppp.x;
            // cur.mesh.position.z = ppp.z;

            // TweenMax.to(cur, 5, {
            //     per: 1,
            //     onUpdate: function () {
            //         // console.log(cur.per)
            //         var p = curve.getPoint(cur.per);
            //         cur.mesh.position.x = p.x;
            //         cur.mesh.position.z = p.z;
            //         // console.log(p)
            //     },
            //     // ease: Power2.easeInOut
            //     ease: Linear.easeNone
            // });
            TweenMax.to(cur.camera.position, 5, {
                bezier: [{x: 0, y: 0, z: 1000}, {x: 0, y: 0, z: 0}, {x: -500, y: 0, z: 0}],
                onComplete: function () {
                    cur.camera.position.set(-500, 0, 0);
                },
                ease: Linear.easeNone
            });
            TweenMax.to(cur, 5, {
                per: 1,
                onUpdate: function () {
                    var p = lineCurve.getPoint(cur.per);
                    // p.y = 0;
                    cur.camera.lookAt(p);
                    // console.log(p);
                },
                onComplete: function () {
                    // cur.camera.lookAt(new THREE.Vector3(endP.x, endP.y, endP.z));
                },
                ease: Linear.easeNone
            });
        }, 2000);
    }

    p.initObject3D = function () {
        this.groundContainer = new THREE.Object3D();
        this.scene.add(this.groundContainer);

        this.createGroundGridLine();
        this.createObj();
    }

    p.reset3D = function () {
        // this.camera.position.y = 0;
    }

    p.createObj = function () {
        var m = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        var g = new THREE.BoxGeometry(20, 300, 20);
        var mesh = new THREE.Mesh(g, m);
        mesh.position.set(0, -250, 0);
        this.scene.add(mesh);

        this.mesh = mesh;

        var m = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        g = new THREE.BoxGeometry(20, 300, 20);
        mesh = new THREE.Mesh(g, m);
        mesh.position.set(-500, -250, -1000);
        this.scene.add(mesh);

        var m = new THREE.MeshBasicMaterial({
            color: 0xffff00
        });
        g = new THREE.BoxGeometry(20, 300, 20);
        mesh = new THREE.Mesh(g, m);
        mesh.position.set(500, -250, -2000);
        this.scene.add(mesh);

        var m = new THREE.MeshBasicMaterial({
            color: 0x00ffff
        });
        g = new THREE.BoxGeometry(20, 300, 20);
        mesh = new THREE.Mesh(g, m);
        mesh.position.set(-500, -250, -3000);
        this.scene.add(mesh);

        var m = new THREE.MeshBasicMaterial({
            color: 0xff00ff
        });
        g = new THREE.BoxGeometry(20, 300, 20);
        mesh = new THREE.Mesh(g, m);
        mesh.position.set(500, -250, -4000);
        this.scene.add(mesh);

        var m = new THREE.MeshBasicMaterial({
            color: 0x123456
        });
        g = new THREE.BoxGeometry(20, 300, 20);
        mesh = new THREE.Mesh(g, m);
        mesh.position.set(-500, -250, -5000);
        this.scene.add(mesh);
    }

    p.createGroundGridLine = function () {
        var geometry = new THREE.Geometry();

        // 横向线
        var p1 = new THREE.Vector3(-5000, 0, 0);
        var p2 = new THREE.Vector3(5000, 0, 0);
        geometry.vertices.push(p1);
        geometry.vertices.push(p2);
        for (var i = 0; i <= 100; i++) {
            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
            line.position.y = (i * 100) - 5000;
            this.groundContainer.add(line);
        }

        // 纵向线，由于纵向线需要有流光效果，所以这里用到了LineCurve
        // 这里有几个坑，不能把p1、p2放到循环体外面创建，然后在循环体内改变x值，暂时不知道什么道理
        // 不能把geometry，不能把geometry放到循环体外面创建，暂时不知道什么道理
        this.verLines = [];
        for (var i = 0; i <= 100; i++) {
            p1 = new THREE.Vector3(i * 100 - 5000, -5000, 0);
            p2 = new THREE.Vector3(i * 100 - 5000, 5000, 0);
            var lineCurve = new THREE.LineCurve(p1, p2);
            var g = new THREE.Geometry();
            g.vertices = lineCurve.getPoints(70);

            var line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
            line.userData['lineCurve'] = lineCurve;
            this.groundContainer.add(line);
            this.verLines.push(line);
        }
        this.groundContainer.position.y = -250;
        this.groundContainer.position.z = -4000;
        this.groundContainer.rotation.x = Math.PI / 2;
    }

    p.renderFun = function () {
        // console.log(this.curve, this.lineCurve)
        // if (this.curve && this.lineCurve) {
        //     this.per += 0.001;
        //     if (this.per >= 1) {
        //         this.curve = this.lineCurve = null;
        //     }
        //     var p = this.curve.getPoint(this.per);
        //     this.mesh.position.x = p.x;
        //     this.mesh.position.z = p.z;
        // }
    }

    jf.Test1 = Test1;
})();