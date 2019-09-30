const NUMBER_OF_ITEMS = 1,
	NUMBER_OF_ROWS = 7,
	NUMBER_OF_ADDITIVE_ROWS = 0;

let objOfYMT = {
	numberOfMaterialRows: NUMBER_OF_ROWS,
	numberOfItemRows: NUMBER_OF_ROWS,
	numberOfAdditiveRows: NUMBER_OF_ADDITIVE_ROWS,

	additives: {
		idOfItem: 0,
		rowNo: 0,
		value: 0,
		ratio: 0
	},
	valuesOfInput: {
		id: [],
		value: []
	}


}


/*idを作り出すするシンプルな関数*/
/*画面idは3つの要素から成り立つ (セクション番号+列番号+行番号)*/
function getID(sect, col, row) {

	//先頭0埋め
	let sect0 = ('00' + sect).slice(-2);
	let col0 = ('00' + col).slice(-2);
	let row0 = ('00' + row).slice(-2);
	//数字を結合してidを作る
	let id = 'id' + sect0 + col0 + row0
	//出来上がったidを返す
	return id;
}

/*2数を掛け合わせるシンプルな関数*/
function getValue(idOfRatio, idOfPerKG, idOfValue) {

	let obj = {
		"ratio": document.getElementById(idOfRatio).value,
		"perKG": document.getElementById(idOfPerKG).value,
	}

	obj["ratio"] = Number(obj["ratio"]);
	obj["perKG"] = Number(obj["perKG"]);

	if (obj["ratio"] === 0) {
		obj["perKG"] = 0;
		obj["value"] = 0;
		return obj;
	}

	//歩留×原料単価
	obj["value"] = (obj["ratio"] * 1000) * obj["perKG"] / 100000;
	//画面に出力
	document.getElementById(idOfValue).value = Math.round(obj["value"] * 1000) / 1000;

	//戻り値{歩留、原料単価、原料評価}
	return obj;

}


/*可食部位単価を求めるシンプルな関数*/
function getValueOfItem(idOfRatio, idOfPerKG, idOfValue) {

	let ratio = document.getElementById(idOfRatio).value;
	let perKG = document.getElementById(idOfPerKG).value;

	ratio = Number(ratio);
	perKG = Number(perKG);

	//原料単価/可食比率
	let ans = perKG / (ratio * 1000) * 100000;
	//画面に出力
	document.getElementById(idOfValue).value = Math.round(ans * 1000) / 1000;
}

/*製品単価の計算*/
function culcOfItems() {
	//品目の数(NUMBER_OF_ITEMS)セット
	//品目の数だけ計算を繰り返す
	for (let i = 0; i < NUMBER_OF_ITEMS; i++) {

		let objctOfId = {
				"sect": i + 1,
				"col": "",
				"row": ""
			},
			objOfItem = {
				"ratio": 0,
				"perKG": 0,
				"value": 0
			},
			sumOfItem = {
				"ratio": 0,
				"perKG": 0,
				"value": 0
			},
			idOfSum;

		//品目の行数（NUMBER_OF_ROWS）回計算を繰り返す
		for (let j = 0; j < objOfYMT.numberOfItemRows; j++) {

			//行番号取得
			objctOfId["row"] = j + 1;

			//可食比率列のID取得
			objctOfId["col"] = 1;
			let idOfRatio = getID(objctOfId["sect"], objctOfId["col"], objctOfId["row"])
			//原料単価(円/kg)列のID取得
			objctOfId["col"] = 2
			let idOfperKG = getID(objctOfId["sect"], objctOfId["col"], objctOfId["row"])
			//可食部位単価列のID取得
			objctOfId["col"] = 3
			let idOfvalue = getID(objctOfId["sect"], objctOfId["col"], objctOfId["row"])

			//合計行の集計
			objOfItem = getValue(idOfRatio, idOfperKG, idOfvalue);
			sumOfItem["ratio"] += objOfItem["ratio"];
			sumOfItem["perKG"] += objOfItem["perKG"];
			sumOfItem["value"] += objOfItem["value"];

		}
		//可食比率が0の場合処理を飛ばす。0は認識。
		if (sumOfItem["ratio"] === 0) {
			continue;
		}
		//合計行を画面に出力
		document.getElementById("sumOfItemRatio").value = Math.round(sumOfItem["ratio"] * 1000) / 1000;
		document.getElementById("sumOfItemvaluePerKG").value = Math.round(sumOfItem["perKG"] * 1000) / 1000;
		document.getElementById("sumOfItemValue").value = Math.round(sumOfItem["value"] * 1000) / 1000;
	}
}


