var CONFIG = {

  // develop
  //API_ROOT: 'http://101.231.216.75:8888/api',

  // production
  API_ROOT: '/api',

  // localhost
  // API_ROOT: 'http://localhost/api',

  LOGIN_PATH: 'login.html',

  INDEX_PATH: '/index.html',

  //permission
  PERMISSION_KEY: ['1111111', '0111111', '0001111', '0000101', '0001110', '0000100', '0000001'],
  PERMISSION_VALUE: ['PERMISSION_VALUE_1', 'PERMISSION_VALUE_2', 'PERMISSION_VALUE_3', 'PERMISSION_VALUE_4', 'PERMISSION_VALUE_5', 'PERMISSION_VALUE_6', 'PERMISSION_VALUE_7'],

  //有拥有者权限的value与tooltip
  OWNER_PERMISSION_VALUE_TOOLTIP: [{v: '协同拥有者', t : '上传，下载，预览， 分享（包括邀请协作人和链接分享），编辑（包括编辑文档，更改协作人的权限，以及将协作人从文件夹中移除），删除文档'},
                                   {v: '编辑者', t : '与拥有者的权限完全相同，除了不能更改拥有者的权限'},
                                   {v: '查看上传者', t : '上传，下载，预览，链接分享'},
                                   {v: '预览上传者', t : '只能上传和预览文件'},
                                   {v: '查看者', t : '下载，预览，链接分享'},
                                   {v: '预览者', t : '只能预览文件'},
                                   {v: '上传者', t : '只能上传文件'}
                                  ],

  //无拥有者权限的value与tooltip
  NOOWNER_PERMISSION_VALUE_TOOLTIP: [{v: '编辑者', t : '与拥有者的权限完全相同，除了不能更改拥有者的权限'},
                                     {v: '查看上传者', t : '上传，下载，预览，链接分享'},
                                     {v: '预览上传者', t : '只能上传和预览文件'},
                                     {v: '查看者', t : '下载，预览，链接分享'},
                                     {v: '预览者', t : '只能预览文件'},
                                     {v: '上传者', t : '只能上传文件'}
                                    ],

  //文件ICO path
  ICONS_PATH: 'images/',

  //文件ICO
  ICONS: {
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
    zip: {
      small: 'web_files_zip.png',
      large: 'file_zip_large.png'
    },
    ppt: {
      small: 'web_files_ppt.png',
      large: 'file_ppt_large.png'
    },
    all: { //default icon
      small: 'web_files_unknown.png',
      large: 'file_default_large.png'
    }
  }
}