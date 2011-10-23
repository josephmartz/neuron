KM.define(function(K, require){


/**
 * @return {function()} returns a compiled template function
 */
function compile(template){
		
		// @type {string} set initial value of o as "", so o won't be 'undefined'
	var compiled = 'var o="";',
		
		// @type {Object} reader object of the compiler
		reader,
		
		matched_code, 
		matched_tpl,
		pos = 0,
		last = 'begin',
		
		compilers = COMPILERS,
		regex_scope = REGEX_JSTL_SCOPE;
	
	/**
	 * @type {Object} reader {
	 		'0': '<?js mycode ?>',
	 		'1': ' mycode ',
	 		index: {number},
	 		input: {string}
	   } 
	 */
	while((reader = regex_scope.exec(template)) !== null){
		matched_tpl = reader[0];
		matched_code = reader[1] || reader[2];
		
		// normal string
		if(reader.index > pos && reader.index > 0){
			compiled += compilers[last].addString
			         
			         // normal codes
			         + template.substring(pos, reader.index).replace(/"/g, '\\"');
			
			last = 'string';
		}
		
		// matched code slice
		if(matched_tpl.indexOf('<?js') === 0){
			compiled += compilers[last].addCode + matched_code;
			if(/\)$/.test(matched_tpl)){
				compiled += ';';
			}
			last = 'code';
		
		// matched code parameter
		}else if(matched_tpl.indexOf('@{') === 0){
			compiled += compilers[last].addParam + matched_code;
			last = 'param';
		}
		
		pos = reader.index + matched_tpl.length;
	}
	
	if(pos < template.length){
		compiled += compilers[last].addString + template.substring(pos).replace(/"/g, '\\"');
		last = 'string';
	}

	compiled += compilers[last].end + 'return o;';
 
	return new Function('it', compiled);
};


function parse(template){
	return compile(template.replace(REGEX_CRLF, EMPTY));
};


var 

/**
 * Carriage Return and Line Feed
 */
REGEX_CRLF = /[\t\r\n]/g,

EMPTY = '',

/**
 * JavaScript Template scope
 * <?js //code… ?>
 */
REGEX_JSTL_SCOPE = /<\?js(.+?)\?>|@\{(.+?)\}/g, // lazy match

COMPILERS = {
	begin: {
		// the end of the matched code slice
		addString: 	'o+="',
		addCode: 	EMPTY, 
		addParam: 	'o+='
	},
	
	string: {
		addString: 	EMPTY, 
		addCode: 	'";', 
		addParam: 	'"+',
		end: 		'";'
	},
	
	code: {
		addString: 	'o+="', 
		addCode: 	EMPTY,
		addParam: 	'o+=',
		end: 		EMPTY
	},
	
	param: {
		addString: 	'+"',
		addCode: 	';', 
		addParam: 	'+',
		end: 		';'
	}
};



return {
	/**
	 * @param {string} template JavaScript template
	 * @param {Object} data module
	 
	 * @return {string} rendered string
	 */
	render: function(template, data){
		return parse(template)(data);
	},
	
	parse: parse
}

});


/**
 change log:
 2011-10-23  Kael:
 - complete main functions tpl.render and tpl.parse of JavaScript Template engine
 
 
 */
