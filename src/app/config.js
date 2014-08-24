angular.module('App.Config', []).constant('CONFIG', {
  
  // develop
  API_ROOT: 'http://101.231.216.75:8888/api',

  // production
  // API_ROOT: '/api',

  // localhost
  // API_ROOT: 'http://localhost/api',

  LOGIN_PATH: '../login.html',
  
  //permission
  PERMISSION_KEY: ['1111111', '0111111', '0001111', '0000101', '0001110', '0000100', '0000001'],
  PERMISSION_VALUE: ['拥有者', '编辑者', '查看上传者', '预览上传者', '查看者', '预览者', '上传者'],
  
  //文件ICO path
  ICONS_PATH: 'images/',
  
  //文件ICO
  ICONS : {
  	folder: {
	    small: 'web_files_personal.png',
		large: 'file_folder_large.png',
		small_share: 'web_files_shared.png',
		large_share: 'file_folder_share_large.png'
	},
	pdf: {
	    small: 'web_files_pdf.png',
		large: 'file_pdf_large.png'
	},
	xls: {
	    small: 'web_files_xls.png',
		large: 'file_els_large.png'
	},
	txt: {
	    small: 'web_files_txt.png',
		large: 'file_txt_large.png'
	},
	mp3: {
	    small: 'web_files_mp3.png',
		large: 'file_mp3_large.png'
	},
	mp4: {
	    small: 'web_files_video.png',
		large: 'file_mp4_large.png'
	},
	jpg: {
		small: 'web_files_jpeg.png',
		large: 'file_jpg_large.png'
	},
	doc: {
		small: 'web_files_doc.png',
		large: 'file_doc_large.png'
	},
	zip:{
		small: 'web_files_zip.png',
		large: 'file_zip_large.png'
	},
	ppt:{
		small: 'web_files_ppt.png',
		large: 'file_ppt_large.png'
	},
	all: {//default icon
	    small: 'web_files_unknown.png',
		large: 'file_default_large.png'
	}
  }
  
})
