$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    q = {
        pagenum: 1,  //	页码值
        pagesize: 2,	//每页显示多少条数据
        cate_id: '',	//文章分类的 Id
        state: ''	// 文章的状态，可选值有：已发布、草稿
    }
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date)
        var y = dt.getFullYear()
        var m = pwdZoer(dt.getMonth() + 1)
        var d = pwdZoer(dt.getDate())
        var hh = pwdZoer(dt.getHours())
        var mm = pwdZoer(dt.getMinutes())
        var ss = pwdZoer(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    function pwdZoer(n) {
        return n < 10 ? '0' + n : n
    }

    initTable()
    initCate()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initTable()
    })
    // layout	自定义排版。可选值有：count（总条目输区域）、
    // prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh
    // （页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // console.log(first);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    //do something 
                    initTable()
                }

            }
        });

    }

    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
        layer.confirm('确认删除吗?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: "GET",
                url: '/my/article/delete/' + id,
                success: function (res) { 
                    console.log(res.message);
                    
                    if (res.status !== 0) { 
                        return layer.msg('删除数据失败！')
                    }
                    layer.msg(res.message)
                    if (len === 1) { 
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1 
                    }
                    initTable()
                }
            })
            layer.close(index);
          });
    })

    $('tbody').on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id')
        console.log(id);
        
    })



})
