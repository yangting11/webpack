//使用required引入
const path = require('path') //引入path路径
const webpack = require('webpack')
const uglify = require('uglifyjs-webpack-plugin');//引入插件 cnpm install uglifyjs-webpack-plugin --save-dev 
const htmlPlugin = require('html-webpack-plugin')//需要安装 引入html插件 必须安装 把src下面的index.html打包到dist
const extractTextPlugin = require('extract-text-webpack-plugin')//需要安装 再引入
const glob = require('glob');
const purifyCssPlugin = require("purifycss-webpack")
const entry = require('./config/entry.webpack.js')
console.log(encodeURIComponent(process.env.type))
if(process.env.type=="dev"){
    var website={
        publicPath:'http://10.0.0.145:8080/',//公用的静态路径
    }
}else{
    var website={
        publicPath:'http://10.0.0.145:8080/',//公用的静态路径
    }
}
console.log(encodeURIComponent(process.env.type))
module.exports={
    devtool:'eval-source-map',//调试工具
    entry:entry.path,//入口
    output:{
        path:path.resolve(__dirname,'dist'),  //node 的语法  path需要在上面引入  dist的绝对路径
        // filename:'bundle.js'//要打包成的文件  要在dist下面新建  单入口可以这样写
        filename:'[name].js',  //打包之后的名字与urukou文件名字一样
        publicPath:website.publicPath //公用的静态路径
    },//出口
    module:{
        rules:[
            {
                test:/\.(css|less)$/,  //用正则表达的形式找到需要处理的文件扩展
// /*写法一*/       use:['style-loader','css-loader'],//需要使用的loader
// /*写法二*/       loader:['style-loader','css-loader'],     
// /*写法三*/       use:[
//                     {loader:'style-loader'/*,module:''*/},
//                     {loader:'css-loader'}
//                 ]          
//上面写法都是普通的，下面这个是用于css分离的
                use:extractTextPlugin.extract({
                    use:[{
                        loader:"css-loader"
                    },{
                        loader:"less-loader"
                    },'postcss-loader'],  //这个是自动加前
                    fallback:"style-loader"
                    },
                    )
                //include和query可选
            },
            {
                test:/\.(png|jpg|gif)$/,
                use:[
                    // {
                    //     loader:'file-loader',
                    // },
                    {
                        loader:'url-loader',  //自带了file-loader功能
                        options:{
                            limit:5000,//限制文件大小
                            outputPath:'images/'  //打包之后的位置
                        }
                    },
                ]
            },{
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                    // options:{ 写到babelrc文件
                    //     presets:["es2015","react"]//使用哪些渲染器
                    // }
                },
                exclude:/node_modules///去除掉node_modules文件里面的js
            }
        ]
    },//打包css，图片转换压缩配置
    plugins:[
       new webpack.ProvidePlugin({
            $:'jquery'
       }),
       new uglify(),   //使用插件之前要先引用
       new htmlPlugin({
           minify:{
               removeAttributeQuotes:true, //   去掉id="title" 的引号
           },
           hash:true,  //避免产生缓存
           template:'./src/index.html',//找到路径
       }),
        new extractTextPlugin("css/index.css"), //打包之后css的路径 如果生成的是图片地址的话，还需要去用 output下面的 publicPath
        new purifyCssPlugin({
            paths:glob.sync(path.join(__dirname,'src/*.html'))
        })    
    ], //插件
    devServer:{
        contentBase:path.resolve(__dirname,'dist'), //基本目录结构，使用绝对路径
        host:'10.0.0.145', //使用ipconfig得到的ip地址  主机地址
        compress:true,//服务器压缩
        port:8080,  //自己选择使用
        //配置完基础的还需要安装cnpm install webpack-dev-server --save-dev  
        //去package.json增加  
    } //配置开发服务    
}