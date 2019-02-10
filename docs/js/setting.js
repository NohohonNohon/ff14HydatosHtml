var setting = (function() {

	var ImportNMList;

	var nms = [];
		 nms[0] = L.icon({
			iconUrl: 'mark/01.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[1] = L.icon({
			iconUrl: 'mark/02.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[2] = L.icon({
			iconUrl: 'mark/03.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[3] = L.icon({
			iconUrl: 'mark/04.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[4] = L.icon({
			iconUrl: 'mark/05.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[5] = L.icon({
			iconUrl: 'mark/06.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[6] = L.icon({
			iconUrl: 'mark/07.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[7] = L.icon({
			iconUrl: 'mark/08.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[8] = L.icon({
			iconUrl: 'mark/09.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[9] = L.icon({
			iconUrl: 'mark/10.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[10] = L.icon({
			iconUrl: 'mark/11.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[11] = L.icon({
			iconUrl: 'mark/12.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[12] = L.icon({
			iconUrl: 'mark/13.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[13] = L.icon({
			iconUrl: 'mark/14.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[14] = L.icon({
			iconUrl: 'mark/15.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[15] = L.icon({
			iconUrl: 'mark/16.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[16] = L.icon({
			iconUrl: 'mark/17.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[17] = L.icon({
			iconUrl: 'mark/18.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[18] = L.icon({
			iconUrl: 'mark/19.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});
		 nms[19] = L.icon({
			iconUrl: 'mark/20.png',
		
			iconSize: [32, 32],
			iconAnchor: [16,16],
			popupAnchor: [0, -8],
		});

	/**
	* LocalStrageからNMデータを読み込む
	* データが無ければ、初期値を設定する
	*/
	function loadData() {
		var NMDataJson = localStorage.getItem('NMData_Hydatos');
		var importNMListJson = localStorage.getItem('NMList_Hydatos');
		//データがない場合初期値設定
		if(NMDataJson == null || importNMListJson == null) {
			main.resetData(false);
			loadData();
			return;
		}
		NMData = JSON.parse(NMDataJson);
		ImportNMList = JSON.parse(importNMListJson);
		$('#NMData').val(NMDataJson);
		$('#ImportNMList').val(importNMListJson);
	}

	/**
	* NMテーブルを作成する
	*/
	function makeTable() {
		var i = 0;
		$('#NMTable tbody tr').each(function(){
			var cells = $(this).children();
			var j = 0;
			$(cells).each(function() {
				var inputElem = $(this).children()[0];
				$(inputElem).val(NMData[i][j]);
				j++;
			});
			i++;
		});
	}

	var global = {

		/**
		 * ページの初期処理
		 */
		init: function() {
			loadData();
			makeTable();
			map.setMap();
			setting.setMark();
		},

		/**
		* JSONデータを出力する。
		*/
		outputData: function() {
			var tempNMData = new Array(20);
			var tempNMList = [];
			var i = 0;
			$('#NMTable tbody tr').each(function(){
				var cells = $(this).children();
				var j = 0;
				tempNMData[i] = new Array(10);
				$(cells).each(function() {
					var inputElem = $(this).children()[0];
					tempNMData[i][j] = $(inputElem).val();
					j++;
				});
				if (NMData[i][1] != '') {
					//シャウト取り込み正規表現JSONデータ
					for (var k = 0; k < 3; k++) {
						if (tempNMData[i][7 + k] != '') {
							var tempListData = new Array(2);
							var nmNo = 'NM' + ('0' + (i+ 1)).slice(-2);
							tempListData[0] = tempNMData[i][7 + k] + '\\[(..):(..)\\]';
							tempListData[1] = nmNo;
							tempNMList.push(tempListData);
							tempListData = new Array(2);
							tempListData[0] = tempNMData[i][7 + k] + ':(..):(..)';
							tempListData[1] = nmNo;
							tempNMList.push(tempListData);
						}
					}
				}
				i++;
			});
			//NMDataの形式チェック
			try{
				for (var i = 0; i < tempNMData.length; i++) {
					if(tempNMData[i].length != 10){
						alert($('#errorMsg1').text().replace('$',i+1)	);
						return;
					}
					if(isNaN(tempNMData[i][5])){
						alert($('#errorMsg2').text().replace('$',i+1));
						return;
					}
					if(isNaN(tempNMData[i][6])){
						alert($('#errorMsg3').text().replace('$',i+1));
						return;
					}
				}
			} catch(e) {
				alert($('#errorMsg6').text().replace('$',i+1));
				console.log(e);
				return;
			}
			//NMListの形式チェック
			try{
				var regex = new RegExp(/NM0[1-9]|1[0-9]|20/);
				for (var i = 0; i < tempNMList.length; i++) {
					if(tempNMList[i].length != 2){
						alert($('#errorMsg4').text().replace('$',i+1));
						return;
					}
					if(!tempNMList[i][1].match(regex)){
						alert($('#errorMsg5').text().replace('$',i+1));
						return;
					}
				}
			} catch(e) {
				alert($('#errorMsg6').text().replace('$',i+1));
				console.log(e);
				return;
			}
			$('#NMData').val(JSON.stringify(tempNMData));
			$('#ImportNMList').val(JSON.stringify(tempNMList));
			$('#ShareJSON').val(
				'\n\n' +
				'[NMデータJSONデータ:---\n' +
				JSON.stringify(tempNMData) + '\n' +
				'---]\n\n' +
				'[シャウト取り込み正規表現JSONデータ:---\n' +
				JSON.stringify(tempNMData) + '\n' +
				'---]'
			)
			alert($('#successMsg3').text());
		},

		/**
		* マップ上にマーカーをセットする。
		*/
		setMark: function() {
			var i = 0;
			$('#NMTable tbody tr').each(function(){
				try {
					var cells = $(this).children();
					var x = $($(cells[5]).children()).val();
					var y = $($(cells[6]).children()).val();
					if (markinga[i] != null) {
						markinga[i].remove(mapObj);
					}
					markinga[i] = L.marker(map.getLatlng(x,y), {icon: nms[i]});
					markinga[i].addTo(mapObj);
					i++;
				} catch(e) {}
			});
		}
	};
	return global;
})();
