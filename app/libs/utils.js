/**
 * utils
 * Authors: Michael Luo
 * Date: 16/12/24
 * Desc:
 * Copyright (c) 2016 caiyunapp.com. All rights reserved.
 */
exports.commonResult = function (statusCode, msgStr, data) {
  var result = {status: statusCode, msg: msgStr, res: data};
  return result;
};

/**
 * 通用应答的Response实体结构
 * @param res
 * @param status
 * @param data
 * @param type
 */
exports.commonResponse = function (res, status, data, type) {

  var contentType = 'application/json';
  if (type) contentType = type;
  if (data === undefined) data = {};
  res.status(status)
    .set('Set-Cookie', {'zly_session_id': '10001'})
    .set('Content-Type', contentType)
    .set('Access-Control-Allow-Origin', '*')
    .json(data);
};
/**
 * 获取当前要查询的分页条件
 * @param req
 * @param defaultFrom
 * @param defaultPageSize
 * @returns {{$slice: *[]}}
 */
exports.getCurrentPageSlice = function (req, defaultFrom, defaultPageSize, defaultSort) {
  var from = defaultFrom;
  var pageSize = defaultPageSize;
  var size = parseInt(req.query.pageSize);
  var num = parseInt(req.query.pageNum);
  var sorts = {'createdAt': 1};//按日期从小到大排列//{'createDate': -1}//按日期从大到小排序
  //pageSlice.sort = sort;
  //console.info(size + " : " + num + "  :" + typeof(size));
  if ((typeof(size) === 'number') && size > 0)
    pageSize = size;
  if ((typeof(num) === 'number') && num > 0)
    from = num * pageSize;
  var slices = {skip: from, limit: pageSize};
  if (defaultSort) {
    sorts = defaultSort;
    slices.sort = sorts;
  } else {
    slices.sort = sorts;
  }

  console.info(util.inspect(slices));
  return slices;
};