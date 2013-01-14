var trucen = new Array();

trucen[0] = new Array(2);
trucen[0][0] = "42 : 6 + 3";
trucen[0][1] = 10;

trucen[1] = new Array(2);
trucen[1][0] = "6 x 5 - 10";
trucen[1][1] = 20;

trucen[2] = new Array(2);
trucen[2][0] = "48 : 12 + 8";
trucen[2][1] = 12;

trucen[3] = new Array(2);
trucen[3][0] = "33 : 3 + 3";
trucen[3][1] = 14;

trucen[4] = new Array(2);
trucen[4][0] = "13 + 19 + 14";
trucen[4][1] = "46";

trucen[5] = new Array(2);
trucen[5][0] = "9 : 3 + 21";
trucen[5][1] = 24;

trucen[6] = new Array(2);
trucen[6][0] = "9 x 3 - 11";
trucen[6][1] = 16;

trucen[7] = new Array(2);
trucen[7][0] = "9 x 3 + 11";
trucen[7][1] = 38;

trucen[8] = new Array(2);
trucen[8][0] = "6 x 6 + 6";
trucen[8][1] = 42;

trucen[9] = new Array(2);
trucen[9][0] = "6 x 6 - 6";
trucen[9][1] = 30;

trucen[10] = new Array(2);
trucen[10][0] = "55 - 22 - 12";
trucen[10][1] = 21;

trucen[11] = new Array(2);
trucen[11][0] = "34 + 13 + 18";
trucen[11][1] = 65;

trucen[12] = new Array(2);
trucen[12][0] = "55 : 5 + 2";
trucen[12][1] = 13;

trucen[13] = new Array(2);
trucen[13][0] = "11 + 99 + 100";
trucen[13][1] = 210;

trucen[14] = new Array(2);
trucen[14][0] = "5 x 8 + 310";
trucen[14][1] = 350;

trucen[15] = new Array(2);
trucen[15][0] = "10 : 1 + 9";
trucen[15][1] = 10;

trucen[16] = new Array(2);
trucen[16][0] = "21 : 3 - 3";
trucen[16][1] = 4;

trucen[17] = new Array(2);
trucen[17][0] = "3 x 6 + 18";
trucen[17][1] = 36;

trucen[18] = new Array(2);
trucen[18][0] = "50 - 41 - 6";
trucen[18][1] = 3;

trucen[19] = new Array(2);
trucen[19][0] = "36 : 9 + 6";
trucen[19][1] = 10;

trucen[20] = new Array(2);
trucen[20][0] = "54 : 9 - 3";
trucen[20][1] = 3;

trucen[21] = new Array(2);
trucen[21][0] = "16 x 3 + 50";
trucen[21][1] = 98;

trucen[22] = new Array(2);
trucen[22][0] = "48 : 8 - 5";
trucen[22][1] = 1;

trucen[23] = new Array(2);
trucen[23][0] = "39 - 30 + 9";
trucen[23][1] = 18;

trucen[24] = new Array(2);
trucen[24][0] = "9 x 3 - 11";
trucen[24][1] = 16;

trucen[25] = new Array(2);
trucen[25][0] = "34 : 17 + 10";
trucen[25][1] = 12;

trucen[26] = new Array(2);
trucen[26][0] = "35 : 5 - 7";
trucen[26][1] = 0;

trucen[27] = new Array(2);
trucen[27][0] = "10 x 5 + 12";
trucen[27][1] = 62;

trucen[28] = new Array(2);
trucen[28][0] = "27 + 16 - 8";
trucen[28][1] = 35;

trucen[29] = new Array(2);
trucen[29][0] = "43 - 13 + 6";
trucen[29][1] = 36;

var current;

function getTruc(){
	current = Math.floor((Math.random()*trucen.length));
	$('#pop-new-truc').css('display', 'block');
	$('#question').html(trucen[current][0]);
}

function otherTruc(){
	current = Math.floor((Math.random()*trucen.length));
	$('#question').html(trucen[current][0]);
}

function answer(){
	if($('#answer').val() == trucen[current][1]){
		alert('Goed');
	} else{
		alert('Fout');
	}
}

getTruc();