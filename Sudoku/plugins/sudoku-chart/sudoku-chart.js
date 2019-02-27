/**
 * Created by zhoue on 2019/1/23.
 */
(function (global, d3v4, factory) {
    factory((global.sudoku = {}), d3v4);
})(this, d3, function (exports, d3v4) {
    function SudokuChart(domstr, opts) {
        'use strict';
        var _that=this;
        this.opts=opts || {};
        
        this.svg=d3v4.select(domstr);
        this.pointXYs=new Array();
        var _opts={
            el: domstr,
            sodukuNum: 3,
            pad: 15,
            sodukuArray: [],

            margin: {top: 20, right: 30, bottom: 36, left: 60},
            width: +_that.svg.attr("width"),
            height: +_that.svg.attr("height"),
            colors:["#FF8500", "#8BAB00", "#6E8BBB", "#EA5B6C", "#FF8500", "#8BAB00", "#FF0000", "#EA5B6C", "#FF8500"],
            texts:["④ 不平衡", "② 良好", "① 优秀", "⑦ 基本合格", "⑤ 合格", "③ 良好", "⑨ 不及格", "⑧ 基本合格", "⑥ 不平衡"],
            circledata:[{x:46, y:72}],
        }
        var svgdom = document.querySelector(domstr);
        if(isNaN(_opts.width)){ _opts.width=svgdom.clientWidth; }
        if(isNaN(_opts.height)){ _opts.height=svgdom.clientHeight; }

        var tmpi=0;
        while(tmpi<_opts.sodukuNum*_opts.sodukuNum){
            _opts.sodukuArray.push(tmpi);
            tmpi++;
        }

        // 计算格子的宽度，高度
        var _w=_opts.width-(_opts.margin.right+_opts.margin.left)-_opts.pad*(_opts.sodukuNum+1),
            _h=_opts.height-(_opts.margin.top+_opts.margin.bottom)-_opts.pad*(_opts.sodukuNum+1);
        this.rectWidth=_w/_opts.sodukuNum;
        this.rectHeight=_h/_opts.sodukuNum;

        // 计算九宫格的坐标
        for(var i=0; i<_opts.sodukuNum; i++){
            var recty = _opts.pad*(i+1) + _that.rectHeight*i;
            for(var j=0;j<_opts.sodukuNum;j++) { 
                this.pointXYs.push({x: _opts.pad*(j+1)+_that.rectWidth*j, y: recty}); 
            }
        }

        Object.assign(this.opts, _opts);
        this.initChart();

        // 添加箭头
        // svg.append("g")
        //     .selectAll("defs")
        //     .data([0, 1])
        //     .enter().append("defs")
        //     .append("marker")
        //     .attr("id", function (d) {
        //         return ["markerArrowx", "markerArrowy"].find(function (ele, idx, arr) { return d===idx;})
        //     })
        //     .attr("markerWidth", 8)
        //     .attr("markerHeight", 8)
        //     .attr("refx", 0)
        //     .attr("refy", 3)
        //     .attr("markerUnits", "strokeWidth")
        //     .attr("orient", "auto")
        //     .append("path")
        //     .attr("d", "M0,0 L 8 4 L 0 8 z")
        //     .attr("fill", "#1D8CE0")
        //     .attr("stroke-width", 0);
        // gx.select("path")
        //     .attr("marker-end", "url(#markerArrowx)");


        // g.append("g")
        //     .selectAll("rect")
        //     .data(sodukuArray)
        //     .enter().append("rect")
        //     .attr("width", rectWidth)
        //     .attr("height", rectHeight)
        //     .attr("x", function (d) {return points[d].x })
        //     .attr("y", function (d) {return points[d].y })
        //     .attr("rx", 10)
        //     .attr("ry", 10)
        //     .attr("fill", function (d) {return colors[d] });    //d的循环从data数组的值开始
        //
        // g.append("g")
        //     .selectAll("text")
        //     .data(sodukuArray)
        //     .enter().append("text")
        //     .text("我是一匹马")
        //     .attr("x", function (d) {return (points[d].x + rectWidth/2-50) })
        //     .attr("y", function (d) {return (points[d].y + rectHeight/2) })
        //     .attr("fill", "#fff");

    }
    var sudokuProto = SudokuChart.prototype;
    sudokuProto.initChart = function(){
        this.paintXaxis();
        this.paintYaxis();
        this.paintContent();
        this.paritCircle();

        //this.initEvent();
    }

    sudokuProto.paintXaxis = function(){
        var _opts=this.opts;
        // 画X轴
        var x = d3v4.scaleLinear()
            .domain([0, 100])
            .range([0, _opts.width-(_opts.margin.left+_opts.margin.right)]);
        var gx = this.svg.append("g");
        gx.attr("transform", "translate(" + _opts.margin.left + "," + (_opts.height-_opts.margin.bottom) + ")")
            .call(d3v4.axisBottom(x)
                //.tickValues([25, 50, 75])
                .tickSizeOuter(0.5)   // 设置外侧(坐标轴两端)刻度大小.
            );  //.call axisBottom创建一个新的刻度在下的坐标轴生成器
        gx.select("path")
            .attr("stroke", "#FF8500")
            .attr("stroke-width", 3);
        gx.selectAll("line")
            .attr("stroke", "#FF8500")
            .attr("stroke-width", 1);
        gx.selectAll("text")
            .attr("fill", "#FF8500");
    }

    sudokuProto.paintYaxis = function(){
        var _opts=this.opts;
        // 画Y轴
        var y = d3v4.scaleLinear()
            .domain([0, 100])
            .range([_opts.height-_opts.margin.top-_opts.margin.bottom, 0]);
        var gy = this.svg.append("g");
        gy.attr("transform", "translate(" + _opts.margin.left + "," + _opts.margin.top + ")")
            .call(d3v4.axisLeft(y)
                .tickSizeOuter(0.5)
            );
        gy.select("path")
            .attr("stroke", "#3B79CE")
            .attr("stroke-width", 3);
        gy.selectAll("line")
            .attr("stroke", "#3B79CE")
            .attr("stroke-width", 1);
        gy.selectAll("text")
            .attr("fill", "#3B79CE");
    }

    sudokuProto.paintContent = function(){
        var _that=this,
            _opts=this.opts;
        var g = this.svg.append("g")
            .attr("transform", "translate(" + _opts.margin.left + "," + _opts.margin.top + ")");
        g.append("g")   // 选取一个g
            .selectAll("g") //从每个被选中的元素中选择多个后代元素.
            .data(_opts.sodukuArray)
            .enter().append("g")
            .attr("style", "cursor:pointer;")
            .attr("transform", function (d) {
                return "translate(" + _that.pointXYs[d].x + "," + _that.pointXYs[d].y + ")";
            });
        g.select("g")
            .selectAll("g")
            .classed("group-rect-text", true)
            .append("rect")
            .attr("width", this.rectWidth)
            .attr("height", this.rectHeight)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("fill", function (d) {return _opts.colors[d] });   //d的循环从data数组的值开始
            //.attr("style", "cursor:pointer;");

        g.select("g")
            .selectAll("g")
            .append("text")
            .text(function (d) {
                return _opts.texts[d];
            })
            .attr("font-size", "20px")
            .attr("style", "font-family: 宋体;font-weight: bold;")
            .attr("fill", "#fff")
            .attr("transform", function (d) {
                var tx=Math.round(_that.rectWidth/2)-50,
                    ty=Math.round(_that.rectHeight/2)+5,
                    transstr = "translate("+ tx + "," + ty + ")";
                return transstr;
            });
    }

    sudokuProto.paritCircle=function(){
        if(arguments.length === 0) return false;
        var circledata = arguments[0]

        if(circledata && circledata instanceof Array){
            var _that=this,
                _opts=this.opts;
            var xlength=_opts.width-(_opts.margin.left+_opts.margin.right),
                ylength=_opts.height-_opts.margin.top-_opts.margin.bottom;
            var circlepoints = circledata.map(function (el) {
                var rx=Math.round(xlength/100*el.xpoint),
                    ry=ylength-Math.round(ylength/100*el.ypoint);

                var quanzhong = Math.random()*0.5+0.5;
                var poi = Math.round(10+el.xpoint*quanzhong+el.ypoint*(1-quanzhong));
                return {x: rx, y: ry, point: poi};
            });

            var pointdom = document.getElementById("group-point");
            var circlegroup = null
            if(pointdom!=null){
                circlegroup = d3v4.select(pointdom);
                circlegroup.selectAll("g").remove();
            }else {
                circlegroup = this.svg.append("g")
                    .attr("id", "group-point")
                    .attr("transform", "translate(" + _opts.margin.left + "," + _opts.margin.top + ")");
            }
            circlegroup.selectAll("g")
                .data(circlepoints)
                .enter()
                .append("g")
                .each(function (data, idx) {
                    d3v4.select(this)
                        .append("circle")
                        .attr("cx", function (d) { return d.x; })
                        .attr("cy", function (d) { return d.y; })
                        .attr("stroke-width", 3)
                        .attr("fill", "#000")
                        .attr('fill-opacity', 0.3)
                        .attr("r", 5);
                    d3v4.select(this)
                        .append("text")
                        .text(data.point)
                        .attr("transform", function (d){ return "translate("+(d.x+10)+","+(d.y+5)+")"; })
                        .attr("font-size", "14px")
                        //.attr("font-weight", "bolder")
                        .attr("fill", "#000")
                        .attr('fill-opacity', 0.3);
                })

            return false;
            circlegroup.append("g")
                .selectAll("circle")
                .data(circlepoints)
                .enter()
                .append("circle")
                // .attr("cx", 0)
                // .attr("cy", ylength)
                // .transition()
                // .duration(500)
                // .ease(d3v4.easeBounceInOut)
                // .delay(function (d, i) { return i * 500; })
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
                .attr("stroke-width", 3)
                .attr("fill", "#000")
                .attr('fill-opacity', 0.3)
                .attr("r", 5);
        }

    }

    sudokuProto.initEvent=function(){
        var _that=this,
            _opts=this.opts,
            timeout=null;
        var eldom=document.querySelector(_opts.el);
        // eldom.addEventListener("mouseover", function (event) {
        //     var ev=event || window.event;
        //     var target=ev.target||ev.srcElement;
        //     var parentEl=target.parentNode;
        //     var parentEld3=d3v4.select(parentEl);
        //     if(parentEl.nodeName==="g" && parentEld3.classed("group-rect-text")){
        //     }
        // });

        //return false;
        eldom.onmouseover=function(ev){
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            var parentEl = target.parentNode || target.parentElement;
            var parentEld3=d3v4.select(parentEl)

            //if(target.nodeName==="rect" && target.tagName==="rect"){
            if(parentEl.nodeName==="g" && parentEld3.classed("group-rect-text")){
                //var _currentcolor=target.attributes.fill.nodeValue;
                d3v4.select(parentEl)
                    .select("rect")
                    .attr("style", "fill:#53dc91");
                timeout=setTimeout(function(){

                    //target.style.fill="#53dc91";
                }, 50);
            }
        }
        eldom.onmouseout=function(ev){
            var ev = ev || window.event,
                target = ev.target || ev.srcElement;
            var pntarget = ev.toElement || ev.relatedTarget,
                pnparentEld3=null;
            if(pntarget&&(pntarget.parentElement || pntarget.parentNode)){
                pnparentEld3=pntarget.parentElement || pntarget.parentNode;
            }
            var parentEl = target.parentElement || target.parentNode,
                parentEld3=d3v4.select(parentEl);
            if(parentEl.nodeName==="g" && parentEld3.classed("group-rect-text")) {
                // 由于g不触发mouseout事件，只能通过其孩子节点来判断，当mouseout移动过快是需向上判断父亲节点是否相同
                if(pntarget) {
                    if ((pntarget.nodeName === "rect" || pntarget.nodeName === "text")
                        && pnparentEld3 && pnparentEld3.textContent == parentEl.textContent) return false;
                }
                clearTimeout(timeout);
                var _currentcolor=parentEld3.select("rect").attr("fill");
                parentEld3.select("rect")
                    .attr("style", "fill:"+_currentcolor);
            }
            // if(target.nodeName==="rect" && target.tagName==="rect"){
            //     clearTimeout(timeout);
            //     var _currentcolor=target.attributes.fill.nodeValue;
            //     target.style.fill=_currentcolor;
            // }
        };
    }

    var MOUSE_EVENT_NAMES = [
        'click', 'dblclick', 'mouseover', 'mouseout', 'mousemove',
        'mousedown', 'mouseup', 'globalout', 'contextmenu'
    ];
    sudokuProto.initMouseEvent=function(){

    }

    sudokuProto.on=function(event, handler){
        if(MOUSE_EVENT_NAMES.indexOf(event)<0){
            throw new Error("绑定的事件不对");
            return false;
        }
        var _that=this,
            _opts=this.opts;
        var eldom=document.querySelector(_opts.el);
        eldom.addEventListener(event, function (event) {
           var ev=event || window.event;
           var target=ev.target||ev.srcElement;
           var parentEl=target.parentNode;
           var parentEld3=d3v4.select(parentEl);
           if(parentEl.nodeName==="g" && parentEld3.classed("group-rect-text")){
               var gtrans = parentEld3.attr("transform");
               var gx = +gtrans.substring(gtrans.indexOf("(")+1, gtrans.indexOf(",")),
                   gy = +gtrans.substring(gtrans.indexOf(",")+1, gtrans.indexOf(")"))

               var rect = parentEld3.select("rect");
               var rectwidth = +rect.attr("width"),
                   rectheight = +rect.attr("heigth");
               var pointg=document.getElementById("group-point");
               if(!pointg) handler.call(null, {result:false, msg:"空"});
               var circle = d3v4.select(pointg).select("circle");
               var circlex = circle.attr("cx"),
                   circley = circle.attr("cy");
               if(gx<circlex && circlex<=(gx+rectwidth+15)
                   && gy<circley && circley<=(gy+rectwidth+15)){
                   handler.call(null, {result:true, msg:""});
               }
               else handler.call(null, {result:false, msg:"不在此区域"});
           }
        });
    }

    sudokuProto.insertXlabel = function(param){
        if(param && Object.prototype.toString.call(param) === "[object Array]") {
            var _that = this,
                _opts = this.opts;
            var eldom = document.querySelector(_opts.el),
                xgdom = eldom.firstElementChild;
            var maxtransX=_opts.width-(_opts.margin.left+_opts.margin.right);
                // transX = Math.round((_opts.width-(_opts.margin.left+_opts.margin.right))/2);

            var xgtextdom = document.getElementById("xgtext"),
                xtextg=null;
            if(xgtextdom){
                xgtextdom.innerHTML = "";
                xtextg = d3v4.select(xgtextdom);
            }else{
                xtextg = d3v4.select(xgdom)
                    .append("g")
                    .attr("id", "xgtext");
            }

            var pointarr = param.map(function (item, idx, arr) {
                var xposi = Math.round(item.point*(maxtransX/100));
                return {text: item.text, point: xposi};
            });

            xtextg.selectAll("g")
                .data(pointarr)
                .enter()
                .append("g")
                .attr("transform", function(data, idx){
                    return "translate("+data.point+",0)";
                })
                .each(function (p, idx) {
                    d3v4.select(this)
                        .append("line")
                        .attr("stroke", "#3e7bce")
                        .attr("stroke-width", 3)
                        .attr("y2", -6);
                    d3v4.select(this)
                        .append("text")
                        .text(p.text)
                        .attr("transform", "translate(0,15)")
                        .attr("font-size", "10px")
                        .attr("font-weight", "bolder")
                        .attr("fill", "#3e7bce");
                });

            if(pointarr.length>1) {
                var max = Math.max.apply(Math, pointarr.map(function (item, idx, arr) {
                    return item.point;
                }));
                var min = Math.min.apply(Math, pointarr.map(function (item, idx, arr) {
                    return item.point;
                }));
                var circleposi = (max+min)/2
                //<circle cx="100" cy="50" r="40" stroke="black" stroke-width="2" fill="#fff"
                xtextg.append("g")
                    .attr("transform", "translate("+circleposi+",-5)")
                    .append("circle")
                    .attr("r", "3")
                    .attr("stroke", "#3e7bce")
                    .attr("stroke-width", 1)
                    .attr("fill", "#fff");
            }

            // if(xgtextdom) {
            //     d3v4.select(xgtextdom)
            //         .attr("transform", "translate("+maxtransX+",30)")
            //         .transition()
            //         .duration(200)
            //         .ease(d3v4.easeBounceInOut)
            //         .attr("transform", "translate("+transX+",30)")
            //         .select("text")
            //         .text(pobj.text);
            //     return false;
            // }
            //
            // var eldom = document.querySelector(_opts.el),
            //     xgdom = eldom.firstElementChild;
            // var xtextg = d3v4.select(xgdom)
            //     .append("g");
            // xtextg.attr("id", "xgtext")
            //     .append("text")
            //     .text(pobj.text)
            //     .attr("font-size", "14px")
            //     .attr("font-weight", "bolder")
            //     .attr("fill", "#FF8500");
            // xtextg.attr("transform", "translate("+maxtransX+",30)")
            //     .transition()
            //     .duration(200)
            //     .ease(d3v4.easeBounceInOut)
            //     .attr("transform", "translate("+transX+",30)")

        }
    }

    sudokuProto.insertYlabel = function(param){
        if(param && Object.prototype.toString.call(param) === "[object Array]") {
            var _that = this,
                _opts = this.opts;
            var eldom = document.querySelector(_opts.el),
                ygdom = eldom.children[1];

            var transy = _opts.height-(_opts.margin.top+_opts.margin.bottom);
            var ygtextdom = document.getElementById("ygtext"),
                ytextg = null;
            if(ygtextdom) {
                ygtextdom.innerHTML = "";
                ytextg = d3v4.select(ygtextdom);
            }else{
                ytextg = d3v4.select(ygdom)
                    .append("g")
                    .attr("id", "ygtext");
            }

            var pointarr = param.map(function (item, idx, arr) {
                var yposi = transy-Math.round(item.point*(transy/100));
                return {text: item.text, point: yposi};
            });

            ytextg.selectAll("g")
                .data(pointarr)
                .enter()
                .append("g")
                .attr("transform", function(data, idx){
                    return "translate(0, "+data.point+")";
                })
                .each(function (p, idx) {
                    d3v4.select(this)
                        .append("line")
                        .attr("stroke", "#ff8500")
                        .attr("stroke-width", 3)
                        .attr("x1", 2)
                        .attr("x2", 8);
                    d3v4.select(this)
                        .append("text")
                        .text(p.text)
                        .attr("transform", "translate(-3,3)")
                        .attr("font-size", "10px")
                        .attr("font-weight", "bolder")
                        .attr("fill", "#ff8500");
                });

            if(pointarr.length>1) {
                var max = Math.max.apply(Math, pointarr.map(function (item, idx, arr) {
                    return item.point;
                }));
                var min = Math.min.apply(Math, pointarr.map(function (item, idx, arr) {
                    return item.point;
                }));
                var circleposi = (max+min)/2
                ytextg.append("g")
                    .attr("transform", "translate(6,"+circleposi+")")
                    .append("circle")
                    .attr("r", "3")
                    .attr("stroke", "#ff8500")
                    .attr("stroke-width", 1)
                    .attr("fill", "#fff");
            }
        }

        // if(text && Object.prototype.toString.call(text) === "[object String]") {
        //     var _that = this,
        //         _opts = this.opts;
        //     var transy = Math.round((_opts.height-(_opts.margin.top+_opts.margin.bottom))/3);
        //     var ygtextdom = document.getElementById("ygtext");
        //     if(ygtextdom) {
        //         d3v4.select(ygtextdom)
        //             .attr("transform", "translate(-25," + 0 + ")")
        //             .transition()
        //             .duration(200)
        //             .ease(d3v4.easeBounceInOut)
        //             .attr("transform", "translate(-25," + transy + ")")
        //             .select("tspan")
        //             .text(text);
        //         return false;
        //     }
        //
        //     var eldom = document.querySelector(_opts.el),
        //         ygdom = eldom.children[1];
        //     var ytextg = d3v4.select(ygdom)
        //         .append("g");
        //     ytextg.attr("id", "ygtext")
        //         .append("text")
        //         .attr("font-size", "14px")
        //         .attr("font-weight", "bolder")
        //         .attr("fill", "#3b79ce")
        //         .append("tspan")
        //         .text(text)
        //         .attr("dx", "0 -14")
        //         .attr("dy", "0 14");
        //         //dx dy是两个坐标（0，0）（-14，14）相对于前一个值的坐标为初始位置
        //
        //     ytextg.attr("transform", "translate(-25," + 0 + ")")
        //         .transition()
        //         .duration(200)
        //         .ease(d3v4.easeBounceInOut)
        //         .attr("transform", "translate(-25," + transy + ")")
        // }
    }



    // 自定义辅助方法
    function getStrLength(text) {
        var length=0;
        for(var i=0; i<text.length; i++){
            if(text.charCodeAt(i)<299) length++;
            else length+=2;
        }
        return length*2.5;
    }

    function init(dom, opts) {
        var chart = new SudokuChart(dom, opts);
        return chart;
    }

    exports.init = init;
})