
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token')
            location.href = "./login.html"
            layer.close(index)
        });
    })

 function getUserInfo() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户基本信息失败！')
                }
                renderAvatar(res.data)
            }
        })
    }

    function renderAvatar(user) {
        var name = user.nickname || user.username
        $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('src', user.user_pic).show()
            $('.text_avatar').hide()
        } else {
            $('.layui-nav-img').hide()
            var first = name[0].toUpperCase()
            $('.text_avatar').html(first).show()
        }
    }

   getUserInfo()