/*原料単価とその平均値を求める関数*/
function culcOfMaterials() {
	let numOfMaterials = 0,
		ratio = 0,
		perKgOfMatrls = 0,
		perkgOfItems = 0;
	let objctOfId = {
		"sect": 0,
		"col": "",
		"row": ""
	};

	//品目の行数（NUMBER_OF_ROWS）回計算を繰り返す
	for (let j = 0; j < objOfYMT.numberOfMaterialRows; j++) {

		//行番号取得
		objctOfId["row"] = j + 1;
		//可食比率列のID取得
		objctOfId["col"] = 1;
		let idOfRatio = getID(objctOfId["sect"], objctOfId["col"], objctOfId["row"])
		//原料単価(円/kg)列のID取得
		objctOfId["col"] = 2
		let idOfperKgOfMatrls = getID(objctOfId["sect"], objctOfId["col"], objctOfId["row"])
		//可食部位単価列のID取得
		objctOfId["col"] = 3
		let idOfperkgOfItems = getID(objctOfId["sect"], objctOfId["col"], objctOfId["row"])

		//画面の数値取得
		let localRatio = Number(document.getElementById(idOfRatio).value);

		//可食比率が空白の場合処理を飛ばす。0は認識。
		if (localRatio === 0) {
			continue;
		}

		//可食部位単価計算、画面出力
		getValueOfItem(idOfRatio, idOfperKgOfMatrls, idOfperkgOfItems);

		//画面の数値取得
		let localPerKgOfMatrls = Number(document.getElementById(idOfperKgOfMatrls).value);
		let localPerkgOfItems = Number(document.getElementById(idOfperkgOfItems).value);

		//集計
		ratio += localRatio;
		perKgOfMatrls += localPerKgOfMatrls;
		perkgOfItems += localPerkgOfItems;
		numOfMaterials += 1;
	}

	if (numOfMaterials === 0) {
		return false;
	}

	//入力されている品目数で割った平均値を画面に出力　小数点第3位以下を四捨五入
	document.getElementById("aveOfMateRatio").value = Math.round((ratio / numOfMaterials) * 1000) / 1000;
	document.getElementById("aveOfMateValue").value = Math.round((perKgOfMatrls / numOfMaterials) * 1000) / 1000;
	document.getElementById("aveOfItemValue").value = Math.round((perkgOfItems / numOfMaterials) * 1000) / 1000;
}


//求めたい部位(target)の単価を求める関数
function resultValueOfTarget() {
	let
		objSumOfItems = {
			"sumOfRatio": 0,
			"sumOfValue": 0
		};
	//合計行数値の取得
	let ratio = document.getElementById("sumOfItemRatio").value;
	let value = document.getElementById("sumOfItemValue").value;

	if (ratio === 0) {
		/*
		continue;
		*/
		return false;
	}

	objSumOfItems["sumOfRatio"] += Number(ratio);
	objSumOfItems["sumOfValue"] += Number(value);
	/*
		}
	*/
	//画面に出力　小数点第3位以下を四捨五入
	//他可食部位合計
	//歩留合計
	document.getElementById("idSumofRatioOfItems").value = Math.round(objSumOfItems["sumOfRatio"] * 1000) / 1000;

	//原料評価合計
	document.getElementById("idSumOfValueOfItems").value = Math.round(objSumOfItems["sumOfValue"] * 1000) / 1000;
	//求めたい可食部材(Target)
	let objTarget = {
		"ratioOfTarget": Math.round((100 - (objSumOfItems["sumOfRatio"])) * 1000) / 1000,
		"valueOfTarget": Math.round((document.getElementById("aveOfItemValue").value - objSumOfItems["sumOfValue"]) * 1000) / 1000
	}
	//歩留
	document.getElementById("idRatioOfTarget").value = objTarget["ratioOfTarget"];
	//原料評価
	document.getElementById("idValueOfTarget").value = objTarget["valueOfTarget"];
	//原料単価
	document.getElementById("idValurOfTargetPerKG").value = Math.round((objTarget["valueOfTarget"] / objTarget["ratioOfTarget"]) * 100000) / 1000;
}

