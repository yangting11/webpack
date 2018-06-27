import css from './css/index.css'  //需要写相对路径  安装css-loader对标签进行处理   
import less from './css/black.less'
import test_func from './test.js'
import $ from 'jquery';   //node_module里面的路径
//style-loader 处理css中间的url 安装了需要配置
let author = "yangting";
document.getElementById("title").innerHTML=author
test_func();
$(document).ready(function(){
    alert('jquery')
    $("#title").html("nininini")
})