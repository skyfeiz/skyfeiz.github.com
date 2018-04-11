/* globals WBST,CHARTS,TweenMax,Linear */
(function(){
	var CxmsChart1 = CHARTS.CxmsChart1;
	var CxmsChart2 = CHARTS.CxmsChart2;
	var CxmsChart3 = CHARTS.CxmsChart3;

	var CxmsBackChart1 = CHARTS.CxmsBackChart1;
	var CxmsBackChart2 = CHARTS.CxmsBackChart2;
	var CxmsBackChart3 = CHARTS.CxmsBackChart3;
	var CxmsBackChart4 = CHARTS.CxmsBackChart4;
	var CxmsBackChart5 = CHARTS.CxmsBackChart5;

	var CxmsMiddle = CHARTS.CxmsMiddle;
	var initAnimation = CHARTS.initAnimation;
	
	var ajaxUtil = new WBST.Controller();
	var bOk = false;

	var $toptitlebox = $('.toptitlebox');
	var $bottombox = $('.bottombox');
	ajaxUtil.getAllPage({},function(result){
		domShow($toptitlebox,result.page3.header);
		domShow($bottombox,result.page3.bottom);
	});

	function domShow($dom,bShow) {
		if (bShow) {
			$dom.show();
		}else{
			$dom.hide();
		}
	}

	var $middle = $('#videoTipBox');
	ajaxUtil.getCxms_middle({},function(result){
		var earth = new CxmsMiddle($middle[0],result);
		earth.EventDispatcher.on('initP3',function(){
			initAnimation();
		});

		earth.EventDispatcher.on('animateComplete',function(){
			bOk = true;
		});
	});

	var $cxmsChart1 = $('.cxms_chart1');
	$cxmsChart1.on('initChart', function() {
		var $cxmsChart1Box = $('#cxms_chart1_box');
		var cxmsChart1 = new CxmsChart1($cxmsChart1Box[0]);
		ajaxUtil.getCxms_kgl({}, function(result) {
			$cxmsChart1.find('.charttitle').html(result.title);
			cxmsChart1.setDataProvider(result.data);
		});
	});

	var $cxmsChart2 = $('.cxms_chart2');
	$cxmsChart2.on('initChart', function() {
		var $cxmsChart2Box = $('#cxms_chart2_box');
		var cxmsChart2 = new CxmsChart2($cxmsChart2Box[0]);
		ajaxUtil.getCxms_lxqs({}, function(result) {
			$cxmsChart2.find('.charttitle').html(result.title);
			cxmsChart2.setDataProvider(result.data);
		});
	});

	var $cxmsChart3 = $('.cxms_chart3');
	$cxmsChart3.on('initChart', function() {
		var $cxmsChart3Box = $('#cxms_chart3_box');
		var cxmsChart3 = new CxmsChart3({
			containerId:'#cxms_chart3_box',
			width:$cxmsChart3Box.width(),
			height:$cxmsChart3Box.height(),
			labelField:'name',
			valueField:'value'
		});
		ajaxUtil.getCxms_jgph({}, function(result) {
			$cxmsChart3.find('.charttitle').html(result.title);
			cxmsChart3.setDataProvider(result.data);
		});
	});


 // ========================back=======================
	var $cxmsBackChart1 = $('.cxmsBack_chart1');
	var $cxmsChart1Box = $('#cxmsBack_chart1_box');
	var cxmsBackChart1 = new CxmsBackChart1($cxmsChart1Box[0]);
	ajaxUtil.getCxms_back_yfzq({}, function(result) {
		$cxmsBackChart1.find('.charttitle').html(result.title);
		$cxmsBackChart1.data('dataProvider',result.data);
		$cxmsBackChart1.data('myChart',cxmsBackChart1);
	});

	var $cxmsBackChart2 = $('.cxmsBack_chart2');
	var $cxmsChart2Box = $('#cxmsBack_chart2_box');
	var cxmsBackChart2 = new CxmsBackChart2($cxmsChart2Box[0]);
	ajaxUtil.getCxms_back_lyl({}, function(result) {
		$cxmsBackChart2.find('.charttitle').html(result.title);
		$cxmsBackChart2.data('dataProvider',result.data);
		$cxmsBackChart2.data('myChart',cxmsBackChart2);
	});

	var $cxmsBackChart3 = $('.cxmsBack_chart3');
	var $cxmsChart3Box = $('#cxmsBack_chart3_box');
	var cxmsBackChart3 = new CxmsBackChart3($cxmsChart3Box[0]);
	ajaxUtil.getCxms_back_xlts({}, function(result) {
		$cxmsBackChart3.find('.charttitle').html(result.title);
		$cxmsBackChart3.data('dataProvider',result.data);
		$cxmsBackChart3.data('myChart',cxmsBackChart3);
	});
	

	var $cxmsBackChart4 = $('.cxmsBack_chart4');
	var $cxmsChart4Box = $('#cxmsBack_chart4_box');
	var cxmsBackChart4 = new CxmsBackChart4($cxmsChart4Box[0]);
	ajaxUtil.getCxms_back_yycb({}, function(result) {
		$cxmsBackChart4.find('.charttitle').html(result.title);
		$cxmsBackChart4.data('dataProvider',result.data);
		$cxmsBackChart4.data('myChart',cxmsBackChart4);
	});

	var $cxmsBackChart5 = $('.cxmsBack_chart5');
	var $cxmsChart5Box = $('#cxmsBack_chart5_box');
	var cxmsBackChart5 = new CxmsBackChart5($cxmsChart5Box[0]);
	ajaxUtil.getCxms_back_bll({}, function(result) {
		$cxmsBackChart5.find('.charttitle').html(result.title);
		$cxmsBackChart5.data('dataProvider',result.data);
		$cxmsBackChart5.data('myChart',cxmsBackChart5);
	});

	var $front = $('.front');
	var $backs = $('.back');
	var bBack = false;
	var $p3h2 = $('#p3h2');
	$p3h2.click(function(){
		if (!bOk) {return;}
		bOk = false;
		var isClick = $(this).attr('isClick');
		if (!bBack) {
			// 第一次点击
			$front.each(function(idx,ele){
				var frontJson = {per:1};
				new TweenMax(frontJson,0.6,{
					per:0,
					onCompleteParams: [idx],
					onUpdate:function(){
						$(ele).css({
							transform:'rotateY('+90*(1-frontJson.per)+'deg)'
						});
					},
					onComplete:function(num){
						if (num === $front.length-1) {
							$('.numAnimate').each(function(idx, ele) {
								var json = {
									value: $(ele).html()*1
								};
								var end = $(ele).attr('data-end');
								var isInt = true;
								if (end%1 != 0) {
									isInt = false;
								}
								new TweenMax(json, 1, {
									value: end,
									ease: Linear.easeNone,
									delay:1,
									onUpdate: function() {
										if (isInt) {
											$(ele).html(Math.round(json.value));
										}else{
											$(ele).html(json.value.toFixed(1));
										}
									}
								});
							});

							$('.c_icon').each(function(idx,ele){
								$(ele).find('.c_sigle').each(function(ix,el){
									var eJson = {per:-0.2};
									var et = 0;
									var dis = 8;
									new TweenMax(eJson,3,{
										per:4,
										ease:Linear.easeNone,
										delay:3+ix*0.1,
										repeat:-1,
										onUpdate:function(){
											if (eJson.per>0.2) {return;}
											$(el).css({
												top:et - dis*(1-Math.abs(eJson.per*5))
											});
										}
									});
								});
							});
							
							$backs.each(function(idx,ele){
								var backJson = {per:0};
								new TweenMax(backJson,0.6,{
									per:1,
									onCompleteParams: [$(ele)],
									onUpdate:function(){
										$(ele).css({
											transform:'rotateY('+90*(1-backJson.per)+'deg)'
										});
									},
									onComplete:function($obj){
										bOk = true;
										if (isClick) {return;}
										$obj.data('myChart').setDataProvider($obj.data('dataProvider'));
										$p3h2.attr('isClick',1);
									}
								});
							});
						}
					}
				});
			}); 
			
		}else{
			$backs.each(function(idx,ele){
				var backJson = {per:1};
				new TweenMax(backJson,0.6,{
					per:0,
					onUpdate:function(){
						$(ele).css({
							transform:'rotateY('+90*(1-backJson.per)+'deg)'
						});
					},
					onCompleteParams: [idx],
					onComplete:function(num){
						if (num === $backs.length - 1) {
							$front.each(function(idx,ele){
								var frontJson = {per:0};
								new TweenMax(frontJson,0.6,{
									per:1,
									onUpdate:function(){
										$(ele).css({
											transform:'rotateY('+90*(1-frontJson.per)+'deg)'
										});
									},
									onComplete:function(){
										bOk = true;
									}
								});
							});
						}
					}
				});
			});
		}
		
		bBack = !bBack;
	});
})();