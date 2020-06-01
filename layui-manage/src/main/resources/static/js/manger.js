window.onload = function () {
    var $ = layui.$;
    var fun = {};
    var privilege;
    var newPrivilege;
    var name;
    var form = layui.form;
    var table = layui.table;
    var slider = layui.slider;
    var type = {0:"装备",1:"药品",2:"翅膀",3:"坐骑",4:"法宝",5:"灵器",6:"时装",7:"法印",8:"头像",9:"飞行器",10:"符文",11:"变身卡",12:"家具",13:"宠物袋",14:"宠物书",15:"杂货",16:"仙侣",17:"称谓",18:"头衔",19:"宠物",20:"活动",21:"宠物技能",22:"装备特效"};
    var gmFunction = {
        "gmMail": "发送物品",
        "gmCloseAccount": "封禁账号",
        "gmInsertRegCode": "生成激活码",
        "gmDeleteRegCode": "删除激活码"
    };
    var userFunction = {"addPrivilege": "提升权限", "mail": "发送物品"};
    function init() {
        $.ajax({
            type: "GET",
            url: "/user/init",
            data: "",
            success: function (msg) {
                for (var i in msg.func.table) {
                    fun[msg.func.table[i].name] = msg.func.table[i].privilege;
                }
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    }
    init();
    setTimeout(function () {
        $.ajax({
            type: "GET",
            url: "/user/login",
            data: "",
            success: function (msg) {
                if (msg.resultCode == 0) {
                    privilege = msg.data.privilege;
                    table.render({
                        elem: '#regCode', //对应<table>的id
                        url: '/gm/findRegCodeList', //数据接口
                        page: true, //开启分页
                        id: 'regCodeTable',
                        parseData: function (codes) {
                            return {
                                "code": codes.resultCode - 1,
                                "msg": codes.rtnMessage,
                                "count": codes.total,
                                "data": codes.table
                            }
                        },
                        cols: [[ //表头
                            {align: 'center', field: 'code', title: '激活码'},
                            {align: 'center', field: 'privilege', title: '激活码权限'}
                        ]]
                    });
                    table.on('row(regClick)', function (obj) { //click对应lay-filter="click"
                        data = obj.data;
                        document.getElementById("deleteRegCode").disabled = "";
                        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
                    });
                    slider.render({
                        elem: '#regCodeSlider',
                        step: 1, //步长
                        value: 1, //初始值
                        min: 1,
                        max: privilege, //最大值
                        input: true, //输入框
                        theme: '#1E9FFF', //主题色
                    });
                    if (privilege >= 10) {
                        document.getElementById("admin").style.cssText = "";
                        document.getElementById("regCodeControl").style.cssText = "";
                        document.getElementById("regCodeSlider").style.cssText = "";
                        for (var i in userFunction)
                            $('#uFun').append("<option value=\"" + i + "\">" + userFunction[i] + "</option>");
                        for (var i in gmFunction)
                            $('#gFun').append("<option value=\"" + i + "\">" + gmFunction[i] + "</option>");
                        form.render("select");
                        form.on('select(uFun)', function (data) {
                            if (data.value != null && data.value != "") {
                                slider.render({
                                    elem: '#upinput',
                                    step: 1, //步长
                                    value: fun[data.value], //初始值
                                    min: 1,
                                    max: 10, //最大值
                                    input: true, //输入框
                                    theme: '#1E9FFF', //主题色
                                    disabled: false //禁用滑块
                                });
                                document.getElementById("up").disabled = "";
                            } else {
                                slider.render({
                                    elem: '#upinput',
                                    step: 1, //步长
                                    value: 1, //初始值
                                    min: 1,
                                    max: 10, //最大值
                                    input: true, //输入框
                                    theme: '#1E9FFF', //主题色
                                    disabled: true //禁用滑块
                                });
                                document.getElementById("up").disabled = "disabled";
                            }
                        });
                        form.on('select(gFun)', function (data) {
                            if (data.value != null && data.value != "") {
                                slider.render({
                                    elem: '#gpinput',
                                    step: 1, //步长
                                    value: fun[data.value], //初始值
                                    min: 1,
                                    max: 10, //最大值
                                    input: true, //输入框
                                    theme: '#1E9FFF', //主题色
                                    disabled: false //禁用滑块
                                });
                                document.getElementById("gp").disabled = "";
                                funName = data.value;
                            } else {
                                slider.render({
                                    elem: '#gpinput',
                                    step: 1, //步长
                                    value: 1, //初始值
                                    min: 1,
                                    max: 10, //最大值
                                    input: true, //输入框
                                    theme: '#1E9FFF', //主题色
                                    disabled: true //禁用滑块
                                });
                                document.getElementById("gp").disabled = "disabled";
                            }
                        });
                        //设置步长
                        slider.render({
                            elem: '#upinput',
                            step: 1, //步长
                            value: 1, //初始值
                            min: 1,
                            max: 10, //最大值
                            input: true, //输入框
                            theme: '#1E9FFF', //主题色
                            disabled: true //禁用滑块
                        });
                        slider.render({
                            elem: '#gpinput',
                            step: 1, //步长
                            value: 1, //初始值
                            min: 1,
                            max: 10, //最大值
                            input: true, //输入框
                            theme: '#1E9FFF', //主题色
                            disabled: true //禁用滑块
                        });
                        table.render({
                            elem: '#demo', //对应<table>的id
                            height: 466,
                            url: '/user/itemList', //数据接口
                            page: true, //开启分页
                            id: 'itemTable',
                            parseData: function (items) {
                                for(var i in items.table){
                                    for(var j in type){
                                        if(items.table[i]["type"] == j)
                                            items.table[i]["type"] = type[j];
                                    }
                                }
                                return {
                                    "code": items.resultCode - 1,
                                    "msg": items.rtnMessage,
                                    "count": items.total,
                                    "data": items.table
                                }
                            },
                            cols: [[ //表头
                                {align: 'center', field: 'id', title: '物品ID'},
                                {align: 'center', field: 'name', title: '物品名称'},
                                {align: 'center', field: 'type', title: '物品类别'},
                                {align: 'center', field: 'privilege', title: '物品权限'}
                            ]]
                        });
                        table.on('row(click)', function (obj) { //click对应lay-filter="click"
                            data = obj.data;
                            document.getElementById("edit").disabled = "";
                            document.getElementById("delete").disabled = "";
                            obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
                        });
                    }
                    if (privilege >= fun["gmInsertRegCode"]) {
                        document.getElementById("regCodeControl").style.cssText = "";
                        document.getElementById("addRegCode").style.cssText = "";
                        document.getElementById("regCodeSlider").style.cssText = "";
                    }
                    if(privilege >= fun["gmDeleteRegCode"]) {
                        document.getElementById("regCodeControl").style.cssText = "";
                        document.getElementById("deleteRegCode").style.cssText = "";
                    }
                } else {
                    layer.msg(msg.rtnMessage, {
                        time: 1000,
                        offset: '300px',
                    });
                }
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    }, 50);
    $('#addRegCode').on('click', function () {
        addRegCode();
    });
    function addRegCode() {
        var privilege = $('#regCodeSlider').children("div").eq(0).text();
        $.ajax({
            type: "GET",
            url: "/gm/insertRegCode",
            data: "privilege="+privilege,
            success: function (msg) {
                layui.table.reload('regCodeTable');
                layer.msg(msg.rtnMessage, {
                    time: 1000,
                    offset: '300px',
                });
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    }
    $('#deleteRegCode').on('click', function () {
        deleteRegCode(data);
    });
    function deleteRegCode(data) {
        $.ajax({
            type: "GET",
            url: "/gm/deleteRegCode",
            data: "code="+data.code,
            success: function (msg) {
                layui.table.reload('regCodeTable');
                layer.msg(msg.rtnMessage, {
                    time: 1000,
                    offset: '300px',
                });
                document.getElementById("deleteRegCode").disabled = "disabled";
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    }
    /*搜索*/
    setTimeout(function () {
        var active = {
            reload: function () {
                var itemName = $('#item');
                layui.table.reload('itemTable', {
                    page: {curr: 1},
                    where: {name: itemName.val()}
                }, 'data');
            }
        };
        $('#search').on('click', function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    }, 100);
	uPrivilege();
    /*修改权限*/
    function uPrivilege() {
        $('#up').on('click',function () {
            name = document.getElementsByClassName("layui-this")[0].getAttribute("lay-value");
            newPrivilege = $('#upinput').children("div").eq(0).text();
            $.ajax({
                type: "GET",
                url: "/gm/updateFunction",
                data: "name=" + name + "&privilege=" + newPrivilege,
                success: function (msg) {
                    fun[name] = newPrivilege;
                    layer.msg(msg.rtnMessage, {
                        time: 1000,
                        offset: '300px',
                    });
                },
                error: function (xhr) {
                    alert(xhr.status);
                }
            });
        });
        $('#gp').on('click',function () {
            name = document.getElementsByClassName("layui-this")[1].getAttribute("lay-value");
            newPrivilege = $('#gpinput').children("div").eq(0).text();
            $.ajax({
                type: "GET",
                url: "/gm/updateFunction",
                data: "name=" + name + "&privilege=" + newPrivilege,
                success: function (msg) {
                    fun[name] = newPrivilege;
                    layer.msg(msg.rtnMessage, {
                        time: 1000,
                        offset: '300px',
                    });
                },
                error: function (xhr) {
                    alert(xhr.status);
                }
            });
        });
    }
    var data;
    $('#edit').on('click',function () {
        editItem(data);
    });
    function editItem(data) {
        var edit = layer.open({
            title: false,
            area: ['620px', '500px'],
            type: 1,
            btn: ['确定', '取消'],
            closeBtn: 0,
            content: '<div class="layui-tab layui-tab-brief"lay-filter=""><div class="login"><span>修改物品</span></div><div class="line"></div><div class="resdiv"><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>物品id:<input type="text"style="margin-left:76.5px"autocomplete="off"id="itemId"disabled="disabled"class="logininput"placeholder="物品id"/><br/><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>物品名称:<input type="text"autocomplete="off"id="itemName"class="logininput"placeholder="物品名称"/><br/><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>物品类型:<input type="text"autocomplete="off"id="itemType"class="logininput"placeholder="物品类型"/><br/><div style="margin-top:20px"><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>设置权限:<div style="margin-left: 11.5%;margin-top: -45px" id="editSlider"class="demo-slider"></div></div></div>',
            yes: function () {
                var itemType = $('#itemType').val();
                var id = $('#itemId').val();
                var name = $('#itemName').val();
                for(var i in type) {
                    if(itemType == type[i])
                        itemType = i;
                }
                var privilege = $('#editSlider').children("div").eq(0).text();
                    $.ajax({type: "GET",
                        url: "/gm/updateItem",
                        data: "id="+id+"&name="+name+"&type="+itemType+"&privilege="+privilege,
                        success: function (msg) {
                            layer.msg(msg.rtnMessage, {
                                time: 1000,
                                offset: '300px',
                            });
                            if(msg.resultCode == 0) {
                                layui.table.reload('itemTable');
                                layer.close(edit);
                                document.getElementById("edit").disabled = "disabled";
                                document.getElementById("delete").disabled = "disabled";
                            }
                        },
                        error: function (xhr) {
                            alert(xhr.status);
                        }
                    });
                },
            btn2: function () {
                layer.close(edit);
                document.getElementById("edit").disabled = "disabled";
                document.getElementById("delete").disabled = "disabled";
            }
        });
        $('#itemId').val(data.id);
        $('#itemName').val(data.name);
        $('#itemType').val(data.type);
        var privilege = data.privilege;
        var slider = layui.slider;
        slider.render({
            elem: '#editSlider',
            step: 1, //步长
            value: privilege, //初始值
            min: 1,
            max: 10, //最大值
            input: true, //输入框
            theme: '#1E9FFF', //主题色
        });
    }
    $('#addItem').on('click',function () {
        addItem(data);
    });
    function addItem(data) {
        var add = layer.open({
            title: false,
            area: ['620px', '500px'],
            type: 1,
            btn: ['确定', '取消'],
            closeBtn: 0,
            content: '<div class="layui-tab layui-tab-brief"lay-filter=""><div class="login"><span>添加物品</span></div><div class="line"></div><div class="resdiv"><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>物品id:<input type="text"style="margin-left:76.5px"autocomplete="off"id="itemId"class="logininput"placeholder="物品id"/><br/><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>物品名称:<input type="text"autocomplete="off"id="itemName"class="logininput"placeholder="物品名称"/><br/><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>物品类型:<input type="text"autocomplete="off"id="itemType"class="logininput"placeholder="物品类型"/><br/><div style="margin-top:20px"><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>设置权限:<div style="margin-left: 11.5%;margin-top: -45px" id="editSlider"class="demo-slider"></div></div></div>',
            yes: function () {
                var id = $('#itemId').val();
                var name = $('#itemName').val();
                var itemType = $('#itemType').val();
                for(var i in type) {
                    if(itemType == type[i])
                        itemType = i;
                }
                var privilege = $('#editSlider').children("div").eq(0).text();
                $.ajax({
                    type: "GET",
                    url: "/gm/insertItem",
                    data: "id="+id+"&name="+name+"&type="+itemType+"&privilege="+privilege,
                    success: function (msg) {
                        layer.msg(msg.rtnMessage, {
                            time: 1000,
                            offset: '300px',
                        });
                        if(msg.resultCode == 0) {
                            layui.table.reload('itemTable');
                            layer.close(add);
                            document.getElementById("edit").disabled = "disabled";
                            document.getElementById("delete").disabled = "disabled";
                        }
                    },
                    error: function (xhr) {
                        alert(xhr.status);
                    }
                });
            },
            btn2: function () {
                layer.close(add);
                document.getElementById("edit").disabled = "disabled";
                document.getElementById("delete").disabled = "disabled";
            }
        });
        var slider = layui.slider;
        slider.render({
            elem: '#editSlider',
            step: 1, //步长
            value: 1, //初始值
            min: 1,
            max: 10, //最大值
            input: true, //输入框
            theme: '#1E9FFF', //主题色
        });
    }
    $('#delete').on('click',function () {
        deleteItem(data);
    });
    function deleteItem(data) {
        var deleteLayer = layer.open({
            title: '确认',
            area: '400px',
            type: 1,
            btn: ['确定', '取消'],
            closeBtn: 0,
            content: '<div style="padding:20px;line-height:24px;">确认删除此物品吗?</div>',
            yes: function () {
                var id = data.id;
                $.ajax({type: "GET",
                    url: "/gm/deleteItem",
                    data: "itemId="+id,
                    success: function (msg) {
                        layer.msg(msg.rtnMessage, {
                            time: 1000,
                            offset: '300px',
                        });
                        if(msg.resultCode == 0) {
                            layui.table.reload('itemTable');
                            layer.close(deleteLayer);
                            document.getElementById("edit").disabled = "disabled";
                            document.getElementById("delete").disabled = "disabled";
                        }
                    },
                    error: function (xhr) {
                        alert(xhr.status);
                    }
                });
            },
            btn2: function () {
                layer.close(deleteLayer);
                document.getElementById("edit").disabled = "disabled";
                document.getElementById("delete").disabled = "disabled";
            }
        });
    }
    $('#export').on('click',function () {
        exportItem();
    });
    function exportItem() {
        var exportLayer = layer.open({
            title: '确认',
            area: '400px',
            type: 1,
            btn: ['确定', '取消'],
            closeBtn: 0,
            content: '<div style="padding:20px;line-height:24px;">确认导出物品表吗?</div>',
            yes: function () {
                var url = '/gm/export';
                var xhr = new XMLHttpRequest();
                xhr.open('GET',url,true);
                xhr.responseType = "blob";
                xhr.onload = function () {
                    if(this.status == 200) {
                        var blob = this.response;
                        var reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onload = function (e) {
                            // 转换完成，创建一个a标签用于下载
                            var a = document.createElement('a');
                            a.download = 'item.xls';
                            a.href = e.target.result;
                            $("body").append(a);    // 修复firefox中无法触发click
                            a.click();
                            $(a).remove();
                            layer.close(exportLayer);
                        };
                    }
                };
                xhr.send()
            },
            btn2: function () {
                layer.close(exportLayer);
            }
        });
    }
    importItem();
    function importItem() {
        var upload = layui.upload;
        var uploadInst = upload.render({
            elem: '#import',
            url: '/gm/import',
            method: 'POST',
            accept: 'file', //普通文件
            done: function(msg){
                layui.table.reload('itemTable');
                layer.msg(msg.rtnMessage, {
                    time: 1000,
                    offset: '300px',
                });
            },
            error: function(){
                //请求异常回调
            }
        });
    }
};
