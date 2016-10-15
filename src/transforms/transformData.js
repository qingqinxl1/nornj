﻿'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  errorTitle = nj.errorTitle;

//提取style内参数
function styleProps(obj) {
  //If the parameter is a style object,then direct return.
  if (tools.isObject(obj)) {
    return obj;
  }

  //参数为字符串
  var pattern = /([^\s:]+)[\s]?:[\s]?([^\s;]+)[;]?/g,
    matchArr, ret;

  while ((matchArr = pattern.exec(obj))) {
    var key = matchArr[1],
      value = matchArr[2];

    if (!ret) {
      ret = {};
    }

    //Convert to lowercase when style name is all capital.
    if (/^[A-Z-]+$/.test(key)) {
      key = key.toLowerCase();
    }

    //将连字符转为驼峰命名
    key = tools.toCamelCase(key);

    ret[key] = value;
  }

  return ret;
}

//Get value from multiple datas
function getDatasValue(datas, prop) {
  var ret, obj;
  for (var i = 0, l = datas.length; i < l; i++) {
    obj = datas[i];
    if (obj) {
      ret = obj[prop];
      if (ret != null) {
        return ret;
      }
    }
  }
}

//获取each块中的item参数
function getItemParam(item, data, isArr) {
  var ret = item;
  if (isArr == null) {
    isArr = tools.isArray(data);
  }
  if (isArr) {
    ret = tools.listPush([item], data.slice(1));
  }

  return ret;
}

//修正属性名
function fixPropName(name) {
  switch (name) {
    case 'class':
      name = 'className';
      break;
    case 'for':
      name = 'htmlFor';
      break;
  }

  return name;
}

//合并字符串属性
function assignStringProp(paramsE, keys) {
  var ret = '';
  for (var k in paramsE) {
    if (!keys || !keys[k]) {
      ret += ' ' + k + '="' + paramsE[k] + '"';
    }
  }
  return ret;
}

//创建块表达式子节点函数
function exprRet(p1, p2, p3, fn, p5) {
  return function (param) {
    return fn(p1, p2, p3, param, p5);
  };
}

//构建可运行的模板函数
function tmplWrap(configs, main) {
  return function (data) {
    var args = arguments,
      len = args.length,
      data;

    if (len <= 0) {
      data = {};
    }
    else if (len === 1) {
      data = args[0];
    }
    else {
      data = [];
      for (var i = 0; i < len; i++) {
        data[data.length] = args[i];
      }
    }

    var ret = main(configs, { data: data, parent: this ? this.parent : null }, { multiData: nj.isArray(data) });
    if (!configs.useString && tools.isArray(ret)) {  //组件最外层必须是单一节点对象
      ret = ret[0];
    }

    return ret;
  };
}

//创建模板函数
function template(fns) {
  var configs = {
    useString: fns.useString,
    exprs: nj.exprs,
    filters: nj.filters,
    getDatasValue: nj.getDatasValue,
    noop: nj.noop,
    lightObj: nj.lightObj,
    throwIf: nj.throwIf,
    warn: nj.warn,
    getItemParam: nj.getItemParam,
    styleProps: nj.styleProps,
    assign: nj.assign,
    exprRet: nj.exprRet
  };

  if (!configs.useString) {
    configs.compPort = nj.componentPort;
    configs.compLib = nj.componentLibObj;
    configs.compClass = nj.componentClasses;
  }
  else {
    configs.assignStringProp = nj.assignStringProp;
    configs.escape = nj.escape;
  }

  tools.each(fns, function (v, k) {
    if (k.indexOf('main') === 0) {  //将每个主函数构建为可运行的模板函数
      configs[k] = tmplWrap(configs, v);
    }
    else if (k.indexOf('fn') === 0) {  //块表达式函数
      configs[k] = v;
    }
  }, false, false);

  return configs;
}

module.exports = {
  getItemParam: getItemParam,
  getDatasValue: getDatasValue,
  fixPropName: fixPropName,
  styleProps: styleProps,
  assignStringProp: assignStringProp,
  exprRet: exprRet,
  tmplWrap: tmplWrap,
  template: template
};