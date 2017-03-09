var through = require('through-gulp');

// exporting the plugin 
module.exports = htmlMerge;

  var tag = []; //���ɨ���λ�ñ�ǩ
  //var tagDate = []; //��ű����������
  var fileStorage = []; //����ȫ�������ļ�
  var tagObj = {};  //��ű����������
function htmlMerge() {
  // creating a stream through which each file will pass
  
  
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
		//console.log(tag)
		//console.log(tagObj)
		var result = '';
		//var target = this;
      fileStorage.forEach(function(file,key){
		  var data = file.contents.toString();
			result = replaceTag(data);
			//console.log('data:',result);
			file.contents = new Buffer(result); //�����ļ�����
			//target.push(file); //����д���ļ�
			this.push(file); //����д���ļ�
	  },this);
	  
      callback();
    })
	
  // returning the file stream
  return stream;
};

function scanTag(data){
	return data.replace(/<!--\s?@block:([\w\-\_]+)\s?-->\s*((\s|[^@])*)\s?@end\s?-->/g,function($1,$2,$3){
	 // console.log('$1=>',$1)  // <!-- @block: tag -->
	 // console.log('$2=>',$2) //tag
	//  console.log('$3=>',$3)  // html+ <--	
	  
	  var lastIndex = $3.indexOf("<!--");
	  var newString = '';

	  if(lastIndex > 10){
		  newString = $3.slice(0,lastIndex)
		  //console.log('$3--slice=>',newString)
	  }
	  
	  tag.push($2); //����tag
	  //tagDate.push(newString); //����html����
	  
	  if(typeof $2 !== 'undefined'){
		  tagObj[$2] = newString.replace('\r\n','');
	  }
	  
	  //return $1;
	})
}


function replaceTag(data){
	 return data.replace(/<!--\s?@import:([\w\-\_]+)\s?-->/g,function($1,$2){
		    //console.log('$1:===>',$1); //???
		    //console.log('$2:===>',$2); //tag
			//console.log('tag:===>',tag); //tag
			//console.log('tag.length:',tag.length)
			var result = $1;
			
			tag.some(function(item,key){
				// console.log('item:',item);
				if(item === $2 && typeof tagObj[$2] !=='undefined'){
					result = tagObj[$2];
					return true; //�˳�ѭ��
				}
			})
			
			//�滻����-----
			/*for(var i = 0;i < tag.length ; i++){
				if($2 === tag[i]){
					noTag = false;
					console.log('>>>>>>',i,$2);
					//�滻����
					return tagDate[i];
				}else{
					noTag = true;
				}
				
			}
			if(noTag){return $1;}*/
		return result;
	})
}


