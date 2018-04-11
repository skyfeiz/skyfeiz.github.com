/* globals Exhibition,dll */
this.Exhibition = this.Exhibition || {};
(function(){
	var Line = dll(67);
	var Text = dll(9);

	function Zchart2(dom){
		this.zr = dll(16).init(dom);
		// this.init();
	}

	var p = Zchart2.prototype;

	p.init = function() {
		var _this = this;
		var W = this.zr.getWidth();
		var H = this.zr.getHeight();
		var r = 10;
		var bgW = 250;
		let percent = 0.27;
		var line0 = new Line({
			shape:{
				x1:r/2,
				y1:H/2,
				x2:bgW,
				y2:H/2,
			},
			style:{
				stroke:'#fff',
				lineWidth:r,
				lineCap:'round'
			}
		});
		this.zr.add(line0);

		var line1 = new Line({
			shape:{
				x1:r/2,
				y1:H/2,
				x2:bgW*percent,
				y2:H/2,
				percent:0
			},
			style:{
				stroke:'#cf131c',
				lineWidth:r,
				lineCap:'round'
			}
		});
		this.zr.add(line1);
		var text = new Text({
			style:{
				x:bgW + 18,
				y:H/2,
				text:this.float2Percent(percent),
				textFill:'#fff',
				font:'normal 22px DIN MEDIUM',
				textVerticalAlign:'middle'
			}
		});
		this.zr.add(text);

		line1.animateShape().when(3000,{
			percent:1
		}).start().during(function(){
			text.style.text = _this.float2Percent(percent*line1.shape.percent);
			text.dirty();
		});
	};

	p.float2Percent = function(n) {
		return Math.round(n*100) + '%';
	};

	Exhibition.Zchart2 = Zchart2;
})();