function $(selector, all){
	return (all)? document.querySelectorAll(selector) :
				  document.querySelector(selector);
}

(function() {
	
	var _ = self.Calendar = function(year) {

		this.year = year;
		this.holydays = {
			1 : [1, 6, 21, 26],
			2 : [27], 3 : [], 4 : [], 5: [],
			6: [], 7: [], 8 : [], 9 : [], 10 : [],
			11 : [], 12 : []
			// ....
		},
		this.days = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
	}

	_.prototype = {

		createEmpty : function() {

			grid = [];
			for(x = 0; x < 6; ++x){
				grid[x] = [];
				for(y = 0; y < 7; ++y)
					grid[x][y] = 0; 
			}

			return grid;
		},

		createCalendar : function(month){

			var grid = this.createEmpty(),
				pointer = 0, row = 0, day = -1;

			firstSunday = this.firstSunday(month),
			daysOfMonth = this.daysOfMonth(month);


			while( ++pointer  <= daysOfMonth){

				if(!row && firstSunday > 1){
					day = (7-firstSunday + 1)%7;
					firstSunday--;
				}
			    else{
			    	day++;
				}

		    	grid[row][day] = pointer+"";

				if(this.holydays[month].indexOf(pointer) > -1)
					grid[row][day] += "*";			
			    
		    	if( (firstSunday < 1 && !row) ||  (day == 6) )
					row++, day = -1;
			}

			return grid;
		},

		daysOfMonth : function(month){
			return new Date(this.year, month, 0).getDate();
		},

		firstSunday : function(month){
			
			var date = new Date(this.year, month-1, 1), 
				day = date.getDay() || 7;
		
			return date.getDate() + (7-day);
		}
	};
})();

(function(){

	var _ = self.CalendarView = function(){

	}

	_.prototype = {

		 createView : function(grid){

		 	var thead = $("#container > table > thead"),
		 		tbody = $("#container > table > tbody");

		 	this.createHeader(thead);
		 	this.createBody(tbody);
		 },

		 createHeader : function(thead){

		 	for(x = 0; x < grid[0].length; ++x){
			 	var th = document.createElement("th");
			 	th.innerHTML = calendar.days[x];
			 	thead.appendChild(th); 		
		 	}

		 },

		 createBody : function(tbody){

		 	for(x = 0; x < grid.length; ++x){
		 		var tr = document.createElement("tr");
		 		for(y = 0; y <  grid[x].length; ++y){
		 			var td = document.createElement("td");
		 			td.innerHTML = (grid[x][y] !== 0)? grid[x][y] : "";
		 					 			
		 			if(grid[x][y][grid[x][y].length-1] == '*'){
		 				td.classList.add("holydays");
						td.innerHTML = td.innerHTML.replace("*", "");
		 			}

		 			if(td.innerHTML === ""){
		 				td.classList.add("unavailable");
		 			}
		 		
		 			tr.appendChild(td);
		 		}
		 		tbody.appendChild(tr);
		 	}
		},

		clear : function(){
		
		  	 thead = $("thead");
		  	 ths = $("th", 1);

		  	 for(x = 0; x < ths.length; ++x){
		  	 	thead.removeChild(ths[x]);
		  	 }

		  	 tbody = $("tbody");
		  	 trs = $("tr", 1);

		  	 for(x = 0; x < trs.length; ++x){
		  	 	tbody.removeChild(trs[x]);
		  	 }
		  }
			
	};

})();

var year, month;
	year = 2015;
	month = 1;

var calendar = new Calendar(year);
var View = new CalendarView();
View.createView(calendar.createCalendar(month));

$("#year").addEventListener("keyup", function(){

	year = $("#year").value;
	calendar = new Calendar(year);
	View.clear();
	if(month >= 1 && month <= 12)
		View.createView(calendar.createCalendar(month));

} );

$("#textBox").addEventListener("keyup", function(){

	var month = $("#textBox").value;
	View.clear();
	if(month >= 1 && month <= 12)
		View.createView(calendar.createCalendar(month));
});