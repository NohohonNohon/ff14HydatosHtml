var NMData;

var main = (function() {

	var ImportNMList;

	/**
	* LocalStrageからNMデータを読み込む
	* データが無ければ、初期値を設定する
	*/
	function loadData() {
		var NMDataJson = localStorage.getItem('NMData_Hydatos');
		var importNMListJson = localStorage.getItem('NMList_Hydatos');
		var version = localStorage.getItem('Version_Hydatos');
		//データがない場合初期値設定
		if(NMDataJson == null || importNMListJson == null) {
			main.resetData(false);
			loadData();
			return;
		}
		if(version < $('#version').text()) {
			$('#oldMsg').css('display','inline');
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
			//NMが無いデータは行を非表示にする
			if(NMData[i][1] == '') {
				$(cells[1]).parent().css('display','none');
			} else {
				$(cells[0]).text(NMData[i][0]);
				$(cells[1]).text(NMData[i][1]);
				$(cells[4]).text(NMData[i][2]);
				$(cells[5]).text(NMData[i][3]);
				$(cells[6]).text(NMData[i][4]);
			}
			i++;
		});
	}

	/**
	* 天気情報をプルダウンに設定
	*/
	function setWeatherData() {
		var weathers = WeatherFinder.weatherLists['Hydatos'];
		var selects = $("#HopeWeather").add("#BeforeWeather");
		for (var w in weathers) {
			selects.append('<option value="' + weathers[w].id + '">' + WeatherFinder.getWeatherName(weathers[w].id) + '</option>');
		}
	}

	var global = {

		/**
		 * ページの初期処理
		 */
		init: function() {
			loadData();
			makeTable();
			setWeatherData();
			time.init();
			map.setMap();
			time.times();
			time.result();
		},

		/**
		 * シャウトテキストの取り込み
		 */
		importText: function(){
			var text = $('#importText').val();
			//時間を設定
			for (var i = 0; i < ImportNMList.length; i++) {
					try {
						var pattern = new RegExp(ImportNMList[i][0],'i');
						var result = text.match(pattern);
						result[0] = '';
						var time = result.join('');
						if (time.search(/^[0-9]+$/) == 0){
								//取得した時間が数値の場合、時間を設定
								$('#' + ImportNMList[i][1]).val(time);
						}
					} catch (e) {
							console.log(pattern);
							console.log(e);
					}
				}
		},

		/**
		 * 時間を初期化する
		 */
		clearTime: function(){
			for (var i = 0; i < 20; i++) {
				$("#NM"+('00'+i).slice(-2)).val("");
			}
			time.result();
		},

		/**
		 * 現在時刻を入力する
		 */
		pressNow: function(No){
			var jikan = new Date();
			var hour =('00'+jikan.getHours()).slice(-2);
			var minute =('00'+jikan.getMinutes()).slice(-2);
			var now = parseInt("" + hour + minute,10);
			$("#NM" + ('00'+No).slice(-2) ).val(now);
			time.result();
		},

		/**
		 * シャウト文をコピーする
		 */
		copyText: function(){
			$('#result').select();
			document.execCommand("copy");
		},

		/**
		* データをLocalStrageに設定する
		*/
		saveData: function() {
			var tempNMData;
			var tempNMList;
			var NMDataJson = $('#NMData').val();
			var importNMListJson = $('#ImportNMList').val();
			//NMDataの形式チェック
			try{
				tempNMData = JSON.parse(NMDataJson);
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
				tempNMList = JSON.parse(importNMListJson);
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
			localStorage.setItem('NMData_Hydatos', NMDataJson);
			localStorage.setItem('NMList_Hydatos', importNMListJson);
			alert($('#successMsg1').text());
		},

		/**
		* LocalStrageのデータを初期化する
		* @param {msgFlag} 成功メッセージを表示する(true:表示する、false:表示しない)
		*/
		resetData: function(msgFlag) {
			var tempNMData;
			var tempNMList;
			//	 EL,	NM,						Triger,					Lv,	Remarks,	x,	y,	shout1,				shout2,			shout3
			tempNMData=[
				['51',	'不明1',					'不明',					'--',	'',		'99.9',	'99.9',	'不明',				'不明',			'不明'		],
				['52',	'不明2',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['53',	'不明3',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['54',	'不明4',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['55',	'不明5',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['56',	'不明6',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['57',	'不明7',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['58',	'不明8',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['59',	'不明9',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['60',	'不明10',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['61',	'不明11',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['62',	'不明12',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['63',	'不明13',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['64',	'不明14',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['65',	'不明15',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['65',	'不明16',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['65',	'不明17',					'不明',					'--',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		]
			];

			tempNMList = [
				['不明1\\[(..):(..)\\]','NM01'],
				['不明1:(..):(..)','NM01'],
				['humei1\\[(..):(..)\\]','NM01']
			];
			localStorage.setItem('NMData_Hydatos', JSON.stringify(tempNMData));
			localStorage.setItem('NMList_Hydatos', JSON.stringify(tempNMList));
			localStorage.setItem('Version_Hydatos', $('#version').text());
			if(msgFlag) {
				alert($('#successMsg2').text());
			}
		},

		/**
		* シャウト文変更チェックボックスの表示を切り替える
		* @param {viewFlag} シャウト文変更チェックボックスを表示する(true:表示する、false:表示しない)
		*/
		viewChangeShout: function(viewFlag) {
			if(viewFlag) {
				$('#ChangeShout').removeClass('viewChangeShoutFalse');
				$('#ChangeShout').addClass('viewChangeShoutTrue');
			} else {
				$('#ChangeShout').removeClass('viewChangeShoutTrue');
				$('#ChangeShout').addClass('viewChangeShoutFalse');
			}
		},

		/**
		* 天気を検索する
		*/
		searchWeather: function() {
			$("#watherResult").html('');
			var weatherStartTime = WeatherFinder.getWeatherTimeFloor(new Date()).getTime();
			var weatherStartHour = WeatherFinder.getEorzeaHour(weatherStartTime);
			var zone = 'Hydatos';
			var targetWeather = $("#HopeWeather").val();
			var targetPrevWeather = $("#BeforeWeather").val();
			var tries = 0;
			var matches = 0;
			var weather = WeatherFinder.getWeather(weatherStartTime, zone);
			var prevWeather = WeatherFinder.getWeather(weatherStartTime-1, zone);
			while (tries < 1000 && matches < 3) {
				var weatherMatch = targetWeather == null;
				var prevWeatherMatch = targetPrevWeather == null;
				if (targetWeather == "" || targetWeather == weather.id) {
					weatherMatch = true;
				}
				if (targetPrevWeather == "" || targetPrevWeather == prevWeather.id) {
					prevWeatherMatch = true;
				}
				if (weatherMatch && prevWeatherMatch) {
					var weatherDate = new Date(weatherStartTime).toLocaleString();
					$("#watherResult").append('<tr><td>' + weatherStartHour + ':00</td><td>' + weatherDate + '</td></tr>');
					matches++;
				}
				weatherStartTime += 8 * 175 * 1000; // Increment by 8 Eorzean hours
				weatherStartHour = WeatherFinder.getEorzeaHour(weatherStartTime);
				prevWeather = weather;
				weather = WeatherFinder.getWeather(weatherStartTime, zone);
				tries++;
			}

			//検索該当無し
			if (matches == 0) {
				$("#watherResult").append('<td colspan="2">' + $('#noResultMsg').text() + '</td>');
			}
		},

		/**
		* 詳細設定ページに遷移する。
		*/
		moveSettingPage: function() {
			location.href='Setting.html';
		}
	};
	return global;
})();

