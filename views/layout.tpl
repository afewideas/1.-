<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0" /> <!--设备自适应-->
    <title>{% block title %} [[title]] {% endblock  %}</title>
    <link rel="stylesheet" href="/bootstrap-3.3.7-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/layout.css">
    <link rel="stylesheet" href="/css/[[page]].css">
    <link rel="shortcut icon" href="http://ibootstrap-file.b0.upaiyun.com/www.layoutit.com/img/favicon.png">
    <script type="text/javascript" src="/socket.io/socket.io.js"></script>
    <script type="text/javascript" src="/jquery/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="/jgestures/jgestures.min.js"></script>
    <script type="text/javascript" src="/qrcodejs-master/qrcode.js"></script>
    <script type="text/javascript" src="/angular.js-1.4.6/angular.min.js"></script>
    <script type="text/javascript" src="/js/layout.js"></script><!--angularjs文件-->
    <script type="text/javascript" src="/js/[[page]].js"></script><!--angularjs文件-->

    {% block head %}{% endblock  %}



    <base href="/" /> <!--angular $location:nobase-->


  </head>
  <body ng-app="frameApp">
  <script>
    var logged_in = {% autoescape false %} [[logged_in]] {% endautoescape %}; 

    {% if initData !== null %}
    var initData = {% autoescape false %} [[initData]] {% endautoescape %} ; 
    {% endif %}

    var socket = null;

  </script>
 

  {% include 'layout_header.html' %}

  

  {% block content %}
  {% set tpl = 'pages/'+[[page]]+'.html' %}
  {% include tpl %}
  {% endblock  %}

  {% include 'layout_footer.html' %}
  
  </body>

</html>
