'use strict';

var IU = {

	autoScroll : false,

	firstDivId : 'aboutDiv',

	firstDivPTop : '107px',

	mainLogoHeight : 213,

	partnerItemWidth : 270,

	portfolioItemWidth : 1,

	screenHeight : $(window).height(),

	headerDivHeight : 77,

	scrollSpeed : 500,

	initialized : false,

	rightMenu : 'rightMenu',

	menuList : 'rightMenuList',

	init : function() {
		IU.registerTopMenu();
		IU.registerLayoutCorrections();
		IU.registerNavigationMenus();
		IU.registerLetMenuArrows();
		IU.registerScrollHandling();
		IU.registerMasonry();
		IU.registerLoginBox();
		IU.registerResizeWindow();
		IU.resizeRightMenu();
		IU.registerExternalNavigation();
		IU.initialized = true;
	},
	
	registerLetMenuArrows :function(){
		$( '#leftMenu ul li' ).each(function() {
			if($(this).children('ul').length > 0){
				$(this).addClass('arrow-right');
			}
		  });
	},
	
	navigateLeftMenu :function(parent){
		var current = parent.find('ul');
		if(!current.hasClass('active')){
			IU.closeSubItemLeftMenu();
			current.slideDown('medium');
			current.addClass('active');
			current.parent('li').removeClass('arrow-right');
			current.parent('li').addClass('arrow-down');
		}else{
			current.slideUp('medium');
			current.removeClass('active');
			current.parent('li').removeClass('arrow-down');
			current.parent('li').addClass('arrow-right');
		}
	},
	
	closeSubItemLeftMenu : function(){
		if($('#rightMobileMenuList li ul').hasClass('active')){
			$('#rightMobileMenuList li ul').slideUp('fast');
			$('#rightMobileMenuList li ul').removeClass('active');
			$('#rightMobileMenuList li ul').parent('li').removeClass('arrow-down');
			$('#rightMobileMenuList li ul').parent('li').addClass('arrow-right');
		}
	},
	
	registerTopMenu : function() {
		if (jQuery.browser.mobile) {
			// IU.menuList = 'rightMobileMenuList';
			$('#topMenu').hide();
			$('#topMobileMenu').show();
			$('#showMenuButton').hide();
		} else {
			$('#topMenu').show();
			$('#topMobileMenu').hide();
			$('#showMenuButton').show();
		}
	},

	registerLayoutCorrections : function() {
		// detect browser viewport
		$('.cover-page').css('height', IU.screenHeight);
		$('#' + IU.rightMenu).css('height', IU.screenHeight);
		$('#servicesDiv, #aboutDiv, #partnersDiv, #portfolioDiv').css(
				'min-height', IU.screenHeight - IU.headerDivHeight);
		$('#contactsDiv').css(
				'min-height',
				IU.screenHeight - IU.headerDivHeight
						- $('#footer').outerHeight() - 60);
		$('#main-logo').css('padding-top',
				(IU.screenHeight - IU.mainLogoHeight) / 2);
	},
	
	registerBodyScrolling :function(){
		if(!$('body').hasClass('disable_body')){
			$('body').addClass('disable_body');
			$('#outer-wrapper').addClass('disable_wrapper');
			$('#leftMenu').css({
			    'overflow-x': 'scroll'
			});
			//$('#topMobileMenu').css('position', 'absolute');
		}else{
			$('#outer-wrapper').removeClass('disable_wrapper');
			$('body').removeClass('disable_body');
		}
	},
	
	closeLeftMenu : function(){
		$('#leftMenu').removeClass('cbp-spmenu-open');
		$('body').removeClass('cbp-spmenu-push-toright');
		IU.registerBodyScrolling();
	},
	
	registerNavigationMenus : function() {
		if (!IU.initialized) {
			// show horizontal menu
			if (!jQuery.browser.mobile) {
				$('#showMenuButton').mouseover(function() {
					$('#rightMenu').show();
				});

				$('#showMenuButton').click(function() {
					if ($('#rightMenu').css('display') === 'none') {
						$('#rightMenu').css('top', '0px');
						$('#rightMenu').show();
					} else {
						$('#rightMenu').hide();
					}
				});
			}
			
			// show left menu for mobile version
			$('#showMobileMenuButton').click(function(e) {
				var menuLeft = document.getElementById('leftMenu');
				classie.toggle(this, 'active');
				classie.toggle(document.body, 'cbp-spmenu-push-toright');
				classie.toggle(menuLeft, 'cbp-spmenu-open');
				$('#leftMenu').css({
				    'overflow': 'scroll'
				});
				IU.registerBodyScrolling();
				IU.closeSubItemLeftMenu();
				e.stopPropagation();
			});
			
			$('#leftMenu').click(function(event){
			    event.stopPropagation();
			});
			
			$('#showMobileMenuButton').click(function(event){
			    event.stopPropagation();
			});
			
			$('document.body').click(function(event){
			    event.stopPropagation();
			});
			
			$('#outer-wrapper').click(function(e) {
				if($('#leftMenu').hasClass('cbp-spmenu-open')){
					var menuLeft = document.getElementById('leftMenu');
					$('#showMobileMenuButton').removeClass('active');
					classie.toggle(document.body, 'cbp-spmenu-push-toright');
					classie.toggle(menuLeft, 'cbp-spmenu-open');
					$('#outer-wrapper').removeClass('disable_wrapper');
					$('body').removeClass('disable_body');
					IU.closeSubItemLeftMenu();
				}
			});
			
			$('#horizontalMenu > li').on('mouseover', function() {
				IU.openSubMenu(this);
			});
			if (!jQuery.browser.mobile) {
				$('#horizontalMenu > li').on('mouseout', function() {
					IU.closeAllSubMenus();
				});
			} else {
				$('#horizontalMenu > li').on('mouseout', IU.closeAllSubMenus());
			}
			
			// on left menu list click
			$('#rightMobileMenuList a').click(
					function(event) {
							var itemId = $(this).attr('id') ? $(this).attr(
									'id') : $(this).attr('Name');
							var parent = $('#'+itemId).parent();
							if(parent.children('ul').length === 0){
							IU.mainControl(itemId);
							window.location.hash = this.hash;
							event.preventDefault();
							IU.closeLeftMenu();
							return false;
						}
						else{
							IU.navigateLeftMenu(parent);
							event.preventDefault();
						}
						
					});
			
			
			// on all menus
			$('#' + IU.menuList + ' a, #horizontalMenu a, .footer-menu a')
					.click(
							function(event) {
								$('.customer-login-form ').hide();
								var itemId = $(this).attr('id') ? $(this).attr(
										'id') : $(this).attr('Name');
								IU.mainControl(itemId);
								window.location.hash = this.hash;
								event.preventDefault();
								return false;
							});

			// show subContent
			$('.submenu-vertical a').click(function() {
				var id = $(this).attr('id');
				var divId = id.substr(0, id.indexOf('_')) + 'Div';
				var subItemId = id.substr(0, id.lastIndexOf('_'));
				IU.showSubContent(divId, subItemId);
				return false;
			});
		}

		$('h2[menuItem]').appear();

		$('h2[menuItem]')
				.on(
						'appear',
						function(event, affected) {
							if (IU.initialized && !IU.autoScroll) {
								var menuActiveItem = affected.attr('menuItem');
								$('#' + IU.topMenu + ' .current, #'
												+ IU.menuList + ' .current')
										.removeClass('current');
								$('#' + menuActiveItem).addClass('current');
								$('a[name=' + menuActiveItem + ']').addClass(
										'current');
							}
						});

	},

	registerExternalNavigation : function() {
		if (!IU.initialized) {
			var hash = window.location.hash;
			if (hash && hash !== null) {
				var pageId = null;
				hash = hash.substring(1, hash.length);
				switch (hash) {
				case 'aboutUS':
					pageId = 'about';
					break;
				case 'partners':
					pageId = 'partners';
					break;
				case 'portfolio':
					pageId = 'portfolio';
					break;
				case 'services':
					pageId = 'services';
					break;
				case 'contacts':
					pageId = 'contacts';
					break;
				default:
					pageId = null;
				}
				if (pageId && pageId !== null) {
					IU.mainControl(pageId);
				}
			}
		}
	},

	registerScrollHandling : function() {
		if (!IU.initialized) {
			// on scroll
			$(window).scroll(function() {
				IU.fixTopMenuPosition();
			});
		}
	},

	fixTopMenuPosition : function() {
		if (!IU.autoScroll) {
			var scroll = $(window).scrollTop();
			if (scroll >= IU.screenHeight) {
				$('#' + IU.firstDivId).css('padding-top', IU.firstDivPTop);

				$('#topMenu').css({
					'position' : 'fixed',
					'top' : '0',
					'width' : '100%',
					'z-index' : '1'
				});
			} else if ($('#topMenu').css('position') === 'fixed') {
				$('#topMenu').css({
					'position' : 'absolute',
					'top' : IU.screenHeight
				});
			}
		}
	},

	registerMasonry : function() {
		if (!IU.initialized) {
			// masonry
			$('#partners_sub1_contentDiv').masonry({
				columnWidth : IU.partnerItemWidth,
				itemSelector : '.partner-item',
				animate : true
			});
			$('#portfolio_sub1_contentDiv').masonry({
				columnWidth : IU.portfolioItemWidth,
				itemSelector : '.portfolio-item',
				animate : true
			});

			$('#partnersDiv .partner-item').click(
					function() {
						IU.loadMasonry($(this).parent().attr('id'), $(this),
								'partner-item', IU.partnerItemWidth);
					});

			$('#portfolioDiv .portfolio-item').click(
					function() {
						IU.loadMasonry($(this).parent().attr('id'), $(this),
								'portfolio-item', IU.portfolioItemWidth);
						return false;
					});
		}
	},

	registerLoginBox : function() {
		if (!IU.initialized) {
			// login box
			$('#customerLogin')
					.click(
							function() {

								$('#error').hide();
								$(
										'#loginForm :input[type=\'text\'],#loginForm :input[type=\'password\']')
										.val('');
								$('.customer-login-form ').show();
								$('html, body').animate({
									scrollTop : 0
								});
								return false;

							});
			$('#closeLBox').click(function() {
				$('.customer-login-form ').hide();
			});
			$('#loginButton').click(function() {
				setTimeout($('#error').show(), 2000);
			});
		}
	},

	closeAllSubMenus : function() {
		$('#horizontalMenu > li').find('ul').css('visibility', 'hidden');
	},

	openSubMenu : function(element) {
		IU.closeAllSubMenus();
		$(element).find('ul').css('visibility', 'visible');
	},

	scrollToDiv : function(divId) {
		IU.autoScroll = true;
		IU.headerDivHeight = 67;
		if (divId === IU.firstDivId) {
			IU.headerDivHeight = 0;
		}

		if ($('#topMenu').css('position') !== 'fixed') {

			// scroll to horizontal menu
			$('html, body').animate(
					{
						scrollTop : IU.screenHeight
					},
					{
						duration : IU.scrollSpeed,
						complete : function() {
							$('#' + IU.firstDivId).css('padding-top',
									IU.firstDivPTop);
							// scroll to page
							$('html, body').animate(
									{
										scrollTop : $('#' + divId).offset().top
												- IU.headerDivHeight
									}, {
										duration : IU.scrollSpeed,
										complete : function() {
											IU.autoScroll = false;
										}
									});
						}
					});
		} else {
			$('html, body').animate({
				scrollTop : $('#' + divId).offset().top - IU.headerDivHeight
			}, {
				duration : IU.scrollSpeed,
				complete : function() {
					IU.autoScroll = false;

				}
			});
		}
	},

	showSubContent : function(divId, menuItemId) {
		$('#' + divId + ' .subContent').hide();
		$('#' + divId + ' .submenu-vertical a').removeClass('current');
		$('#' + menuItemId + '_vertical').addClass('current');
		$('#' + menuItemId + '_contentDiv').show();
		if (divId === 'portfolioDiv') {
			if (menuItemId === 'portfolio_sub2') {
				$('.projectTitle').show();
			} else {
				$('.projectTitle').hide();
			}
			IU.loadMasonry(menuItemId + '_contentDiv', '', 'portfolio-item',
					IU.portfolioItemWidth);
		}

		if (divId === 'partnersDiv') {
			IU.loadMasonry(menuItemId + '_contentDiv', '', 'partner-item',
					IU.partnerItemWidth);
		}
	},

	loadMasonry : function(mainDiv, item, className, itemWidth) {
		$('#' + mainDiv + ' .largBox').removeClass('largBox');
		$('#' + mainDiv + ' .smallContent').show();
		$('#' + mainDiv + ' .largContent').hide();
		if (item) {
			item.children().hide();
			item.children().next().show();
			item.addClass('largBox');
		}
		$('#' + mainDiv).masonry({
			columnWidth : itemWidth,
			itemSelector : '.' + className,
			animate : true
		});
	},

	mainControl : function(menuItemId) {
		$('*[id*=_contentDiv]').hide();
		$('*[id*=sub1_contentDiv]').show();
		$('*[id*=_vertical]').removeClass('current');
		$('*[id*=sub1_vertical]').addClass('current');
		IU.closeAllSubMenus();
		var divId;
		var menuActiveItem;
		if (menuItemId.indexOf('_') === -1) {
			menuActiveItem = menuItemId;
			divId = menuItemId + 'Div';
			if (divId === 'portfolioDiv') {
				$('.projectTitle').hide();
				IU.loadMasonry('portfolio_sub1_contentDiv', '',
						'portfolio-item', IU.portfolioItemWidth);
			} else if (divId === 'partnersDiv') {
				IU.loadMasonry('partners_sub1_contentDiv', '', 'partner-item',
						IU.partnerItemWidth);
			}

		} else {
			menuActiveItem = menuItemId.substr(0, menuItemId.indexOf('_'));
			divId = menuItemId.substr(0, menuItemId.indexOf('_')) + 'Div';
			IU.showSubContent(divId, menuItemId);
		}
		$('#topMenu.current, #' + IU.menuList + ' .current').removeClass(
				'current');
		$('#' + menuActiveItem).addClass('current');
		$('a[name=' + menuActiveItem + ']').addClass('current');
		// auto scroll
		IU.scrollToDiv(divId);
	},

	resizeRightMenu : function() {
		IU.screenHeight = $(window).height();
		if (IU.screenHeight < 577) {
			$('#rightMenuList').css('padding-top', '90px');
			$('#rightMenuList a').css('padding-top', '8px');
			$('#rightMenuList a').css('padding-bottom', '8px');
		} else {
			$('#rightMenuList').css('padding-top', '140px');
			$('#rightMenuList a').css('padding-top', '30px');
			$('#rightMenuList a').css('padding-bottom', '30px');
		}
	},

	registerResizeWindow : function() {
		$(window).on('resize', function() {
			//
			IU.screenHeight = $(window).height();
			IU.registerLayoutCorrections();
			IU.fixTopMenuPosition();
			IU.resizeRightMenu();
		});
	}
};

$(function() {
	IU.init();
});
