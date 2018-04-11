/* globals Exhibition,Linear,Stats,Back */
this.Exhibition = this.Exhibition || {};
(function() {
	var Left = function() {
		this.initDom();
	};

	var p = Left.prototype;

	p.init = function() {
		var zchart2 = new Exhibition.Zchart2(document.getElementById('zchart2'));
		var zchart3 = new Exhibition.Zchart3(document.getElementById('zchart3'));
		var cur = this;
		this.leftAni(function(){
			cur.valueToAni();
			zchart2.init();
			zchart3.init();
			cur.opaToShow();
			cur.baseEvent();
		});
	};

	p.initDom = function() {
		this.$zleftbox = $('#zleftbox');
		this.$zdepotBox = $('.zdepot-box');
		this.$opaShow= $('.opa-show');
		this.$zboxyc = $('#zboxyc');
		this.$zbox4 = $('#zbox4');
		this.$pageTitle = $('.page-title');
	};

	p.leftAni = function(fn) {
		var cur = this;
		cur.$zleftbox.css({
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
				cur.$zleftbox.css({
					transform: 'rotateY('+(10+80*(1-json.per))+'deg)',
					opacity:json.per
				});
			},
			onComplete:function(){
				fn && fn();
			}
		});
	};

	p.opaToShow = function() {
		/*
		 *W = 1920 ~ 2560;
		 *H = 973 ~ 1440;
		 */
		// var W = window.innerWidth;
		// var H = window.innerHeight;
		this.$opaShow.each(function(idx,ele){
			new TweenMax($(ele), 1, {
				opacity: 1,
				ease: Linear.easeNone
			});
		});
		this.$pageTitle.each(function(idx,ele){
            new TweenMax($(ele), 1, {
                opacity: 0,
                ease: Linear.easeNone
            });
        });
	};

	p.baseEvent = function() {
		var cur = this;
		var arr = ['成都','北京','武汉','上海','广州'];
		this.$zdepotBox.click(function(){
			window.location.href = 'depotPage.html?depot='+arr[$(this).index()];
		});

		this.$zboxyc.click(function(){
			window.location.href = 'errorPage.html';
		});
		this.$zbox4.click(function(){
			cur.$zboxyc.trigger('click');
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
			new TweenMax(json, 3, {
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

	Exhibition.Left = Left;
})();