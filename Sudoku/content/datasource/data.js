var assessDatasource = (function(){
    const data=[{
        value: "zcb",
        data: {
            Quality: 92,
            Security: 88,
            Chengben: 97,
            Zijin: 88,
            Qita: 98,
        }
    },{
        value: "jg",
        data: {
            Quality: 82,
            Security: 28,
            Chengben: 57,
            Zijin: 98,
            Qita: 38,
        }
    },{
        value: "xmb",
        data: {
            Quality: 32,
            Security: 88,
            Chengben: 47,
            Zijin: 78,
            Qita: 88,
        }
    },{
        value: "xmb",
        data: {
            Quality: 52,
            Security: 88,
            Chengben: 97,
            Zijin: 48,
            Qita: 38,
        }
    }];


    function getAllDataByOrg(org){
        var tmp = data.find(function (item, index, arr) {
            if(item.value===org) return item;
        })
        return tmp;
    }

    function getSelDataByOrg(org){
        var tmp = [];
        var args = Array.prototype.slice.call(arguments);
        if(args.length!=3) return tmp;
        for(var i=0; i<data.length;i++){
            if(data[i].value === org) continue;
            var points = data[i]["data"];
            var curobj = {
                xpoint: points[args[1].substr(1)],
                ypoint: points[args[2].substr(1)],
            };
            tmp.push(curobj);
        }
        return tmp;
    }

    return {
        getAllDataByOrg: getAllDataByOrg,
        getSelDataByOrg,
    }
})()