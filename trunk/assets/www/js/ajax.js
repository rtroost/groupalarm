/*
 * 
 * 	Deze api kan gebruikt worden voor het beheren van alle ajax requests. Op het moment dat er geen internet verbinding is kan een ajax request niet afgerond worden.
 * 	Als je jou ajax request toevoegd door middel van de window.ajax.add() functie wordt je ajax request verstuurd op het moment dat de telefoon een internet connectie heeft.
 *  Op deze manier is er 100% kans dat je ajax request een antwoord krijgt.
 * 
 * 	De add() functie vraagt om 3 parameters.
 * 	1. De properties van een ajax reuest. Dit moet een js object zijn.
 *  2. De success callback functie. Deze wordt uitgevoerd op het moment dat de ajax request voltooid is. Dit moet een js functie zijn.
 *  3. De failure callback functie. Deze wordt uitgevoerd op het moment dat de ajax request gefaald is. Dit moet een js functie zijn.
 * 	De add() functie returned een nummer. Dit nummer is de index van je ajax request.
 *  Je kan later je ajax request verwijderen door de index in de remove() functie te plaatsen.
 * 
 * 	De getconnected() functie kan aangeroepen worden als je wilt weten of de telefoon verbinding heeft met internet.
 *  returned true als er verbinding is, false als er geen verbinding is.
 * 
 */



window.ajax = {
	
	init:  function(){
		
		this.ajaxStack = {};
		
		this.connected = false;
		this.counter = 0;
		
		this.timer();
		this.setTimer;
	},
	
	connection: function(){
		var self = window.ajax;
		$.ajax({
			url : 'http://www.remcovdk.com/groupalarm/connectiontest.php',
			type : 'POST',
			dataType : 'json',
			cache:false,
    		timeout:5000
		}).done(function() {
			var self = window.ajax;
			self.connected = true;
			self.timer('done');
		}).fail(function() {
			var self = window.ajax;
			self.connected = false;
		});
	},
	
	timer: function(string){
		var self = window.ajax;
		if(string == 'done'){
			for(var item in self.ajaxStack){
				//console.log(item);
				self.activate(item);
			}
			return;
		}
		self.connection();
		self.setTimer = setTimeout(self.timer, 10000);
	},
	
	activate: function(id){
		var self = window.ajax;
		if(self.ajaxStack[id].busy){
			return;
		}
		//console.log(self.ajaxStack[id]);
		self.ajaxStack[id].busy = true;
		
		$.ajax(
			self.ajaxStack[id].properties
		).done(function(msg) {
			var self = window.ajax;
			self.ajaxStack[id].busy = false;
			if(self.ajaxStack[id].callback != undefined){
				self.ajaxStack[id].callback(msg);
			}
			self.remove(id);
		}).fail(function(msg) {
			var self = window.ajax;
			self.ajaxStack[id].busy = false;
			if(self.ajaxStack[id].errorcallback != undefined){
				self.ajaxStack[id].errorcallback(msg);
			}
		});		
	},
	
	add: function(properties, callback, errorcallback){
		var self = window.ajax;
		if(typeof(callback) != 'function'){
			callback = undefined;
		}
		if(typeof(errorcallback) != 'function'){
			errorcallback = undefined;
		}
		var data = {'busy' : false, 'properties': properties, 'callback': callback, 'errorcallback' : errorcallback};
		self.ajaxStack[self.counter] = data;
		if(self.connected){
			self.activate(self.counter);
		}
		self.counter++;
		return self.counter -1;
	},
	
	isset: function(id){
		var self = window.ajax;
		if(self.ajaxStack[id]){
			return true;
		}
		return false;
	},
	
	remove: function(id){
		var self = window.ajax;
		delete self.ajaxStack[id];
	},
	
	getconnected: function(){
		var self = window.ajax;
		return self.connected;
	},
	
	stop: function(){
		var self = window.ajax;
		clearTimeout(self.setTimer);
	},
	
	resume: function(){
		var self = window.ajax;
		self.setTimer();
	},

}
window.ajax.init();
