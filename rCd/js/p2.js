/* globals CHARTS */
(function(){
	let initAnimation = CHARTS.initAnimation;

	let dataJson = CHARTS.gxjjDataJson;

	var ajaxUtil = new WBST.Controller();

	let $searchinput = $('.searchinput');

	let $searchbtn = $('#searchbtn');

	let $mainleft = $('.mainleft');

	let $mainright = $('.mainright');

	let $dialogbox = $('.dialogbox');
	let $dialogbox2 = $('.dialogbox2');

	let $listul = $('.listul');

	let $numMin = null;
	let $numMax = null;

	let city = '';
	let dataArr = dataJson.data;
	let nowYear = new Date().getFullYear();
	let filter = {};

	var $toptitlebox = $('.toptitlebox');
	var $bottombox = $('.bottombox');
	ajaxUtil.getAllPage({},function(result){
		domShow($toptitlebox,result.page2.header);
		domShow($bottombox,result.page2.bottom);
	});

	function domShow($dom,bShow) {
		if (bShow) {
			$dom.show();
		}else{
			$dom.hide();
		}
	}

	initAnimation({
		bgComplete:function(){
			// doing
			initPage();
			initEvent();
			$mainleft.fadeIn('normal',function(){
				$mainright.animate({
					opacity:1,
				});
			});
		}
	});

	function initPage() {
		$listul.each(function(idx,ele){
			let $ele = $(ele);
			let dataType = $ele.attr('data-type');
			let data = dataJson[dataType];
			let str = '<li>不限</li>';
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				if (typeof item === 'string') {
					str += '<li>'+item+'</li>';
				}else{
					str += '<li data-min="'+(item.min||-1/0)+'" data-max="'+(item.max||1/0)+'">'+ item.text + '</li>';
				}
			}
			if (dataType == 'priceData') {
				str += '<li class="input"><input type="number" id="numMin" /> - <input type="number" id="numMax" /> 元</li>';
			}
			$ele.html(str);
		});

		$numMin = $('#numMin');
		$numMax = $('#numMax');
		createRight();
	}

	function initEvent() {
		let defaultValue = $searchinput.attr('default-value');
		$searchinput.val(defaultValue);
		
		$searchinput.on('focus',function(){
			let $this = $(this);
			let val = $this.val().trim();
			if (val === defaultValue) {
				$this.val('');
			}
		});

		$searchinput.on('blur',function(){
			let $this = $(this);
			let val = $this.val().trim();
			if (val === '') {
				$this.val(defaultValue);
			}
		});

		// tab($('.dialog .tosee'),'active');
		// tab($('.searchbtn'),'active');

		$searchbtn.click(function(){
			let val = $searchinput.val();
			if (val !== defaultValue) {
				filter.searchType = val;
				filter.type = '';
				$('.listul[data-type="typeData"] > li.active').removeClass('active');
				createRight();
			}

		});

		$('.root').on('click','.carList .tosee',function(ev){
			ev.stopPropagation();
			let data = dataArr[$(this).attr('data-index')];
			dialogShow(data);
		});

		$('.root').on('click','.tophone',function(ev){
			ev.stopPropagation();
			$dialogbox2.fadeIn();
		});

		$dialogbox.on('click','.dailclose',function(ev){
			ev.stopPropagation();
			dialogHide();
		});

		$dialogbox2.on('click','.dailclose',function(ev){
			ev.stopPropagation();
			$dialogbox2.fadeOut();
		});

		//area
		$('.listul[data-type="areaData"]').on('click','>li',function(){
			$(this).addClass('active').siblings().removeClass('active');
			let html = $(this).html();
			city = html !== '不限'?html:'';
			createRight();
		});

		//type
		$('.listul[data-type="typeData"]').on('click','>li',function(){
			$(this).addClass('active').siblings().removeClass('active');
			let html = $(this).html();
			filter.type = html !== '不限'?html:'';
			filter.searchType = '';
			$searchinput.val(defaultValue);
			createRight();
		});

		//year
		$('.listul[data-type="yearData"]').on('click','>li',function(){
			$(this).addClass('active').siblings().removeClass('active');
			filter.yearMin = $(this).attr('data-min')*1;
			filter.yearMax = $(this).attr('data-max')*1;
			createRight();
		});

		//price
		$('.listul[data-type="priceData"]').on('click','>li',function(){
			$(this).addClass('active').siblings().removeClass('active');
			if ($(this).hasClass('input')) {
				return;
			}else{
				$numMin.val('');
				$numMax.val('');
			}
			let html = $(this).html();
			filter.price = html === '面议'?html:'';
			filter.priceMin = $(this).attr('data-min')*1 || -1/0;
			filter.priceMax = $(this).attr('data-max')*1 || 1/0;
			createRight();
		});

		// price input
		let timer = null;
		$numMin.on('input propertychange',function(){
			clearTimeout(timer);
			let val1 = $(this).val() * 1 || -1/0;
			let val2 = $numMax.val() * 1 || 1/0;
			filter.priceMin = Math.min(val1,val2);
			filter.priceMax = Math.max(val1,val2);
			timer = setTimeout(function(){
				createRight();
			},500);
		});

		$numMax.on('input propertychange',function(){
			clearTimeout(timer);
			let val1 = $(this).val() * 1 || -1/0;
			let val2 = $numMin.val() * 1 || 1/0;
			filter.priceMin = Math.min(val1,val2);
			filter.priceMax = Math.max(val1,val2);
			timer = setTimeout(function(){
				createRight();
			},500);
		});

	}

	function createRight() {
		filterData();
		let str = '<ul class="carList">';
		for (let i = 0; i < dataArr.length; i++) {
			let item = dataArr[i];
			str += '<li>'+
	            '<img class="carimg fl" src="imgs/p2/user/'+item.img+'" class="fl" alt="">'+
	            '<div class="carinfobox fl">'+
	                '<p class="carname">'+item.name+'</p>'+
	                '<div class="carinfo">'+
	                    '<div class="clearfix">'+
	                        '<p class="justifyl fl"><span>出</span><span>厂</span><span>年</span><span>份</span></p>'+
	                        '<p class="justifyr fl">'+
	                            '<span class="mohao">:</span>'+
	                            '<span>'+item.year+'年</span>'+
	                        '</p>'+
	                    '</div>'+
	                    '<div class="clearfix">'+
	                        '<p class="justifyl fl"><span>所</span><span>在</span><span>地</span></p>'+
	                        '<p class="justifyr fl">'+
	                            '<span class="mohao fl">:</span>'+
	                            '<span class="address fl">'+(city || item.city)+'</span>'+
	                        '</p>'+
	                    '</div>'+
	                    '<div class="clearfix">'+
	                        '<p class="justifyl fl"><span>价</span><span>格</span></p>'+
	                        '<p class="justifyr fl">'+
	                            '<span class="mohao">:</span>'+
	                            '<span>'+(item.price === '面议'?item.price:item.price+'/月')+'</span>'+
	                        '</p>'+
	                    '</div>'+
	                '</div>'+
	                '<span class="tosee" data-index="'+i+'">查看详情</span>'+
	            '</div>'+
	        '</li>';
		}
		str += '</ul>';
		$mainright.html(str);
		$mainright.unbind();
		$mainright.buildScrollBar();
	}

	function filterData() {
		dataArr = [];
		for (let i = 0; i < dataJson.data.length; i++) {
			let item = dataJson.data[i];
			if (filter.type && item.type !== filter.type ) {continue;}
			if (filter.searchType && item.type.indexOf(filter.searchType) === -1){continue;}
			let y = nowYear - item.year;
			if (filter.yearMin && filter.yearMax && filter.yearMin > y || filter.yearMax < y) {continue;}
			if (item.price === '面议' || filter.price === '面议') {
				if (filter.price === '面议' && item.price === '面议') {
					dataArr.push(item);
				}
				continue;
			}
			let price = item.price * 1;
			if (filter.priceMin && filter.priceMax && filter.priceMin > price || filter.priceMax < price) {continue;}
			dataArr.push(item);
		}
	}

	function dialogShow(data) {
		let str = '<div class="dialog">'+
                '<img src="imgs/p2/user/'+data.img+'" class="dialimg" alt="" />'+
                '<div class="carinfobox fl">'+
                    '<p class="carname">'+data.name+'</p>'+
                    '<p class="carprice">'+(data.price === '面议'?data.price:'￥'+data.price+'/月')+'</p>'+
                    '<div class="carinfo">'+
                        '<div class="clearfix">'+
                            '<p class="justifyl fl"><span>设</span><span>备</span><span>品</span><span>牌</span></p>'+
                            '<p class="justifyr fl"><span class="mohao">:</span><span>'+data.brand+'</span></p>'+
                        '</div>'+
                        '<div class="clearfix">'+
                            '<p class="justifyl fl"><span>设</span><span>备</span><span>型</span><span>号</span></p>'+
                            '<p class="justifyr fl"><span class="mohao">:</span><span>'+data.model+'</span></p>'+
                        '</div>'+
                        '<div class="clearfix">'+
                            '<p class="justifyl fl"><span>出</span><span>厂</span><span>年</span><span>份</span></p>'+
                            '<p class="justifyr fl"><span class="mohao">:</span><span>'+data.year+'年</span></p>'+
                        '</div>'+
                        '<div class="clearfix">'+
                            '<p class="justifyl fl"><span>设</span><span>备</span><span>地</span><span>址</span></p>'+
                            '<p class="justifyr fl"><span class="mohao fl">:</span><span class="address fl">'+(city||data.city)+'</span></p>'+
                        '</div>'+
                    '</div>'+
                    '<span class="tosee tophone">感兴趣，让对方联系我</span>  <span class="tosee toadd">加入收藏</span>'+
                '</div>'+
                '<span class="dailclose"></span>'+
            '</div>';
        $dialogbox.html(str);
		$dialogbox.fadeIn();
	}

	function dialogHide() {
		$dialogbox.fadeOut();
	}

	function tab($lis,className){
		$lis.click(function(){
			$lis.removeClass(className);
			$(this).addClass(className);
		});
	}

})();