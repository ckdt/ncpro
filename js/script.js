(function($){
	$.fn.extend({
		ncpro: function(options) {
			var defaults = {
				/* Masonry */
				masonry : true ,
				masonry_wall : '#posts' ,
				masonry_loader : '#loader' ,
				masonry_selector : '.post' ,
				masonry_columns : 2 ,
				masonry_columnwidth: 500,
				masonry_columnspace: 20,
				masonry_infinite : true ,
				masonry_centered : true,
				
				/* Styling */
				style_bgimage : false ,
				style_bgtransparent : true ,
				style_invertcolors : false ,
				style_fixedheader : true ,
				style_totopbutton : true,
				content_cropdesc : false ,
				content_shareopts : true ,
				onComplete : ''
			};
			
			var o = $.extend(defaults, options);
			var root = $(this);
			var root_elem = $(o.masonry_wall).find('.post');
			
			function init(){
				fakeReload(root_elem,true);
			};
			
			function fakeReload(elem,firstrun){
				applyPostOptions(elem);
				if(firstrun){
					setupLayout();
					if(o.masonry){
						setupMasonry();
					}
				}else{
					if(o.masonry){
						appendMasonry(elem);
					}
				}	
			};
			
			function setupMasonry(){
				var $container = $(o.masonry_wall);
				
				$container.imagesLoaded(function(){
					$container.masonry({
						itemSelector: o.masonry_selector,
						columnWidth: o.masonry_columnwidth,
						gutterWidth: o.masonry_columnspace,
						isFitWidth: o.masonry_centered
					});
				});
				
				// set loader image
				var loaderimg = '';
				if(o.style_invertcolors){
					loaderimg = 'http://static.kentandclaire.com/themes/nativecitizenspro/img/loader-black.gif';
				}else{
					loaderimg = 'http://static.kentandclaire.com/themes/nativecitizenspro/img/loader.gif';
				}
				
				if(o.masonry_infinite){
					$container.infinitescroll({
							navSelector  : '#pagenav',
							nextSelector : '.next',
							itemSelector : '.post',
							loading: {
								finishedMsg: 'End of site.',
								img: loaderimg
							}
						},
						function( newElements ) {
							var $newElems = $( newElements ).css({ opacity: 0 });
							$newElems.imagesLoaded(function(){
								fakeReload($newElems,false);
							});
						}
					);
				}

			};
			
			
			function appendMasonry(elem){
				elem.animate({ opacity: 1 });
				$( o.masonry_wall ).masonry( 'appended', elem, true ); 
			};
			
			function applyPostOptions(elem){
				// set bottom margin
				elem.css("margin-bottom", o.masonry_columnspace );
				
				// enable share
				elem.find(".share-toggle").click(function(e){
					// Prevent default button 
					e.preventDefault();
					// Share box
					$sb = $(this).next(".share-box");
					// Add share scripts
					populateShareBox($sb);
					// Display Share Box
					$sb.toggle();
					// Focus input
					$sb.find("input").focus().select();
					// Prevent Click 
					$sb.click(function(e){ 
						e.stopPropagation(); 
					});
					return false;	
				});
				
				// set transparent
				if(o.style_bgtransparent){
					bgToRgba($(elem),0.85);
				}
				
				
				repairAudioPlayer(elem);
				//repairVideoPlayer(elem);
			};
			
			
			function populateShareBox(elem){
        		$tw = elem.find(".share-twitter");
        		$fb = elem.find(".share-facebook");
        		$gp = elem.find(".share-google");
        		
        		// Twitter
        		if ($tw.is(":empty")){
        			var u = $tw.attr("data-permalink");
        			var v = $tw.attr("data-username");
        			var output = '<iframe allowtransparency="true" frameborder="0" scrolling="no"  style="border:none; overflow:hidden; width:55px; height:62px;" src="//platform.twitter.com/widgets/tweet_button.html?url=' + u + '&amp;via=' + v + '&amp;count=vertical&amp;lang=en"></iframe>';
					$tw.html(output);
        		}
        		
        		// Facebook
        		if ($fb.is(":empty")) {
        			var u = $fb.attr("data-permalink");
        			var output = '<iframe allowtransparency="true" frameborder="0" scrolling="no" style="border:none; overflow:hidden; width:48px; height:62px;" src="//www.facebook.com/plugins/like.php?href=' + u + '&amp;send=false&amp;layout=box_count&amp;width=55&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=arial&amp;height=62&amp;locale=en_US"></iframe>';
					$fb.html(output);
        		}
				
				// Google +
				if ($gp.is(":empty")) {
        			var u = $gp.attr("data-permalink");
        			var output = '<iframe allowtransparency="true" frameborder="0" scrolling="no" style="border:none; overflow:hidden; width:50px; height:62px;" src="https://plusone.google.com/u/0/_/+1/fastbutton?url=' + u + '&amp;size=tall&amp;count=true&amp;annotation=&amp;hl=en-US&amp;_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe"></iframe>';
					$gp.html(output);
        		}
			};
			
			function clearShareBox(elem){
				$tw = elem.find(".share-twitter");
        		$fb = elem.find(".share-facebook");
        		$gp = elem.find(".share-google");
        		
        		if ($tw.not(":empty")){
					$tw.empty();        		
        		}
        		if ($fb.not(":empty")){
					$fb.empty();        		
        		}
        		if ($gp.not(":empty")){
					$gp.empty();        		
        		}
			};
			
			function setupLayout(){
			
				if(o.masonry){
					// Add Margin to Post Container
					if ($('body').hasClass("layout-two")){
						$('#main').css("width","+="+o.masonry_columnspace);
					}
				}
				
				if(o.masonry_infinite){
					$('#pagenav').hide();
				}
				
				// Add Close Share-box action to body
				$('body').click(function(){
        			clearShareBox($(".share-box"));
        			$(".share-box").hide();
				});
				
				// Add Top Margin when header is Fixed
				if ($('body').hasClass("fixed-header")){
					$('#main').css("margin-top",$('#header').height()+o.masonry_columnspace);
				}
				
				
				if(o.style_bgtransparent){
					bgToRgba($('#brand'),0.85);
					bgToRgba($('#access'),0.85);
					bgToRgba($('aside .info-wrapper'),0.85);
				}
				
				$('aside').animate({left: '-250'},00);
								
				// Apply Toggle
				$('.info-toggle a').toggle(
			        function(){
			            $('aside').animate({
			                left: '0'
			            }, 100);
			        
			            $(this).addClass('open');
			        },
			        function(){
			            $('aside').animate({
			                left: '-250'
			            }, 100);
		            $(this).removeClass('open');
			   	});
				
				enableTopButton();
			};
			
			
			function bgToRgba(el,al){
        		var self = el;    
				var rgb = self.css("background-color");
				if(rgb != undefined){
					var x = rgb.replace("rgb","rgba");
					var rbga = x.replace(")",", "+al+")");
					self.css("background-color",rbga);
				}
        	};
        	
        	function repairAudioPlayer(el,cb){
				var audioplayers = el.find('.player span');
				if(audioplayers.length){
					return audioplayers.each(function(){
						
						var self = $(this);
					    var set = self.attr("id");
					    var id = set.split("_")[2];
					    
					    $.getJSON("/api/read/json?id="+id+"&callback=?", function(data){
							var player = data["posts"][0]["audio-player"];
							var black = player.replace('audio_player','audio_player');
							self.empty();
							self.append(black);
							if($.isFunction(cb)){
								cb.call(this);
	        				}
						});
					});
               	}
			};
			
			
			function repairVideoPlayer(el,cb){
				/* Coming Soon */	
			};
			
        	function enableTopButton(){
				var timer;
				var shown = false;
				var btn = $('#totop a');
				var self = $(window);
				var top = $(document.body).children(0).position().top;
			 	
				self.scroll(function () {
					window.clearTimeout(timer);
					timer = window.setTimeout(function () { 
						if(self.scrollTop() <= top){
							shown = false;
							btn.fadeOut(0);
						}else if(shown == false){
							shown = true;
							btn.stop(true, true).show().click(function () { btn.fadeOut(0); });
						}
					}, 100);
				});
				
				btn.click(function() {
					$.smoothScroll({
					  scrollTarget: '#top'
					});
					return false;
				});
        	};
			
			// Initialize function
			init();
        }
    });
})(jQuery);