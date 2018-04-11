/* globals Exhibition,Linear,Stats,Back */
this.Exhibition = this.Exhibition || {};
(function() {
	var China = function() {
		this.init();
	};

	var p = China.prototype;

	p.init = function() {
		var mc = new Exhibition.ChinaMap();
		var zchart2 = new Exhibition.Zchart2(document.getElementById('zchart2'));
		var zchart3 = new Exhibition.Zchart3(document.getElementById('zchart3'));

		var _this = this;
		this.leftAni(function(){
			_this.valueToAni();
			zchart2.init();
			zchart3.init();
		});

		var stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		document.body.appendChild(stats.domElement);

		render();
		function render() {
			requestAnimationFrame(render);
			mc.render();
			stats.update();
		}
	};

	p.leftAni = function(fn) {
		var $zleftbox = $('#zleftbox');
		$zleftbox.css({
			transform: 'rotateY(90deg)',
			opacity:0
		});
		var json = {
			per: 0
		};
		new TweenMax(json, 0.6, {
			per: 1,
			ease: Back.easeInOut.config(1.7),
			onUpdate: function() {
				$zleftbox.css({
					transform: 'rotateY('+(10+80*(1-json.per))+'deg)',
					opacity:json.per
				});
			},
			onComplete:function(){
				fn && fn();
			}
		});
	};

	p.valueToAni = function() {
		var _this = this;
		$('.z-ani').each(function(idx, ele) {
			var $ele = $(ele);
			var eValue = $ele.attr('e-value');
			var json = {
				per: 0
			};
			new TweenMax(json, 1, {
				per: 1,
				ease: Linear.easeNone,
				onUpdate: function() {
					$ele.text(_this.parseNum(Math.round(eValue * json.per)));
				}
			});
		});
	};

	/**
	 * 数字格式转换 1234567890  ->  1,234,567,890
	 * @param  {[number]} n 
	 * @return {[string]}   [每三个一个分隔]
	 */
	p.parseNum = function(n) {
		return n.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
	};

	Exhibition.China = China;
})();