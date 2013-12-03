$(document).ready(function() {
	// toggle nav wrap
	var doCloseToggleWrap = function(event){
			var $dom = $(event.target),
				_doClose = function(){
					$(".Js-toggle-nav-list").children().removeClass("selected");
					doToggleNavList();
					$(document).off("click", doCloseToggleWrap);
				};
			if ( !$dom.hasClass("Js-close-toggle-nav-wrap") && $dom.closest(".Js-toggle-nav-wrap").length || $dom.closest(".Js-toggle-nav-list").length || $dom.closest(".flash-paging").length ) {
				return false;
			}else{
				_doClose();
			}
		},
		doToggleNavList = function(index){
			var $navToggleWrap = $(".Js-toggle-nav-wrap"),
				$navList = $navToggleWrap.find(".Js-animate-nav-list");
			if ( index === 0 || !!index ) {
				if ( $navToggleWrap.is(":hidden") ) {
					$navList.css("left", -1200 * index + "px");
					$("body, html").animate({scrollTop: 2000}, 800);
					$navToggleWrap.slideDown(function(){
						// $(document).scrollTop(20000);
						
						$(document).on("click", doCloseToggleWrap);
					});
				} else{
					$navList.animate({ "left" : -1200 * index + "px" }, 600);
				}
			} else{
				$navToggleWrap.slideUp();
			}
		},
		AutoFlash = null,
		startAutoFlash = function(){
			if ( AutoFlash != null ) {
				clearTimeout(AutoFlash);
			}
			AutoFlash = setTimeout(function(){
				var _$paging = $(".Js-flash-wrap").find(".Js-flash-paging-item"),
					_flashPaging = _$paging.filter(".selected").index();
				if ( _flashPaging != 4 ) {
					_$paging.eq(_flashPaging).next().click();
				}else{
					_$paging.first().click();
				}
				startAutoFlash();
			},15000);
		},
		endAutoFlash = function(){
			clearTimeout(AutoFlash);
		};

	$(".Js-toggle-nav-list").on("click", "li", function(){
		var $nav = $(this),
			_index = $nav.index();
		if ( $nav.hasClass("selected") ) {
			$nav.removeClass("selected");
			doToggleNavList();
		} else{
			if ( !$(".Js-toggle-nav-wrap").is(":animated") ) {
				$nav.addClass("selected").siblings().removeClass("selected");
				doToggleNavList(_index);
			}
		}
	});
	// flash
	$(".Js-flash-wrap").on("click", ".Js-flash-paging-item", function(){
		var $paging = $(this),
			$imgItem = $(".Js-image-item"),
			_index = $paging.index();
		if ( !$paging.hasClass("selected") ) {
			endAutoFlash();
			startAutoFlash();
			var $chooseItem = $imgItem.filter("[data-paging=" + _index + "]"),
				$curItem = $imgItem.filter(".cur");
			$paging.addClass("selected").siblings().removeClass("selected");
			$chooseItem.appendTo(".Js-flash-image-list");
			$chooseItem.show();
			$curItem.find(".hide-left").animate({
				left : "auto%",
				right : "-100%",
				top : "-100%"
			}, 1000, "linear");
			$curItem.find(".hide-right").animate({
				left : "-100%",
				top : "auto",
				bottom : "0"
			}, 1000, "linear");
			$curItem.fadeOut(function(){
				var _$left = $chooseItem.find(".hide-left"),
					_$right = $chooseItem.find(".hide-right");
				$(this).removeClass("cur");
				$(this).find(".hide-left").removeAttr("style");
				$(this).find(".hide-right").removeAttr("style");
				$chooseItem.addClass("cur");
				_$left.css("right", "auto").animate({left : _$left.data("left"), top : _$left.data("top")}, 600, "linear");
				_$right.css("bottom", "auto").animate({left : _$right.data("left"), top : _$right.data("top")}, 600, "linear");
			});
		}
	}).on("mouseenter", function(){
		endAutoFlash();
	}).on("mouseleave", function(){
		startAutoFlash();
	});
	// start flash
	startAutoFlash();

	// login
	var loginPopupBox = '<div class="login-popup fn-clear Js-popup-wrap">'+
				  	'<a href="javascript:void(0)" class="popup-close Js-popup-close" title="关闭"></a> '+
				    '<h6 class="fn-clear popup-tit Js-popup-title">用户登录</h6>'+
				    '<div class="error-tips"></div>'+
				    '<div class="popup-con Js-popup-con"></div>'+
				    '<div class="btn-wrap Js-popup-btn-wrap">'+
				    	'<a class="popup-btn Js-popup-done done" href="javascript:;;">登录</a>'+
            			'<a class="popup-btn Js-popup-cancel" href="javascript:;;">取消</a>'+
				    '</div>'+
				'</div>',
		loginPopupCon = '<div class="text Js-name"><input type="text" placeholder="请输入用户名" /><p class="error">请输入用户名</p></div>'+
						'<div class="text Js-password"><input type="password" placeholder="请输入密码" /><p class="error">请输入密码</p></div>'+
						'<div class="remember"><label><input type="checkbox" /> 记住密码</label></div>';
	var testLoginNull = function($text){
		if ( $.trim( $text.val() ) == "" ) {
			$text.siblings(".error").slideDown("fast").closest(".text").addClass("text-error");
		}else{
			$text.siblings(".error").slideUp("fast").closest(".text").removeClass("text-error");
		}
	};
	var IsLogined = false;
	// $(".Js-login").on("click", function(){
	// 	$.cgPopup({
	// 		popupTemp : $(loginPopupBox),
	// 		template : loginPopupCon,
	// 		content : function(opt){
	// 			var $con = opt.oCon,
	// 				$text = $con.find(".text input");
	// 			$text.on("blur", function(){
	// 				testLoginNull($(this));
	// 			});
	// 		},
	// 		done : function(opt){
	// 			var $con = opt.oCon,
	// 				$text = $con.find(".text"),
	// 				$name = $con.find(".Js-name input"),
	// 				$psw = $con.find(".Js-password input"),
	// 				$error = $con.find(".error-tips");
	// 			if ( $.trim( $name.val() ) == "" || $.trim( $psw.val() ) == "" ) {
	// 				testLoginNull($name);
	// 				testLoginNull($psw);
	// 			}
	// 			else{
	// 				$con.find(".error").slideUp();
	// 				$error.text("");
	// 				$.ajax({
	// 					url : loginUrl,
	// 					type : "post",
	// 					dataType : "json",
	// 					data : { username : $name.val(), password : $psw.val() },
	// 					success : function(result){
	// 						if ( result.success ) {
	// 							$(".Js-login").text(result.name);
	// 							$(".Js-toggle-nav-wrap a").each(function(){
	// 								var $link = $(this);
	// 								$link.attr("href", $link.data("link"));
	// 							});
	// 							IsLogined = true;
	// 							opt.close();
	// 						} else{
	// 							$error.text("用户名或者密码错误");
	// 						}
	// 					},
	// 					error : function(){
	// 						$error.text("登录失败，请重新尝试");
	// 					}
	// 				});
	// 			}
	// 		}
	// 	});
	// });

	// out link
	// $(".Js-toggle-nav-wrap a").on("click", function(){
	// 	var $link = $(this);
	// 	if ( !IsLogined && $link.attr("href") != $link.data("link") ) {
	// 		$(".Js-login").click();
	// 	} else{
	// 		if ( !$link.hasClass("Js-not-link") ) {
	// 			window.open($link.attr("href"), "_blank");
	// 		}
	// 	}
	// });
	 $(".Js-toggle-nav-wrap a").on("click", function(){
	 	var $link = $(this);
 		if ( !$link.hasClass("Js-not-link") && $link.attr("href") != "#" ) {
 			window.open($link.attr("href"), "_blank");
 		}
	 });
});