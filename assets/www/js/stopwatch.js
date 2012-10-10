var stopwatch = {

	init : function(config) {
		this.config = config;
		this.html = $('html');
		
		this.counter = 0;
		this.timer = $.timer(this.timerTik, 100, false);
		this.rondeCounter = 0;
		
		this.start = false;
		this.reset = false;
		
		this.bindEvents();
	},

	bindEvents : function() {
		var self = stopwatch;

		self.config.startStop.on('click', self.startStop);
		self.config.resetLab.on('click', self.resetLab);
		self.html.on('keypress', self.keypress);

	},
	
	keypress: function(event){
		var self = stopwatch;
		if(window.event){
			key = window.event.keyCode;     //Chrome
		} else {
			key = event.keyCode;     //firefox
		}
		if(key == 0){ self.resetLab(); }
		if(key == 13){ self.startStop(); }
	},
	
	startStop: function(){
		var self = stopwatch;
		self.start = !self.start;
		if(self.start){
			// stopwatch loop
			self.config.startStop.text('Stop');
			self.config.resetLab.text('Ronde');
			self.timer.play();
			
		} else {
			// stopwatch staat stil
			self.config.startStop.text('Start');
			self.config.resetLab.text('Reset');
			self.timer.pause();
			
		}
	},
	
	resetLab: function(){
		var self = stopwatch;
		if(self.start){
			// stopwatch loop - ronde
			self.rondeCounter++;
			$('<p>', { text: 'Ronde ' + self.rondeCounter + ' : ' + self.config.minuten.text() + ':' + self.config.seconds.text() + ':' + self.config.miliseconds.text()}).appendTo(self.config.rondes);
			
		} else {
			// stopwatch staat stil - reset
			self.counter = 0;
			self.rondeCounter = 0;
			self.config.rondes.empty();
			self.config.minuten.text('00');
			self.config.seconds.text('00');
			self.config.miliseconds.text('00');
		}
	},
	
	timerTik: function(){
		var self = stopwatch;
		
		var miliseconds = (self.counter % 10).toString(),
			seconds = (Math.round(self.counter % 600 / 10)).toString(),
			minuten = (Math.round(self.counter/600)).toString();

		//if(miliseconds.length == 1){ miliseconds = '0' + miliseconds.toString(); }
		if(seconds.length == 1){ seconds = '0' + seconds.toString(); }
		if(minuten.length == 1){ minuten = '0' + minuten.toString(); }
		
		self.config.miliseconds.text(miliseconds);
		self.config.seconds.text(seconds);
		self.config.minuten.text(minuten);
		self.counter+=1;
	},

}