//原料単価入力行の追加機能
function addMatelialRow() {
	objOfYMT.numberOfMaterialRows += 1;
	let tr_element = document.createElement("tr");
	//原料名称生成
	let id = getID(0, 0, objOfYMT.numberOfMaterialRows);
	let html = `<td><input type="text" name="nameOfMaterial" id="${id}" size="18" maxlength="20" placeholder="原料" title="名称を入力して下さい"/></td>`;
	//可食比率生成
	id = getID(0, 1, objOfYMT.numberOfMaterialRows);
	html += `<td><input type="number" name="ratioOfMaterial" id="${id}" size="8" maxlength="8" step="0.001" min = "0" max = "100" placeholder="00.000" oninput="culc();" title="加工前原料から取り出した可食部位の割合(%)"/>%</td>`;
	//原料単価(円/kg)生成
	id = getID(0, 2, objOfYMT.numberOfMaterialRows);
	html += `<td><input type="number" name="valueOfMaterial" id="${id}" size="14" maxlength="14" step="0.01" min = "0" placeholder="000.000" oninput="culc();" title="加工前原料の仕入単価(円)"/>円</td>`;
	//可食部位単価生成
	id = getID(0, 3, objOfYMT.numberOfMaterialRows);
	html += `<td><input type="number" name="valurOfMaterialPerKG" id="${id}" size="14" maxlength="14" placeholder=""  disabled="disabled" />円/kg</td>`;

	tr_element.innerHTML = html;
	let parentObject = document.getElementById("materials");
	parentObject.appendChild(tr_element);

}

//製品単価入力行の追加機能
function addItemRow(secNo) {
	objOfYMT.numberOfItemRows += 1;
	let tr_element = document.createElement("tr");
	tr_element.id = `product${objOfYMT.numberOfItemRows}`;
	//原料名称生成
	let id = getID(secNo, 0, objOfYMT.numberOfItemRows);
	let html = `<td><input type="text" name="nameOfItem" id="${id}" size="18" maxlength="20" placeholder="可食部位" title="名称を入力して下さい"/></td>`;
	//	let html = `<td>製品${objOfYMT.numberOfItemRows}</td>`;
	//可食比率生成
	id = getID(secNo, 1, objOfYMT.numberOfItemRows);
	html += `<td><input type="number" name="ratioOfItem" id="${id}" size="8" maxlength="8" step="0.001" min="0" max="100" placeholder="00.000" oninput="culc();" title="原料加工後の可食部から取り出した各部位の割合(%)" />%</td>`;
	//原料単価(円/kg)生成
	id = getID(secNo, 2, objOfYMT.numberOfItemRows);
	html += `<td><input type="number" name="valueOfItemPerKG" id="${id}" size="14" maxlength="14" step="0.01" min="0" placeholder="000.000" oninput="culc();" title="添加物などを含まない原料単価(円)" />円</td>`;
	//可食部位単価生成
	id = getID(secNo, 3, objOfYMT.numberOfItemRows);
	html += `<td><input type="number" name="valurOfItem" id="${id}" size="14" maxlength="14" placeholder="" disabled="disabled" />円/kg</td>`;

	tr_element.innerHTML = html;
	let parentObject = document.getElementById("products");
	parentObject.appendChild(tr_element);

}

//添加物単価入力行の追加機能
function addAdditiveRow(secNo, itemId) {
	//加える行番号セット（初期値0に1を加える）
	objOfYMT.numberOfAdditiveRows += 1;

	//HTML生成
	let tr_element = document.createElement("tr");
	tr_element.id = `addOf${itemId}`;
	let html = `<td>添加物${objOfYMT.numberOfAdditiveRows}</td>`;
	//単価(円/kg)生成
	let id = getID(secNo, 1, objOfYMT.numberOfAdditiveRows);
	html += `<td><input type="number" name="valueOfAdditivePerKG" id="addOf${itemId}${id}" size="10" maxlength="10" step="0.001"	min="0" max="100" placeholder="00.000" oninput="culc();" title="添加物の単価(円/kg)" />円</td>`
	//添加比率(%)生成
	id = getID(secNo, 2, objOfYMT.numberOfAdditiveRows);
	html += `<td><input type="number" name="ratioOfAdditive" id="addOf${itemId}${id}" size="8" maxlength="8" step="0.001" min="0" placeholder="000.000" oninput="culc();" title="原料に対する添加物の比率(%)" />%</td>`

	tr_element.innerHTML = html;
	//let parentObject = document.getElementById("additives"); //index.htmlから探してしまう。よってadditivesを見つけられずエラーとなる。
	parentObject.appendChild(tr_element);

}


//添加物入力フォーム呼び出し
function additiveOpen(id) {
	window.open("./additive.html", "window1", "width=620px,height=300px");
	addAdditiveRow('1', id);

}

function culc() {
	culcOfMaterials();
	culcOfItems();
	resultValueOfTarget();
}


//数値をクリアするシンプルな関数
function clearInput() {
	//聞く
	if (window.confirm('クリアしますか？')) {
		//タグinputの要素取得
		let tagName = document.getElementsByTagName("input"),
			leng = tagName.length;
		//input要素の値を""で上書き
		for (let i = 0; i < leng; i++) {
			tagName[i].value = "";
		}
	}
}

