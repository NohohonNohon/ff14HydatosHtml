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
				['50',	'奇怪なる鳥賊「カラマリ」',			'ゾミト',				'55',	'',		'11.1',	'25.2',	'カラマリ',			'カラマリ',		'カラマリ'	],
				['51',	'暴虐の魔獣「ステゴドン」',			'ヒュダトス・プレメレファス',		'56',	'',		'10.0',	'17.8',	'ステゴドン',			'ゾウ',			'ステゴ'	],
				['52',	'落涙の君主「モレク」',				'バル・ヌルチュー',			'57',	'',		'7.9',	'22.1',	'モレク',			'モレク',		'モレク'	],
				['53',	'極彩色の怪鳥「ピアサ」',			'ヴィヴィット・ガストルニス',		'58',	'',		'6.7',	'14.3',	'ピアサ',			'ピアサ',		'ピアサ'	],
				['54',	'孤高の狩人「フロストメーン」',			'ノーザン・タイガー',			'59',	'',		'7.8',	'26.1',	'フロストメーン',		'フロスト',		'メーン'	],
				['55',	'血濡れの妖妃「ダフネ」',			'ダーク・ヴォイドモンク',		'60',	'',		'25.6',	'16.2',	'ダフネ',			'ダフネ',		'ダフネ'	],
				['56',	'異界の鍛冶王「キング・ゴルデマール」',		'ヒュダトス・レイス',			'61',	'',		'28.8',	'23.6',	'キング・ゴルデマール',		'キング',		'マール'	],
				['57',	'食妖植物「レウケー」',				'タイガーホーク',			'62',	'',		'37.3',	'27.0',	'レウケー',			'レウケー',		'レウケー'	],
				['58',	'業炎の獅子王「バロン」',			'ラボラトリー・ライオン',		'63',	'',		'35.2',	'25.1',	'バロン',			'バロン',		'バロン'	],
				['59',	'魔蛇の女王「ケートー」',			'デルピュネ',				'64',	'',		'36.4',	'13.7',	'ケートー',			'ケートー',		'ケートー'	],
				['60',	'水晶の龍「プロヴェナンス・ウォッチャー」',	'クリスタルクロー',			'65',	'',		'32.7',	'19.6',	'プロヴェナンス・ウォッチャー',	'ウォッチャー',		'水晶竜'	],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		],
				['',	'',						'',					'',	'',		'99.9',	'99.9',	'',				'',			''		]
			];

			tempNMList = [
				['カラマリ\\[(..):(..)\\]','NM01'],['カラマリ:(..):(..)','NM01'],
				['ゾウ\\[(..):(..)\\]','NM02'],['ゾウ:(..):(..)','NM02'],['ステゴドン\\[(..):(..)\\]','NM02'],['ステゴドン:(..):(..)','NM02'],['ステゴ\\[(..):(..)\\]','NM02'],['ステゴ:(..):(..)','NM02'],
				['モレク\\[(..):(..)\\]','NM03'],['モレク:(..):(..)','NM03'],
				['ピアサ\\[(..):(..)\\]','NM04'],['ピアサ:(..):(..)','NM04'],
				['フロストメーン\\[(..):(..)\\]','NM05'],['フロストメーン:(..):(..)','NM05'],['フロスト\\[(..):(..)\\]','NM05'],['フロスト:(..):(..)','NM05'],['メーン\\[(..):(..)\\]','NM05'],['メーン:(..):(..)','NM05'],
				['ダフネ\\[(..):(..)\\]','NM06'],['ダフネ:(..):(..)','NM06'],
				['キング・ゴルデマール\\[(..):(..)\\]','NM07'],['キング・ゴルデマール:(..):(..)','NM07'],['キング\\[(..):(..)\\]','NM07'],['キング:(..):(..)','NM07'],['マール\\[(..):(..)\\]','NM07'],['マール:(..):(..)','NM07'],
				['レウケー\\[(..):(..)\\]','NM08'],['レウケー:(..):(..)','NM08'],
				['バロン\\[(..):(..)\\]','NM09'],['バロン:(..):(..)','NM09'],
				['ケートー\\[(..):(..)\\]','NM10'],['ケートー:(..):(..)','NM10'],
				['プロヴェナンス・ウォッチャー\\[(..):(..)\\]','NM11'],['プロヴェナンス・ウォッチャー:(..):(..)','NM11'],['ウォッチャー\\[(..):(..)\\]','NM11'],['ウォッチャー:(..):(..)','NM11'],['水晶竜\\[(..):(..)\\]','NM11'],['水晶竜:(..):(..)','NM11'],
				['Khalamari\\[(..):(..)\\]','NM01'],['Khalamari:(..):(..)','NM01'],
				['Stegodon\\[(..):(..)\\]','NM02'],['Stegodon:(..):(..)','NM02'],
				['Molech\\[(..):(..)\\]','NM03'],['Molech:(..):(..)','NM03'],
				['Piasa\\[(..):(..)\\]','NM04'],['Piasa:(..):(..)','NM04'],
				['Frostmane\\[(..):(..)\\]','NM05'],['Frostmane:(..):(..)','NM05'],
				['Daphne\\[(..):(..)\\]','NM06'],['Daphne:(..):(..)','NM06'],
				['Goldemar\\[(..):(..)\\]','NM07'],['Goldemar:(..):(..)','NM07'],
				['Leuke\\[(..):(..)\\]','NM08'],['Leuke:(..):(..)','NM08'],
				['Barong\\[(..):(..)\\]','NM09'],['Barong:(..):(..)','NM09'],
				['Ceto\\[(..):(..)\\]','NM10'],['Ceto:(..):(..)','NM10'],
				['Provenance\\[(..):(..)\\]','NM11'],['Provenance:(..):(..)','NM11'],
				['(..):(..).*カラマリ','NM01'],
				['(.):(..).*カラマリ','NM01'],
				['(..):(..).*ステゴドン','NM02'],
				['(.):(..).*ステゴドン','NM02'],
				['(..):(..).*モレク','NM03'],
				['(.):(..).*モレク','NM03'],
				['(..):(..).*ピアサ','NM04'],
				['(.):(..).*ピアサ','NM04'],
				['(..):(..).*フロストメーン','NM05'],
				['(.):(..).*フロストメーン','NM05'],
				['(..):(..).*ダフネ','NM06'],
				['(.):(..).*ダフネ','NM06'],
				['(..):(..).*キング・ゴルデマール','NM07'],
				['(.):(..).*キング・ゴルデマール','NM07'],
				['(..):(..).*レウケー','NM08'],
				['(.):(..).*レウケー','NM08'],
				['(..):(..).*バロン','NM09'],
				['(.):(..).*バロン','NM09'],
				['(..):(..).*ケートー','NM10'],
				['(.):(..).*ケートー','NM10'],
				['(..):(..).*プロヴェナンス・ウォッチャー','NM11'],
				['(.):(..).*プロヴェナンス・ウォッチャー','NM11']

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

