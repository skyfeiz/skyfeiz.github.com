/* globals CHARTS,WBST */
(function(){
	var YffzChart1 = CHARTS.YffzChart1;
	var YffzChart2 = CHARTS.YffzChart2;
	var YffzChart3 = CHARTS.YffzChart3;
	var YffzChart4 = CHARTS.YffzChart4;

	var initAnimation = CHARTS.initAnimation;

	var ajaxUtil = new WBST.Controller();

	var $toptitlebox = $('.toptitlebox');
	var $bottombox = $('.bottombox');
	ajaxUtil.getAllPage({},function(result){
		domShow($toptitlebox,result.page4.header);
		domShow($bottombox,result.page4.bottom);
	});

	function domShow($dom,bShow) {
		if (bShow) {
			$dom.show();
		}else{
			$dom.hide();
		}
	}

	var $yffzChart1box = $('#yffzChart1box');
	var yffzChart1 = new YffzChart1($yffzChart1box[0]);
	yffzChart1.setConfig({
		nameField: 'name',
		xField: 'xNum',
		yField: 'yNum',
		rField: 'rNum',
		typeField: 'type'
	});
	$yffzChart1box.parent().on('initChart', function() {
		ajaxUtil.getYffz_gzpc({}, function(result) {
			$yffzChart1box.parent().find('.charttitle').html(result.title);
			yffzChart1.setDataProvider(result.data);
		});
	});


	var $yffzChart2box = $('#yffzChart2box');
	var yffzChart2 = new YffzChart2($yffzChart2box[0]);
	yffzChart2.setConfig({
		xField: 'xNum',
		y1Field: '额定重量',
		y2Field: '实际重量',
		y3Field: '负荷系数'
	});

	$yffzChart2box.parent().on('initChart', function() {
		ajaxUtil.getYffz_jscl({}, function(result) {
			$yffzChart2box.parent().find('.charttitle').html(result.title);
			yffzChart2.setDataProvider(result.data);
		});
	});


	var $yffzChart3box = $('#yffzChart3box');
	var yffzChart3 = new YffzChart3($yffzChart3box[0]);
	yffzChart3.setConfig({
		xField: 'xNum',
		y1Field: '负荷值',
		y2Field: '负荷系数'
	});
	$yffzChart3box.parent().on('initChart', function() {
		ajaxUtil.getYffz_zqcl({}, function(result) {
			$yffzChart3box.parent().find('.charttitle').html(result.title);
			yffzChart3.setDataProvider(result.data);
		});
	});

	var $yffzChart4box = $('#yffzChart4box');
	var $yffzChart4bg = $('#yffzChart4bg');
	var yffzChart4 = new YffzChart4($yffzChart4box[0], $yffzChart4bg[0]);
	yffzChart4.setConfig({
		xField: 'xNum',
		y1Field: '超载次数',
		y2Field: '负荷系数'
	});
	$yffzChart4box.parent().on('initChart', function() {
		ajaxUtil.getYffz_bccl({}, function(result) {
			$yffzChart4box.parent().find('.charttitle').html(result.title);
			yffzChart4.setDataProvider(result.data);
		});
	});


	initAnimation({
		borderfn: function() {
			var $chart1box = $('.yffzChart1box');
			$('.rightStick4').attr('mark-top', 55);
			$('.leftStick4').attr('mark-top', 55);
			$('.rightBar4').attr('mark-top', 90);
			$('.leftBar4').attr('mark-top', 90);

			$chart1box.find('.leftStick4').attr('mark-top', 96);
			$chart1box.find('.rightStick4').attr('mark-top', 96);

			$chart1box.find('.leftBar4').attr('mark-top', 154).css('height', 185);
			$chart1box.find('.rightBar4').attr('mark-top', 154).css('height', 185);
		}
	});
})();