$(function(){ //same as document.addEventListener("DOMContentLoaded")
	//same as document.querySelector("navbarToggle").addEventListener("blur")
	$("#navbarToggle").blur(function(event){
		var screenWidth = window.innerWidth;
		if(screenWidth < 768){
			$("#collapsable-nav").collapse('hide');
		}
	});
});

(function(global){
	
	var dc = {};
	
	var homeHtml = "snippets/home-snippet.html"; 
	var allCategoriesUrl = "http://davids-resturant.herokuapp.com/categories.json";
	var categoriesTitleHtml = "snippet/category-title-snippet.html";
	var categoryHtml = "snippet/category-snippet.html";
	var menuItemsUrl = "https://davids-resturant.herokuapp.com/menu_items.json?category=";
	var menuItemsTitleHtml = "snippet/menu-items-title.html";
	var menuItemsHtml = "snippet/menu-item.html";
	
	//Convinience function for inserting innerHTML for 'select'
	var innerHTML = function(selector, html){
	var targetElem = document.querySelector(selector);
	targetElem.innerHTML = html;
	};
	//show loading icon inside element identified by 'selector'
	var showLoading = function(selector){
		var html = "<div class = 'text-center'>;
		html+="<img src= 'ajax-loader.gif'></div>";
		insertHtml(selector, html);
	};
	
	//Return substitute of '{{propName}}' with propValue in given 'string' 
		var insertProperty = function(string, propName, propValue){
			var propToReplace = "{{" + propName + "}}";
			string = string.replace(new RegExp(propToReplace, "g"),propValue);
			return string;
		}
		
	//Remove the class 'active' from home and switch to menu button 
		var switchMenuToActive = function(){
			//remove 'active' from home button
			var classes = document.querySelector("#naveHomeButton").className;
			classes = classes.replace(new RegExp("active","g"),"");
			document.querySelector("#navMenuButton").className = classes;
			
			//Add 'active' to menu button if not already there
			classes = document.querySelector("#navMenuButton").className;
			if(classes.indexOf("active") == -1){
				classes +="active";
				document.querySelector("#navMenuButton").className = classes;
			}
		};	
	
	
	
	//On page load(before images OR CSS)
	document.addEventListener("DOMContentLoaded", function(event){
		
		//On first load, show home view
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(homeHtml, function(responseText){
			document.querySelector("#main-content").innerHTML = responseText;
		},
		false);
	});
	

	//Load the menu categories view
	dc.loadMenuCategories = function(){
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML)
	};
	
	//Load the menu items view 'categoryShort' is a short_name for a category
	dc.loadMenuItems = function(categoryShort){
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort, buildAndShowMenuUtemsHTML);
	};
	
	//Builds HTML for the categories pages based on the data from the server
	function buildAndShowCategoriesHTML(categories){
		//Load title snippet of categories page
		
		$ajaxUtils.sendGetRequest(categoriesTitleHtml, function(categoriesTitleHtml){
			//Retrive single categories snippet
			$ajaxUtils.sendGetRequest(categoryHtml, function(categoryHtml){
				var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
				insertHtml("#main-content", categoriesViewHtml);
			},
			false);
		},
		false);
	}
	
	//Builds HTML for the categories pages based on the data from the server
	function buildAndShowMenuItemsHTML(categoryMenuItems){
		//Load title snippet of Menu Items page
		
		$ajaxUtils.sendGetRequest(menuItemsTitleHtml, function(menuItemTitleHtml){
			//Retrive single categories snippet
			$ajaxUtils.sendGetRequest(menuItemHtml, function(menuItemHtml){
				var menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
				insertHtml("#main-content", menuItemViewHtml);
			},
			false);
		},
		false);
	}
	//using categories data and snippet html buildCategoriesViewHtml to be inserted into page
	
	function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml){
		var finalHtml = categoriesTitleHtml;
		finalHtml+= "<section class='row'>";
		
	//loop over menu items
		var finalHtml = menuItemTitleHtml.menu_items;
		var  carShortName = categoryMenuItems.category.short_name;
		for(var i=0; i<menuItems.length; i++){
			//Insert menu item values
			var html = menuItemHtml;
			html = insertProperty(html, "short_name", menuItems[i].short_name);
			
			html = insertProperty(html, "catShortName", catShortName);
			
			html = insertItemPrice(html, "price_small", menuItem[i].price_small);
			
			html = insertItemPortionName(html, "large_portion_name",menuItems[i].large_portion_name);
			
			html = insertItemPrice(html, "name", menuItems[i].name);
			
			html = insertItemPortionName(html, "description", menuItems[i].description);
			
			if(i%2!=0){
				html += "<div class= 'clearfix visible-lg-block visible-md-block'></div>"
			}
			
		finalHtml += html;
		}
	finalHtml += html;	
	return finalHtml;
	}
	
	// Appends price with '$' if price exists
	function insertItemPrice(html, pricePropName, priceValue){
		//If not specified, replace with empty string
		if(!priceValue){
			return insertProperty(html, pricePropName, "");
		}
		priceValue = "$" + priceValue.toFixed(2);
		html = insertProperty(html, pricePropName, priceValue);
		return html;
	}
	
	//Appends portion name in parens if it exists
	function insertItemPortionName(html, portionPropName, portionValue){
		//If not specified, return original string 
		if(!portionValue){
			return insertProperty(html, pricePropName, "");
		}
		portionValue = "$" + portionValue.toFixed(2);
		html = insertProperty(html, portionPropName, portionValue);
		return html;
		}
	}
	
	//loop over categories	
		for(var i = 0; i < categories.length; i++){
			//inseert category values
			var html = categoryHtml;
			var name = ""+categories[i].name;
			var short_name = categories[i].short_name;
			html = insertProperty(html, "name", name);
			html = insertProperty(html, "short_name", short_name);
			
			finalHtml +=html;
		}
	
	finalHtml += "</section>";
	return finalHtml;
	
	}
	
	global.$dc = dc;
})(window);
