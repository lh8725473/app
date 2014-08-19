angular.module('App.Config', []).constant('CONFIG', {
  
  // develop
  API_ROOT: 'http://101.231.216.75:8888/api',

  // production
  // API_ROOT: '/api',

  // localhost
  // API_ROOT: 'http://localhost/api',

  LOGIN_PATH: '../login.html',
  
  //permission
  PERMISSION_KEY: ['1111111', '0111111', '0001111', '0000101', '0001110', '0111111', '0000100', '0000001'],
  PERMISSION_VALUE: ['拥有者', '编辑者', '查看上传者', '预览上传者', '查看者', '编辑者', '预览者', '上传者'],
  
  //文件ICO path
  ICONS_PATH: 'images/',
  
  //文件ICO
  ICONS : {
  	folder: {
	    small: 'file_folder_small.png',
		large: 'file_folder_large.png',
		small_share: 'file_folder_share_small.png',
		large_share: 'file_folder_share_large.png'
	},
	pdf: {
	    small: 'file_pdf_small.png',
		large: 'file_pdf_large.png'
	},
	xls: {
	    small: 'file_els_small.png',
		large: 'file_els_large.png'
	},
	txt: {
	    small: 'file_txt_small.png',
		large: 'file_txt_large.png'
	},
	mp3: {
	    small: 'file_mp3_small.png',
		large: 'file_mp3_large.png'
	},
	mp4: {
	    small: 'file_mp4_small.png',
		large: 'file_mp4_large.png'
	},
	jpg: {
		small: 'file_jpg_small.png',
		large: 'file_jpg_large.png'
	},
	doc: {
		small: 'file_doc_small.png',
		large: 'file_doc_large.png'
	},
	zip:{
		small: 'file_zip_small.png',
		large: 'file_zip_large.png'
	},
	ppt:{
		small: 'file_ppt_small.png',
		large: 'file_ppt_large.png'
	},
	all: {//default icon
	    small: 'file_default_small.png',
		large: 'file_default_large.png'
	}
  }
  
})
