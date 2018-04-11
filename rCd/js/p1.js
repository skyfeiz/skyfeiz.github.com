(function(){
    var ZnfwXysj = CHARTS.ZnfwXysj;
    var ZnfwRadar = CHARTS.ZnfwRadar;
    var ZnfwGzl = CHARTS.ZnfwGzl;
    var ZnfwHsbl = CHARTS.ZnfwHsbl;
    var ZnfwXfl = CHARTS.ZnfwXfl;
    var Znfw6Box = CHARTS.Znfw6Box;
    var leadLine = CHARTS.leadLine;
    //act
    var ZnfwXysjAct = CHARTS.ZnfwXysjAct; //1
    var bar1 = CHARTS.bar1; // 2 3   
    var ZnfwGzlAct = CHARTS.ZnfwGzlAct; //4
    var ZnfwHsblAct = CHARTS.ZnfwHsblAct; //5

    var initAnimation = CHARTS.initAnimation;

    var ajaxUtil = new WBST.Controller();

    var $toptitlebox = $('.toptitlebox');
    var $bottombox = $('.bottombox');
    ajaxUtil.getAllPage({},function(result){
        domShow($toptitlebox,result.page1.header);
        domShow($bottombox,result.page1.bottom);
    });

    function domShow($dom,bShow) {
        if (bShow) {
            $dom.show();
        }else{
            $dom.hide();
        }
    }

    //  指引线
    leadLine(document.getElementById('canvaslines'));

    //  6边形
    var $boxcenter = $('#boxcenter');
    var znfw6Box = new Znfw6Box($boxcenter[0]);
    ajaxUtil.getZnfw_6box({}, function(result) {
        znfw6Box.setDataProvider(result.data);
        initAnimation({
            bgComplete: function() {
                $('#znfw_chart4').parent().find('.gridbg').show();
                $('#znfw_chart4').trigger('initChart');
            }
        });
    });

    // 工程师响应时间
    var $znfw_chart1_01 = $('#znfw_chart1_01');
    var $znfw_chart1_02 = $('#znfw_chart1_02');
    var $znfw_chart1 = $znfw_chart1_01.parent();
    var znfwXysj01 = new ZnfwXysj($znfw_chart1_01[0]);
    znfwXysj01.setConfig({
        label: "name",
        value: "value"
    });
    var znfwXysj02 = new ZnfwXysj($znfw_chart1_02[0], 300);
    znfwXysj02.setConfig({
        label: "name",
        value: "value"
    });
    $znfw_chart1.parent().data("isClick", false).on('initChart', function() {
        ajaxUtil.getZnfw_xysj({}, function(result) {
            $znfw_chart1_01.parent().parent().find('.charttitle').html(result.title);
            znfwXysj01.setDataProvider(result.data[0]);
            znfwXysj02.setDataProvider(result.data[1]);
        });
    })

    // 雷达图
    var $znfw_chart2 = $('#znfw_chart2');
    var znfwRadar = new ZnfwRadar($znfw_chart2[0]);
    $znfw_chart2.parent().data("isClick", false).on('initChart', function() {
        ajaxUtil.getZnfw_kyl({}, function(result) {
            $znfw_chart2.parent().find('.charttitle').html(result.title);
            znfwRadar.setDataProvider(result.data);
        });
    })

    //一次性修复率
    var $znfw_chart3 = $('#znfw_chart3');
    var znfwXfl = new ZnfwXfl($znfw_chart3[0]);
    $znfw_chart3.parent().data("isClick", false).on('initChart', function() {
        ajaxUtil.getZnfw_xfl({}, function(result) {
            $znfw_chart3.parent().find('.charttitle').html(result.title);
            var config = {
                "nameField": [],
                "seriesName": "seriesName",
                "name": "name",
                "value": "value",
                "dataList": "dataList"
            };
            znfwXfl.setConfig(config);
            znfwXfl.setDataProvider(result.data);
            znfwXfl.resize({
                width: 1,
                height: 1
            });
        });
    });

    // 故障率
    var $znfw_chart4 = $('#znfw_chart4');
    $znfw_chart4.parent().data("isClick", false);
    $znfw_chart4.on('initChart', function() {
        var znfwGzl = new ZnfwGzl($znfw_chart4[0]);
        ajaxUtil.getZnfw_gzl({}, function(result) {
            $znfw_chart4.parent().find('.charttitle').html(result.title);
            znfwGzl.setDataProvider(result.data);
        });
    })


    //  旧件回收比例
    var $znfw_chart5 = $('#znfw_chart5');
    $znfw_chart5.parent().data("isClick", false).on('initChart', function() {
        var znfwHsbl = new ZnfwHsbl($znfw_chart5[0]);
        ajaxUtil.getZnfw_hsbl({}, function(result) {
            $znfw_chart5.parent().find('.charttitle').html(result.title);
            znfwHsbl.setDataProvider(result.data);
        });
    })



    /*  反面*/
    // 备件可用率举措
    var $znfw_chart21 = $(".znfw_chart21_box");
    var barChart1 = new bar1($znfw_chart21[0], {
        type: 1
    });
    $znfw_chart21.data("chart", barChart1);
    barChart1.setConfig({
        label: "category",
        legend: "name",
        value: "data"
    });

    ajaxUtil.getZnfw_kyl_act({}, function(result) {
        $znfw_chart21.parent().find('.charttitle').html(result.title);
        $znfw_chart21.data('dataProvider', result.data);
    });


    // 修复率举措
    var $znfw_chart31 = $(".znfw_chart31_box");
    var barChart2 = new bar1($znfw_chart31[0], {
        type: 2
    });
    $znfw_chart31.data("chart", barChart2);
    barChart2.setConfig({
        label: "category",
        legend: "name",
        value: "data"
    });
    ajaxUtil.getZnfw_xfl_act({}, function(result) {
        $znfw_chart31.parent().find('.charttitle').html(result.title);
        $znfw_chart31.data('dataProvider', result.data);
    });



    // 高响应举措
    var $znfw_chart11 = $('.znfw_chart11_box');
    var $znfw_chart11bg = $('.znfw_chart11_box_bg');
    var znfwXysjAct = new ZnfwXysjAct($znfw_chart11[0], $znfw_chart11bg[0]);
    $znfw_chart11.data('chart', znfwXysjAct);
    znfwXysjAct.setConfig({
        nameField: 'name',
        valueField: 'value'
    })
    ajaxUtil.getZnfw_xysj_act({}, function(result) {
        $znfw_chart11.parent().find('.charttitle').html(result.title);
        $znfw_chart11.data('dataProvider', result.data);
    });

    //  故障率降低举措
    var $znfw_chart41 = $('.znfw_chart41_box');
    var $znfw_chart41bg = $('.znfw_chart41_box_bg');
    var znfwGzlAct = new ZnfwGzlAct($znfw_chart41[0], $znfw_chart41bg[0]);
    $znfw_chart41.data('chart', znfwGzlAct);
    znfwGzlAct.setConfig({
        nameField: 'name',
        valueField: 'value'
    })
    ajaxUtil.getZnfw_gzl_act({}, function(result) {
        $znfw_chart41.parent().find('.charttitle').html(result.title);
        $znfw_chart41.data('dataProvider', result.data);
    });

    //  旧件回收比例举措
    var $znfw_chart51 = $('.znfw_chart51_box');
    var znfwHsblAct = new ZnfwHsblAct($znfw_chart51[0]);
    $znfw_chart51.data('chart', znfwHsblAct);
    ajaxUtil.getZnfw_hsbl_act({}, function(result) {
        $znfw_chart51.parent().find('.charttitle').html(result.title);
        $znfw_chart51.data('dataProvider', result.data);
    });


    frontClick($znfw_chart1, $znfw_chart11);
    backClick($znfw_chart11, $znfw_chart1);

    frontClick($znfw_chart2, $znfw_chart21);
    backClick($znfw_chart21, $znfw_chart2);

    frontClick($znfw_chart3, $znfw_chart31);
    backClick($znfw_chart31, $znfw_chart3);

    frontClick($znfw_chart4, $znfw_chart41);
    backClick($znfw_chart41, $znfw_chart4);

    frontClick($znfw_chart5, $znfw_chart51);
    backClick($znfw_chart51, $znfw_chart5);

    //   正面点击
    function frontClick(dom1, dom2) {

        var clickTiem = {
            per: 0
        };
        dom1.parents('section').click(function() {
            // if($(this).)
            if (clickTiem.per == 0) {
                var $cur = $(this);

                TweenMax.to(clickTiem, .6, {
                    per: 1,
                    onUpdate: function() {
                        $cur.css({
                            transform: "translate(0,0) rotateY(" + clickTiem.per * 90 + "deg)",
                            zIndex: 0
                        });
                    }
                });
                TweenMax.to(clickTiem, .6, {
                    per: 0,
                    onUpdate: function() {
                        dom2.parent().css({
                            transform: "rotateY(" + clickTiem.per * 90 + "deg)",
                            zIndex: 100
                        });
                    },
                    delay: .6,
                    onComplete: function() {
                        if (!$cur.data("isClick"))
                            dom2.data("chart").setDataProvider(dom2.data("dataProvider"));

                        $cur.data("isClick", true);
                    }
                });
            }

        });
    };
    //   反面点击
    function backClick(dom1, dom2) {
        var clickTiem = {
            per: 0
        };
        dom1.parent().click(function() {
            if (clickTiem.per == 0) {
                var $cur = $(this);
                TweenMax.to(clickTiem, .6, {
                    per: 1,
                    onUpdate: function() {
                        $cur.css({
                            transform: "translate(0,0) rotateY(" + clickTiem.per * 90 + "deg)",
                            zIndex: 0
                        });
                    }
                });
                TweenMax.to(clickTiem, .6, {
                    per: 0,
                    onUpdate: function() {
                        dom2.parent().css({
                            transform: "rotateY(" + clickTiem.per * 90 + "deg)",
                            zIndex: 100
                        });
                    },
                    delay: .6
                });
            }

        });
    };
})();