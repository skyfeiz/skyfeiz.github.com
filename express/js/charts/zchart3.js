/* globals Exhibition,dll */
this.Exhibition = this.Exhibition || {};
(function(){

	var Text = dll(9);
	var Circle = dll(62);
	var Arc = dll(60);

	function Zchart3(dom){
		this.zr = dll(16).init(dom);
		// this.init();
	}

	var p = Zchart3.prototype;

	p.init = function() {
		var W = this.zr.getWidth();
		var H = this.zr.getHeight();
		this.createSeries({
			x:W/4,
			y:H/2 + 6,
			name:'发货率',
			percent:0.72
		});
		this.createSeries({
			x:W/4*3,
			y:H/2 + 6,
			name:'签收率',
			percent:0.64
		});
	};

	p.createSeries = function(opts){
		var percent = opts.percent;
		var pi = Math.PI;
		var valueSize = 30;
		var nameSize = 16;
		var r = 56;
		var _this = this;
		
		var circle = new Circle({
			shape:{
				cx:opts.x,
				cy:opts.y,
				r:r,
			},
			style:{
				fill:'none',
				stroke:'#012d78',
				lineWidth: 10,
			}
		});
		this.zr.add(circle);

		var arc = new Arc({
			shape:{
				cx:opts.x,
				cy:opts.y,
				r:r,
				startAngle:-pi/2,
				endAngle:-pi/2,
				percent:0,
			},
			style:{
				stroke:'#01baff',
				lineWidth:10,
				lineCap:'round'
			}
		});
		this.zr.add(arc);

		var value = new Text({
			style:{
				x:opts.x,
				y:opts.y - nameSize/2 - 2,
				text:this.float2Percent(percent),
				textFill:'#fff',
				textAlign:'center',
				textVerticalAlign:'middle',
				font:'normal '+valueSize+'px DIN MEDIUM'
			}
		});
		this.zr.add(value);

		var name = new Text({
			style:{
				x:opts.x,
				y:opts.y + valueSize/2 + 2,
				text:opts.name,
				textFill:'#01baff',
				textAlign:'center',
				textVerticalAlign:'middle',
				font:'normal '+nameSize+'px DIN MEDIUM'
			}
		});
		this.zr.add(name);

		arc.animateShape().when(3000,{
			endAngle:-pi/2 + pi*2*percent,
			percent:1
		}).start().during(function(){
			value.style.text = _this.float2Percent(percent * arc.shape.percent);
			value.dirty();
		});
	};

	p.float2Percent = function(n) {
		return Math.round(n*100) + '%';
	};

	Exhibition.Zchart3 = Zchart3;
})();