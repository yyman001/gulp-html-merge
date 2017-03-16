var through = require('through-gulp');

// exporting the plugin 
module.exports = htmlMerge;

  var tag = []; //���ɨ���λ�ñ�ǩ
  var fileStorage = []; //����ȫ�������ļ�
  var tagObj = {};  //��ű����������
  var filter = ''; //���˵ı�ǩ
function htmlMerge(data) {
  // creating a stream through which each file will pass

  if( arguments[0] !== undefined && arguments[0].length){
	  filter = arguments[0].join(',')
  }
 
  var stream = through(function(file, encoding,callback) {
    // do whatever necessary to process the file
    if (file.isNull()) {

    }
    if (file.isBuffer()) {
		//console.log('�ļ�����')
		fileStorage.push(file)
		//var data = Buffer.concat([file.contents]).toString();
		var data = file.contents.toString(); //Ч��ͬ��
		// ɨ��
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
			file.contents = new Buffer(result); //�����ļ�����
			this.push(file); //����д���ļ�
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
	  
	  
	  if(!filter || filter.indexOf($2) === -1){  //���ǹ����б�
		  
		  tag.push($2); //����tag
	  
		  if(typeof $2 !== 'undefined'){
			  tagObj[$2] = newString.replace('\n','');
		  }
	  
	  }
	  
	  
	  
	})
}


function replaceTag(data){
	 return data.replace(/<!--\s?@import:([\w\-\_]+)\s?-->/g,function($1,$2){
			var result = $1;
			tag.some(function(item,key){
				if(item === $2 && typeof tagObj[$2] !=='undefined'){
					result = tagObj[$2];
					return true; //�˳�ѭ��
				}
			})
		return result;
	})
}