//値をグルーバルオブジェクトobjYMTに保持する関数
function saveInputs() {

	//原料の値保持
	for (let j = 1; j <= objOfYMT.numberOfMaterialRows; j++) {
		//原料名称idの取得
		let id = getID(0, 0, j);
		//値の保持
		objOfYMT.valuesOfInput.id.push(id);
		objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
		//可食比率idの取得
		id = getID(0, 1, j);
		//値の保持
		objOfYMT.valuesOfInput.id.push(id);
		objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
		//原料単価(円/kg)idの取得
		id = getID(0, 2, j);
		//値の保持
		objOfYMT.valuesOfInput.id.push(id);
		objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
		//可食部位単価idの取得
		id = getID(0, 3, j);
		//値の保持
		objOfYMT.valuesOfInput.id.push(id);
		objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
	}

	//製品の値保持
	for (let i = 1; i <= NUMBER_OF_ITEMS; i++) {
		for (let k = 1; k <= objOfYMT.numberOfItemRows; k++) {
			//原料名称idの取得
			id = getID(i, 0, k);
			//値の保持
			objOfYMT.valuesOfInput.id.push(id);
			objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
			//可食比率idの取得
			id = getID(i, 1, k);
			//値の保持
			objOfYMT.valuesOfInput.id.push(id);
			objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
			//原料単価(円/kg)idの取得
			id = getID(i, 2, k);
			//値の保持
			objOfYMT.valuesOfInput.id.push(id);
			objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
			//原料評価(円)idの取得
			id = getID(i, 3, k);
			//値の保持
			objOfYMT.valuesOfInput.id.push(id);
			objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
		}
	}
	//計算結果フィールド、原料平均値、各セクション合計値の保持.

	id = "idRatioOfTarget"
	objOfYMT.valuesOfInput.id.push(id);
	objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
	id = "idValueOfTarget"
	objOfYMT.valuesOfInput.id.push(id);
	objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
	id = "idValurOfTargetPerKG"
	objOfYMT.valuesOfInput.id.push(id);
	objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
	id = "idSumofRatioOfItems"
	objOfYMT.valuesOfInput.id.push(id);
	objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
	id = "idSumOfValueOfItems"
	objOfYMT.valuesOfInput.id.push(id);
	objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
	id = "aveOfMateRatio"
	objOfYMT.valuesOfInput.id.push(id);
	objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
	id = "aveOfMateValue"
	objOfYMT.valuesOfInput.id.push(id);
	objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
	id = "aveOfItemValue"
	objOfYMT.valuesOfInput.id.push(id);
	objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
	id = "sumOfItemRatio"
	objOfYMT.valuesOfInput.id.push(id);
	objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
	id = "sumOfItemvaluePerKG"
	objOfYMT.valuesOfInput.id.push(id);
	objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);
	id = "sumOfItemValue"
	objOfYMT.valuesOfInput.id.push(id);
	objOfYMT.valuesOfInput.value.push(document.getElementById(id).value);



	console.log(objOfYMT.valuesOfInput);
}


//配列の縦横を入れ替え
//https://qiita.com/kznr_luk/items/790f1b154d1b6d4de398
const transpose = a => a[0].map((_, c) => a.map(r => r[c]));


//全値をダウンロード
//https://macoblog.com/jquery-csv-download/
//よりコピペ
$(function () {
	$('.btn').on('click', function () {

		//値をグローバル変数に格納
		saveInputs();

		// 配列 の用意
		//var array_data = [['りんご',1,200],['メロン',2,4000],['バナナ',4,500]];
		let leng = Object.keys(objOfYMT.valuesOfInput.id).length;
		let array_data = [],
			array_data_v = [],
			arrayId = [],
			arrayValue = [];

		//オブジェクトを配列に入れる
		for (let i = 0; i < leng; i++) {
			arrayId.push(objOfYMT.valuesOfInput.id[i]);
			arrayValue.push(objOfYMT.valuesOfInput.value[i]);
		}

		//配列を生成
		array_data_v = [arrayId, arrayValue];
		//配列の縦横を入れ替え
		array_data = transpose(array_data_v);

		// BOM の用意（文字化け対策）
		var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
		// CSV データの用意
		var csv_data = array_data.map(function (l) {
			return l.join(',')
		}).join('\r\n');

		var blob = new Blob([bom, csv_data], {
			type: 'text/csv'
		});

		var url = (window.URL || window.webkitURL).createObjectURL(blob);

		var a = document.getElementById('downloader');
		a.download = 'data.csv';
		a.href = url;

		// ダウンロードリンクをクリックする
		$('#downloader')[0].click();

	});
});