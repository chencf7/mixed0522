$(function(){
    // 单选按钮选中，自定义横纵坐标
    var axisDiv = document.querySelector(".layui-form");
    axisDiv.addEventListener("click", function(event){
        var ev = event || window.event;
        var target = ev.target || ev.srcElement;
        if(target.nodeName==="DIV") return false;
        var $jqElement = $(target);
        //$jqElement.parent().addClass("layui-form-checked");
    });


    var chart = sudoku.init("#testsvg", {});
    chart.on('click', function (params) {
        if(params.result) {
            if ('content' in document.createElement('template')) {
                let tb = document.querySelector("#descript");
                tb.style = "";
                tb.innerHTML = "";

                var templname = "zcbtempl";
                if (document.getElementById("selorg").value == "xm") {
                    templname = "xmtempl";
                }
                var tmpl = document.getElementById(templname);
                var cloneTmpl = document.importNode(tmpl.content, true);
                // tb.style="animation: proRotate 1s ease-in-out 1ms alternate none 1;";
                tb.appendChild(cloneTmpl);
            }
        }else{
            alert("项目综合评价得分"+params.msg);
        }
    });

    $("#selorg").change(function () {
        var selvalue = $("#selorg").find("option:selected").val();
        var xvalue = $('input[type="radio"][name="assessxAxis"]:checked').prop("id"),
            yvalue = $('input[type="radio"][name="assessyAxis"]:checked').prop("id");
        PaintDataToSudokuChart.apply(null, [selvalue, xvalue, yvalue]);
    });

    //监听radio的选中
    // var xradios = document.getElementsByName("assessxAxis");
    // for(var i=0;i<xradios.length;i++){
    //     xradios[i].onchange=function (event) {
    //         var $that = $(this)
    //         chart.insertXlabel($that.attr("title"));
    //     }
    // }
    // var xradios = document.getElementsByName("assessyAxis");
    // for(var i=0;i<xradios.length;i++){
    //     xradios[i].onchange=function (event) {
    //         var $that = $(this)
    //         chart.insertYlabel($that.attr("title"));
    //     }
    // }
    $('input[name="hengzuobiao"], input[name="zongzuobiao"]').on("click", function () {
        var $that = $(this);
        //
        var curflag = $that.prop("checked");
        if(curflag){
            //添加label
            //chart.insertXlabel({text:$that.val(),point:88});
        }else{
            //移除label
        }
    });

    document.getElementById("confirm").addEventListener("click", function () {
        //var hengzuobiao = document.getElementsByName("hengzuobiao")
        var hengs = $('input[name="hengzuobiao"]:checked'),
            zongs = $('input[name="zongzuobiao"]:checked');

        if(hengs.length<=0||zongs.length<=0){
            alert("请选择横、纵坐标。")
            return false;
        }
        // var selorg = $("#selorg").find("option:selected").val();
        // var curitem = assessDatasource.getAllDataByOrg(selorg);
        var hengarr=[], zongarr=[];
        for(var i=0;i<hengs.length;i++){
            hengarr.push({text:$(hengs[i]).prop("value"), point:Math.round(Math.random()*50+40)});
        }
        for(var j=0;j<zongs.length;j++){
            zongarr.push({text:$(zongs[j]).prop("value"), point:Math.round(Math.random()*50+40)});
        }
        if(hengs.length>0) chart.insertXlabel(hengarr);
        if(zongs.length>0) chart.insertYlabel(zongarr);

        //PaintDataToSudokuChart()
        var hengpoints = hengarr.map(function (item, idx) { return item.point; }),
            zongpoints = zongarr.map(function (item, idx) { return item.point; });
        var hengmax = Math.max.apply(Math, hengpoints),
            hengmin = Math.min.apply(Math, hengpoints),
            zongmax = Math.max.apply(Math, zongpoints),
            zongmin = Math.min.apply(Math, zongpoints);

        chart.paritCircle([{xpoint: (hengmax+hengmin)/2, ypoint:(zongmax+zongmin)/2}]);
    }, false);
    
    
    function PaintDataToSudokuChart(org, xzhou, yzhou) {
        if(org&&xzhou&&yzhou){
            var curitem = assessDatasource.getSelDataByOrg(org, xzhou, yzhou);
            if(curitem.length>0) chart.paritCircle(curitem);
        }
    }
});