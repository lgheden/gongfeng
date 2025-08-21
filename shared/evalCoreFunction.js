// 显示一个Toast，提示消息
var toast = (content,time) => {
          return new Promise((resolve,reject) => {
        let elAlertMsg = document.querySelector("#fehelper_alertmsg");
        if (!elAlertMsg) {
            let elWrapper = document.createElement('div');
            elWrapper.innerHTML = '<div id="fehelper_alertmsg" style="position:fixed;top:5px;left:0;right:0;z-index:100">' +
                '<p style="background:#000;display:inline-block;color:#fff;text-align:center;' +
                'padding:10px 10px;margin:0 auto;font-size:14px;border-radius:4px;">' + content + '</p></div>';
            elAlertMsg = elWrapper.childNodes[0];
            document.body.appendChild(elAlertMsg);
        } else {
            elAlertMsg.querySelector('p').innerHTML = content;
            elAlertMsg.style.display = 'block';
        }

              window.setTimeout(function () {
            elAlertMsg.style.display = 'none';
                  resolve && resolve();
        }, time || 1000);
    });
};

// 简单的sleep实现
var sleep = ms => new Promise((resolve,reject) => setTimeout(resolve,ms));

// 下面开始这个简单的Demo...
function baiduAuto (str){
        // 这只是个Demo，咱们就只针对百度首页来做
  
          toast('baiduAuto执行')
      .then(() => { 
          $('#s_lg_img_gold_show').attr('src','https://ss3.bdstatic.com/yrwDcj7w0QhBkMak8IuT_XF5ehU5bvGh7c50/logopic/f6cf589144923c2d0e49e0fcea78f621_fullsize.jpg');
      });
      console.log("$('#kw').val()",$('#kw').val(),str,$('#kw').val() == str)
      if($('#kw').val() == str){ return }
      else{$('#kw').val('')}
        sleep(2000)
      .then(() => toast('2. 输入 '+str,2000))
      .then(() => {
          str.split('').forEach((char,index) => { 
                    setTimeout(() => {$('#kw').val($('#kw').val()+char)}, (index+1)*400) 
          });
      });
  
    sleep(8000)
      .then(() => toast('3. 点击搜索',2000))
      .then(() => $('#form').trigger('submit') );
};