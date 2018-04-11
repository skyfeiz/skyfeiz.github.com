/* globals dym,Exhibition,THREE */
this.Exhibition = this.Exhibition || {};
(function(){
	var ChinaMap = function() {
		dym.ThreeBase.call(this, document.getElementById('container3d'));
		this.init();
	};

	var p = ChinaMap.prototype = Object.create(dym.ThreeBase.prototype);
    ChinaMap.prototype.constructor = ChinaMap;

    p.init = function() {
    	var _this = this;
        this.canOrbit = true;
        this.earthR = 260;
        this.cityNameAry = [];
        this.cityItemAry = [];
        var array = [
            {id: 'earth', type: 'texture', url: 'image/earth/china.png'},
            {id: 'spark', type: 'texture', url: 'image/spark.png'},
            {id: 'pointCir0', type: 'texture', url: 'image/pointCir.png'},
            {id: 'pointCir1', type: 'texture', url: 'image/pointCir1.png'}
        ];

        this.lineData = {
        	links:[
        		{"start": "北京", "end": "广州"},
                {"start": "北京", "end": "武汉"},
                {"start": "北京", "end": "长沙"},
                {"start": "北京", "end": "哈尔滨"},
                {"start": "北京", "end": "呼合浩特"},
                {"start": "北京", "end": "乌鲁木齐"},
                {"start": "北京", "end": "兰州"},
                {"start": "上海", "end": "合肥"},
                {"start": "上海", "end": "杭州"},
                {"start": "上海", "end": "西安"},
                {"start": "上海", "end": "西宁"},
                {"start": "济南", "end": "西安"},
                {"start": "武汉", "end": "西安"},
                {"start": "广州", "end": "南昌"},
                {"start": "广州", "end": "贵阳"},
                {"start": "广州", "end": "郑州"},
                {"start": "广州", "end": "成都"},
                {"start": "广州", "end": "昆明"},
                {"start": "成都", "end": "拉萨"},
                {"start": "成都", "end": "西宁"},
                {"start": "成都", "end": "武汉"}
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
	            {"name": "呼合浩特", "E": 111.660351, "N": 40.828319,"offsetX":0,"offsetY":40},
	            {"name": "太原", "E": 112.550864, "N": 37.890277,"offsetX":0,"offsetY":40},
	            {"name": "长沙", "E": 112.979353, "N": 28.213478,"offsetX":0,"offsetY":40},
	            {"name": "广州", "E": 113.30765, "N": 23.120049,"offsetX":0,"offsetY":85,"ind":1},
	            {"name": "澳门", "E": 113.02, "N": 22.2,"offsetX":0,"offsetY":-40},
	            {"name": "郑州", "E": 113.649644, "N": 34.75661,"offsetX":0,"offsetY":40},
	            // {"name": "深圳", "E": 114.06667, "N": 22.61667,"offsetX":0,"offsetY":40},
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
	            {"name": "哈尔滨", "E": 126.657717, "N": 45.7732,"offsetX":0,"offsetY":40},
        	].map(function(item){
        		var pos = _this.lglt2xyz(item.E + 90,item.N,_this.earthR);
    			item.x = pos.x;
    			item.y = pos.y;
    			item.z = pos.z;
        		return item;
        	})
        };

        this.threeBaseInit(array);
        this.parseData();
        this.container = new THREE.Object3D();
        this.scale = 1;
        this.mapContainer = new THREE.Object3D();
        this.container.add(this.mapContainer);
    };

    p.initGridHelper = function() {
        var help = new THREE.AxisHelper(400);
        this.container.add(help);
    };

    p.initObject3D = function(){
        this.scene.add(this.container);
        this.initMap();
        this.initGridHelper();
        this.createParticleMaterial();
        this.createLinkLine();
        this.createLineParticles();
        this.creatCity();
        this.appear();
    };

    p.initMap = function(){
    	var geometry = new THREE.SphereGeometry(this.earthR, 40, 40);
        var material = new THREE.MeshBasicMaterial({
            map: this.resourcesMap['earth'].result,
            color:0x286aaa,
            wireframe: false,
            transparent: true,
            depthTest:false
        });
        this.earth = new THREE.Mesh(geometry, material);
        this.container.rotation.x = 0.16;
        this.container.rotation.y = Math.PI - 0.38;
        this.container.rotation.z = 0;
        this.container.position.x = 30;
        this.container.position.y = -100;
        this.camera.position.z = 418;
        this.container.add(this.earth); 
    };

    p.appear = function () {
        this.cityAppear(1.5);
        this.linkLineAppear(2);
        this.lineParticlesStart(2.5);
    };

    p.createParticleMaterial = function () {
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
    	this.container.add(cityGroup);
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
                    delay: i * 0.1 + delayTime,
                    onStartScope: lineParticlesItem,
                    onStart: function () {
                        this.userData["cirV"] = 0.015;
                    }
                });
            }
        }
    };


    p.renderFun = function () {
        this.lineParticlesRender();
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

	Exhibition.ChinaMap = ChinaMap;
})();