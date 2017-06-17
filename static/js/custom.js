window.vm = null;
var url = "http://shop-api-dev.10.0.0.145.xip.io";
var togglers=['moreView','homeView'];
var togglers2=['#productsView','#moreView','#shippingView'];
/*
var Product = function(id, name, price) {
  this.id    = ko.observable(id);
  this.name  = ko.observable(name);
  this.price = ko.observable(price);
};
*/ 
// CLASS CartItem 
var CartItem = function(product, quantity) {
  var self      = this; // Scope Trick
 
  self.product  = ko.observable(product);
  self.quantity = ko.observable(quantity || 1);
 
  self.cost = ko.computed(function(){
    return self.product().price * self.quantity();
  });
};
 
// CLASS ViewModel 
var ViewModel = function() {
  var self = this; // Scope Trick
 
  /**
   * Observables
   */
  self.sales_tax      = ko.observable(0.07);
  self.shipping_cost  = ko.observable(10.00);
  self.currProduct  = ko.observable({name:"default",title:"default",images:[],documents:"default",features:"default",shipping:55,caption:"",price:0});
 
  /**
   * Observable Arrays
   */
  self.cart           = ko.observableArray([]);
  self.products       = ko.observableArray([]);
  self.Cats       	  = ko.observableArray([]);
  self.currSubCat	  = ko.observable(1);
  self.shippingWithPassword = ko.observable(false);
  /**
   * Computed Observables
   */
  self.subtotal = ko.computed(function(){
    var subtotal = 0;
    $(self.cart()).each(function(index, cart_item){		
      subtotal += cart_item.cost();
    });
    return subtotal;
  });
 
  self.tax = ko.computed(function(){
    return (self.subtotal() * self.sales_tax());
  });
 
  self.total = ko.computed(function(){
    return  (self.shipping_cost() + self.subtotal() + self.tax()).toFixed(2);
  });
 
  self.fetchAll=function(callback){		
	$.getJSON(url+"/store/"+self.currSubCat()+"/byCat",function(data){		
		self.products(data);
		if(undefined!=callback)	
		callback();
	});
  };
  self.addToCart = function(product, event) {    
	//$(event.target).closest("div.thumbnail").fadeTo('fast', 0.2).fadeTo('fast', 1.0);
	var qty=1;	if($(event.target).attr('id')=="btnMoreViewAdd2Cart") qty=$("#moreViewQuantity").val();
	var	cart_item = new CartItem(product,qty);	
	$(event.target).closest("div.thumbnail").animate_from_to('#cart tr:last', {
        pixels_per_second: 2000
    });
	$(event.target).animate_from_to('#spnCartImg', {
        pixels_per_second: 2000
    });	
	self.cart.push(cart_item);	
	event.preventDefault();	
	return false;
  };
  self.emptyCart=function(){
	if(confirm('Are you sure removing items from cart?')) vm.cart([]);
  };
  self.qtyChanged=function(){	
	$.jStorage.deleteKey('cart');
	$.jStorage.set("cart", ko.toJSON(vm.cart()));
  };  
  self.highLight=function(item,event){	
	$(".pType").removeClass("btn-primary");
	$(event.target).addClass("btn-primary");
  };
  self.imageClick=function(img,evt){        
        $("#imgMain").attr('src', img);   
  };
  self.compactView = function(obj,event){		
		$("#cartColumn").show(200);
		$("#viewColumn").attr('class',"span6");		
		$("#productsView").show(200);
		$("#shippingView,#moreView").hide(100);
  };
  self.moreView = function(product, event) {    	   		
	if(undefined == self.currProduct() ||  self.currProduct().id!=product.id){
		self.currProduct(product);              
	} 	
	setTimeout(function(){					
		$("#moreView").show(200);
		$("#cartColumn,#shippingView,#productsView").hide(100);
		$("#viewColumn").attr('class',"span10");		
	},500);
  }; 
  self.removeFromCart = function(cart_item, event) {    
    self.cart.remove(cart_item);
  };
};
  
// Instantiate the ViewModel
$(document).ready(function(){
	$.support.cors = true;	
	window.vm= new ViewModel();		
	window.vm.fetchAll(function(){
		try{
			ko.applyBindings(window.vm);	
		}catch(e){}		
	});
	vm.currSubCat.subscribe(function(nVal){		
		$('#shippingView,#moreView').hide();
		$('#productsView').show(200);
		$("#cartColumn").show(200);
		$("#viewColumn").attr('class',"span6");					
		vm.fetchAll();
	});
	vm.cart.subscribe(function(nVal){ 
		$.jStorage.deleteKey('cart');
		$.jStorage.set("cart", ko.toJSON(vm.cart()));
	});
	vm.currProduct.subscribe(function(nVal){
		ko.applyBindings(vm,$("#moreView")[0]);
	});		
	$('.nav-header').css("cursor","pointer");	
	$.getJSON(url+"/cats",function(data){				
		vm.Cats(data);		
        setTimeout(function(){
            $('.nav-header').click(function (event) {    	                                        	
                $(this).next().toggle(300);				
    	    });
			$('.nav-header:not(:eq(0))').click().click();						
        },500);		
	});		
	if(undefined!=$.jStorage.get('cart')){							
		var prts = $.parseJSON($.jStorage.get('cart'));				
		$.each(prts,function(ind,item){
			vm.cart.push(new CartItem(item.product,item.quantity));
		});		
	}
});
function toggleView(){		
	$("#"+togglers[0]).show();
	$("#"+togglers[1]).hide();	
	togglers = togglers.reverse();	
}
function toggleCheckOut(){
	$("#tabEmail").click();
	$(".middleView").toggle(200);
	$(togglers2[0]).show();
	$(togglers2[1]).hide();		
	togglers2 = togglers2.reverse();	
}
function isVisible(ele){		
	return $('#'+ele).is(':visible');
}
