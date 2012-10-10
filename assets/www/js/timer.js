var timer = {

	init : function(config) {
		this.config = config;
		this.html = $('html');
		
		this.counter = 0;
		this.timer = $.timer(this.timerTik, 1000, false);
		
		this.start = false;
		this.toggle = false;
		
		this.config.error.hide();
		
		this.bindEvents();
	},

	bindEvents : function() {
		var self = timer;

		self.config.startStop.on('click', self.startStop);
		self.config.reset.on('click', self.reset);

	},
	
	startStop: function(){
		var self = timer;
		self.start = !self.start;
		if(self.toggle){
			self.timer.play();
			return;
		}
		self.config.error.hide();
		if(self.start){
			self.config.startStop.text('Stop');
			if(self.config.inputSeconds.attr('value') > 60){ 
				self.config.error.show();
				self.config.startStop.text('Start');
				self.start = false;
				return; 
			}
			
			if(self.config.inputMinuten.attr('value') == ''){
				minuten = 0;
			} else {
				minuten = parseInt(self.config.inputMinuten.attr('value'));
			}
			
			if(self.config.inputSeconds.attr('value') == ''){
				seconden = 0;
			} else {
				seconden = parseInt(self.config.inputSeconds.attr('value'));
			}
			
			self.counter = minuten * 60 + seconden;
			self.config.inputs.hide();
			self.timer.play();
			self.toggle = false;
			
			// timer loop
			
			// self.timer.play();
			
		} else {
			// timer staat stil
			self.config.startStop.text('Start');
			self.timer.pause();
			self.toggle = true;
			
		}
	},
	
	reset: function(){
		var self = timer;

		self.config.startStop.text('Start');
		self.start = false;
		self.toggle = false;
		self.config.minuten.text('00');
		self.config.seconds.text('00');
		self.config.inputs.show();
		self.timer.pause();
	},
	
	timerTik: function(){
		var self = timer;
		
		var seconds = (Math.round(self.counter % 60)).toString(),
			minuten = (Math.floor(self.counter / 60)).toString();

		if(seconds.length == 1){ seconds = '0' + seconds.toString(); }
		if(minuten.length == 1){ minuten = '0' + minuten.toString(); }
		
		self.config.seconds.text(seconds);
		self.config.minuten.text(minuten);
		
		if(self.counter == 0){
			self.timer.stop();
			alert('De tijd is om.');
			return;
		}
		
		self.counter-=1;
	},

}