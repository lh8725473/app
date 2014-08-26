angular.module('App.Widgets').factory('Utils', [
  '$modal',
  'CONFIG',
  function(
    $modal,
    CONFIG
  ) {
	return {
		getIconByExtension : function(ext) {
			var icons = CONFIG.ICONS;
			var path = CONFIG.ICONS_PATH;
			//默认
			var icon = icons.all;
			ext = ext.toLowerCase();
			if (ext == 'folder') {
				icon = icons.folder;
			} else if (ext == 'pdf') {
				icon = icons.pdf;
			} else if (ext == 'txt') {
				icon = icons.txt;
			} else if (ext == 'mp3') {
				icon = icons.mp3;
			} else if (ext == 'mp4') {
				icon = icons.mp4;
			} else if (ext == 'xls' || ext == 'xlsx') {
				icon = icons.xls;
			} else if (ext == 'doc' || ext == 'docx') {
				icon = icons.doc;
			} else if (ext == 'jpg' || ext == 'jpeg' || ext == "png" || ext == 'gif' || ext == 'bmp' || ext == 'ico') {
				icon = icons.jpg;
			} else if (ext == 'zip' || ext == 'rar') {
				icon = icons.zip;
			} else if (ext == 'ppt' || ext == 'pptx') {
				icon = icons.ppt;
			}

			return {
				small : path + icon.small,
				large : path + icon.large
			}
		}
	}
}])