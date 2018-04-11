/* globals WBST */
this.WBST = this.WBST || {};
(function(win,doc){
	function Controller (){
		var baseUrl = '';
		var hostUrl = './debug/';
		var api = {
			allPage: hostUrl+'allPage.json',					//	页面标题，导航

			/*  ----------------------------- 智能服务 ------------------------------------  */
			znfw_6box: hostUrl+'znfw_6box.json',			// 	6边形
			znfw_gzl: hostUrl+'znfw_gzl.json', 				//	故障率
			znfw_gzl_act: hostUrl+'znfw_gzl_act.json', 		//	故障率降低举措

			znfw_hsbl: hostUrl+'znfw_hsbl.json', 			//	回收比例
			znfw_hsbl_act: hostUrl+'znfw_hsbl_act.json', 	//	旧件回收比例提高举措

			znfw_kyl: hostUrl+'znfw_kyl.json', 				//	常用备件可用率
			znfw_kyl_act: hostUrl+'znfw_kyl_act.json', 		//	提高备件可用率举措

			znfw_xfl: hostUrl+'znfw_xfl.json', 				//	一次性修复率
			znfw_xfl_act: hostUrl+'znfw_xfl_act.json', 		//	一次性修复率提高举措

			znfw_xysj: hostUrl+'znfw_xysj.json', 			//	工程师响应时间
			znfw_xysj_act: hostUrl+'znfw_xysj_act.json', 	//	高效响应举措

			/*  ----------------------------- 共享经济 ------------------------------------  */

			gxjj_sblb: hostUrl+'gxjj_sblb.json', 			//	设备列表

			/*  ----------------------------- 研发辅助 ------------------------------------  */

			yffz_gzpc: hostUrl+'yffz_gzpc.json', 			//	模块故障频次
			yffz_jscl: hostUrl+'yffz_jscl.json', 			//	节省策略
			yffz_zqcl: hostUrl+'yffz_zqcl.json', 			//	增强策略
			yffz_bccl: hostUrl+'yffz_bccl.json',	 		//	保持策略

			/*  ----------------------------- 模式创新 ------------------------------------  */

			cxms_middle: hostUrl+'mscx_middle.json',		// 	中心区域
			cxms_kgl: hostUrl+'mscx_kgl.json', 				//	刺绣机开工率
			cxms_jgph: hostUrl+'mscx_jgph.json', 			//	热销花样价格排行
			cxms_lxqs: hostUrl+'mscx_lxqs.json', 			//	花样流行趋势
			//back
			cxms_back_yfzq: hostUrl+'mscx_back_yfzq.json', 	//	产品研发周期
			cxms_back_lyl: hostUrl+'mscx_back_lyl.json', 	//	能源利用率
			cxms_back_xlts: hostUrl+'mscx_back_xlts.json', 	//	生产效率提升
			cxms_back_yycb: hostUrl+'mscx_back_yycb.json', 	//	设备运营成本
			cxms_back_bll: hostUrl+'mscx_back_bll.json',	// 	产品不良率
			
		};

		// 异步请求方法
		var requestAsk = function(opt){
			$.ajax({
				type: opt.type || "GET",
				data: opt.data || {},
				url: baseUrl + opt.url,
				success: function(json) {
					if (opt.callback instanceof Function)
						opt.callback(json);
				},
				error: function() {
					console.log(opt.url);
					throw new Error(baseUrl + opt.url + " 接口");
				}
			});
		};

		//	============================== 接口请求函数 ====================================
		
		for (var name in api) {
			this[dealName(name)] = (function(name) {
				return function(data,callback) {
					requestAsk({
						url: api[name],
						data: data,
						callback: function(json) {
							if (callback instanceof Function) {
								callback(json);
							}
						}
					});
				};
			}(name));
		}
		
		// 'znfw_6box' => 'getZnfw_6box'
		function dealName(str) {
			return 'get' + str.charAt(0).toUpperCase() + str.substring(1);
		}
	}

	WBST.Controller = Controller;
})(window,document);