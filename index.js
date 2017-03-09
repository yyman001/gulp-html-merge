var through = require('through-gulp');

// exporting the plugin 
module.exports = htmlMerge;

  var tag = []; //存放扫描的位置标签
  var fileStorage = []; //缓存全部加载文件
  var tagObj = {};  //存放标记内容区域
function htmlMerge() {
  // creating a stream through which each file will pass
  
  
  var stream = through(function(file, encoding,callback) {
    // do whatever necessary to process the file
    if (file.isNull()) {

    }
    if (file.isBuffer()) {
		//console.log('文件处理')
		fileStorage.push(file)
		//var data = Buffer.concat([file.contents]).toString();
		var data = file.contents.toString(); //效果同上
		// 扫描
		scanTag(data)

    }
    if (file.isStream()) {

    }
    // just pipe data next, or just do nothing to process file later in flushFunction
    // never forget callback to indicate that the file has been processed.
      
      callback();
    }, function(callback) {
	  var result = '';
      fileStorage.forEach(function(file,key){
		  var data = file.contents.toString();
			result = replaceTag(data);
			file.contents = new Buffer(result); //更新文件内容
			this.push(file); //重新写入文件
	  },this);
	  
      callback();
    })
	
  // returning the file stream
  return stream;
};

function scanTag(data){
	return data.replace(/<!--\s?@block:([\w\-\_]+)\s?-->\s*((\s|[^@])*)\s?@end\s?-->/g,function($1,$2,$3){

      var lastIndex = $3.indexOf("<!--");
	  var newString = '';

	  if(lastIndex > 10){
		  newString = $3.slice(0,lastIndex)
	  }
	  
	  tag.push($2); //存入tag
	  
	  if(typeof $2 !== 'undefined'){
		  tagObj[$2] = newString.replace('\r\n','');
	  }
	})
}


function replaceTag(data){
	 return data.replace(/<!--\s?@import:([\w\-\_]+)\s?-->/g,function($1,$2){
			var result = $1;
			tag.some(function(item,key){
				if(item === $2 && typeof tagObj[$2] !=='undefined'){
					result = tagObj[$2];
					return true; //退出循环
				}
			})
		return result;
	})
}


