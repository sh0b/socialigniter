/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.4
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( event.wheelDelta ) { delta = event.wheelDelta/120; }
    if ( event.detail     ) { delta = -event.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return $.event.handle.apply(this, args);
}

})(jQuery);
/**
 * @author trixta
 * @version 1.2
 */
(function($){

var mwheelI = {
			pos: [-260, -260]
		},
	minDif 	= 3,
	doc 	= document,
	root 	= doc.documentElement,
	body 	= doc.body,
	longDelay, shortDelay
;

function unsetPos(){
	if(this === mwheelI.elem){
		mwheelI.pos = [-260, -260];
		mwheelI.elem = false;
		minDif = 3;
	}
}

$.event.special.mwheelIntent = {
	setup: function(){
		var jElm = $(this).bind('mousewheel', $.event.special.mwheelIntent.handler);
		if( this !== doc && this !== root && this !== body ){
			jElm.bind('mouseleave', unsetPos);
		}
		jElm = null;
        return true;
    },
	teardown: function(){
        $(this)
			.unbind('mousewheel', $.event.special.mwheelIntent.handler)
			.unbind('mouseleave', unsetPos)
		;
        return true;
    },
    handler: function(e, d){
		var pos = [e.clientX, e.clientY];
		if( this === mwheelI.elem || Math.abs(mwheelI.pos[0] - pos[0]) > minDif || Math.abs(mwheelI.pos[1] - pos[1]) > minDif ){
            mwheelI.elem = this;
			mwheelI.pos = pos;
			minDif = 250;
			
			clearTimeout(shortDelay);
			shortDelay = setTimeout(function(){
				minDif = 10;
			}, 200);
			clearTimeout(longDelay);
			longDelay = setTimeout(function(){
				minDif = 3;
			}, 1500);
			e = $.extend({}, e, {type: 'mwheelIntent'});
            return $.event.handle.apply(this, arguments);
		}
    }
};
$.fn.extend({
	mwheelIntent: function(fn) {
		return fn ? this.bind("mwheelIntent", fn) : this.trigger("mwheelIntent");
	},
	
	unmwheelIntent: function(fn) {
		return this.unbind("mwheelIntent", fn);
	}
});

$(function(){
	body = doc.body;
	//assume that document is always scrollable, doesn't hurt if not
	$(doc).bind('mwheelIntent.mwheelIntentDefault', $.noop);
});
})(jQuery);
/*
 * jScrollPane - v2.0.0beta9 - 2011-02-04
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2010 Kelvin Luck
 * Dual licensed under the MIT and GPL licenses.
 */
(function(b,a,c){b.fn.jScrollPane=function(f){function d(D,N){var ay,P=this,X,aj,w,al,S,Y,z,r,az,aE,au,j,I,i,k,Z,T,ap,W,u,B,aq,ae,am,G,m,at,ax,y,av,aH,g,K,ai=true,O=true,aG=false,l=false,ao=D.clone(false,false).empty(),ab=b.fn.mwheelIntent?"mwheelIntent.jsp":"mousewheel.jsp";aH=D.css("paddingTop")+" "+D.css("paddingRight")+" "+D.css("paddingBottom")+" "+D.css("paddingLeft");g=(parseInt(D.css("paddingLeft"),10)||0)+(parseInt(D.css("paddingRight"),10)||0);function ar(aQ){var aO,aP,aK,aM,aL,aJ,aI,aN;ay=aQ;if(X===c){aI=D.scrollTop();aN=D.scrollLeft();D.css({overflow:"hidden",padding:0});aj=D.innerWidth()+g;w=D.innerHeight();D.width(aj);X=b('<div class="jspPane" />').css("padding",aH).append(D.children());al=b('<div class="jspContainer" />').css({width:aj+"px",height:w+"px"}).append(X).appendTo(D)}else{D.css("width","");aJ=D.innerWidth()+g!=aj||D.outerHeight()!=w;if(aJ){aj=D.innerWidth()+g;w=D.innerHeight();al.css({width:aj+"px",height:w+"px"})}if(!aJ&&K==S&&X.outerHeight()==Y){D.width(aj);return}K=S;X.css("width","");D.width(aj);al.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()}aO=X.clone(false,false).css("position","absolute");aP=b('<div style="width:1px; position: relative;" />').append(aO);b("body").append(aP);S=Math.max(X.outerWidth(),aO.outerWidth());aP.remove();Y=X.outerHeight();z=S/aj;r=Y/w;az=r>1;aE=z>1;if(!(aE||az)){D.removeClass("jspScrollable");X.css({top:0,width:al.width()-g});o();E();Q();x();ah()}else{D.addClass("jspScrollable");aK=ay.maintainPosition&&(I||Z);if(aK){aM=aC();aL=aA()}aF();A();F();if(aK){M(aM,false);L(aL,false)}J();af();an();if(ay.enableKeyboardNavigation){R()}if(ay.clickOnTrack){q()}C();if(ay.hijackInternalLinks){n()}}if(ay.autoReinitialise&&!av){av=setInterval(function(){ar(ay)},ay.autoReinitialiseDelay)}else{if(!ay.autoReinitialise&&av){clearInterval(av)}}aI&&D.scrollTop(0)&&L(aI,false);aN&&D.scrollLeft(0)&&M(aN,false);D.trigger("jsp-initialised",[aE||az])}function aF(){if(az){al.append(b('<div class="jspVerticalBar" />').append(b('<div class="jspCap jspCapTop" />'),b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragTop" />'),b('<div class="jspDragBottom" />'))),b('<div class="jspCap jspCapBottom" />')));T=al.find(">.jspVerticalBar");ap=T.find(">.jspTrack");au=ap.find(">.jspDrag");if(ay.showArrows){aq=b('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp",aD(0,-1)).bind("click.jsp",aB);ae=b('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp",aD(0,1)).bind("click.jsp",aB);if(ay.arrowScrollOnHover){aq.bind("mouseover.jsp",aD(0,-1,aq));ae.bind("mouseover.jsp",aD(0,1,ae))}ak(ap,ay.verticalArrowPositions,aq,ae)}u=w;al.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function(){u-=b(this).outerHeight()});au.hover(function(){au.addClass("jspHover")},function(){au.removeClass("jspHover")}).bind("mousedown.jsp",function(aI){b("html").bind("dragstart.jsp selectstart.jsp",aB);au.addClass("jspActive");var s=aI.pageY-au.position().top;b("html").bind("mousemove.jsp",function(aJ){U(aJ.pageY-s,false)}).bind("mouseup.jsp mouseleave.jsp",aw);return false});p()}}function p(){ap.height(u+"px");I=0;W=ay.verticalGutter+ap.outerWidth();X.width(aj-W-g);if(T.position().left===0){X.css("margin-left",W+"px")}}function A(){if(aE){al.append(b('<div class="jspHorizontalBar" />').append(b('<div class="jspCap jspCapLeft" />'),b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragLeft" />'),b('<div class="jspDragRight" />'))),b('<div class="jspCap jspCapRight" />')));am=al.find(">.jspHorizontalBar");G=am.find(">.jspTrack");i=G.find(">.jspDrag");if(ay.showArrows){ax=b('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp",aD(-1,0)).bind("click.jsp",aB);y=b('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp",aD(1,0)).bind("click.jsp",aB);
if(ay.arrowScrollOnHover){ax.bind("mouseover.jsp",aD(-1,0,ax));y.bind("mouseover.jsp",aD(1,0,y))}ak(G,ay.horizontalArrowPositions,ax,y)}i.hover(function(){i.addClass("jspHover")},function(){i.removeClass("jspHover")}).bind("mousedown.jsp",function(aI){b("html").bind("dragstart.jsp selectstart.jsp",aB);i.addClass("jspActive");var s=aI.pageX-i.position().left;b("html").bind("mousemove.jsp",function(aJ){V(aJ.pageX-s,false)}).bind("mouseup.jsp mouseleave.jsp",aw);return false});m=al.innerWidth();ag()}}function ag(){al.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function(){m-=b(this).outerWidth()});G.width(m+"px");Z=0}function F(){if(aE&&az){var aI=G.outerHeight(),s=ap.outerWidth();u-=aI;b(am).find(">.jspCap:visible,>.jspArrow").each(function(){m+=b(this).outerWidth()});m-=s;w-=s;aj-=aI;G.parent().append(b('<div class="jspCorner" />').css("width",aI+"px"));p();ag()}if(aE){X.width((al.outerWidth()-g)+"px")}Y=X.outerHeight();r=Y/w;if(aE){at=Math.ceil(1/z*m);if(at>ay.horizontalDragMaxWidth){at=ay.horizontalDragMaxWidth}else{if(at<ay.horizontalDragMinWidth){at=ay.horizontalDragMinWidth}}i.width(at+"px");k=m-at;ad(Z)}if(az){B=Math.ceil(1/r*u);if(B>ay.verticalDragMaxHeight){B=ay.verticalDragMaxHeight}else{if(B<ay.verticalDragMinHeight){B=ay.verticalDragMinHeight}}au.height(B+"px");j=u-B;ac(I)}}function ak(aJ,aL,aI,s){var aN="before",aK="after",aM;if(aL=="os"){aL=/Mac/.test(navigator.platform)?"after":"split"}if(aL==aN){aK=aL}else{if(aL==aK){aN=aL;aM=aI;aI=s;s=aM}}aJ[aN](aI)[aK](s)}function aD(aI,s,aJ){return function(){H(aI,s,this,aJ);this.blur();return false}}function H(aL,aK,aO,aN){aO=b(aO).addClass("jspActive");var aM,aJ,aI=true,s=function(){if(aL!==0){P.scrollByX(aL*ay.arrowButtonSpeed)}if(aK!==0){P.scrollByY(aK*ay.arrowButtonSpeed)}aJ=setTimeout(s,aI?ay.initialDelay:ay.arrowRepeatFreq);aI=false};s();aM=aN?"mouseout.jsp":"mouseup.jsp";aN=aN||b("html");aN.bind(aM,function(){aO.removeClass("jspActive");aJ&&clearTimeout(aJ);aJ=null;aN.unbind(aM)})}function q(){x();if(az){ap.bind("mousedown.jsp",function(aN){if(aN.originalTarget===c||aN.originalTarget==aN.currentTarget){var aL=b(this),aO=aL.offset(),aM=aN.pageY-aO.top-I,aJ,aI=true,s=function(){var aR=aL.offset(),aS=aN.pageY-aR.top-B/2,aP=w*ay.scrollPagePercent,aQ=j*aP/(Y-w);if(aM<0){if(I-aQ>aS){P.scrollByY(-aP)}else{U(aS)}}else{if(aM>0){if(I+aQ<aS){P.scrollByY(aP)}else{U(aS)}}else{aK();return}}aJ=setTimeout(s,aI?ay.initialDelay:ay.trackClickRepeatFreq);aI=false},aK=function(){aJ&&clearTimeout(aJ);aJ=null;b(document).unbind("mouseup.jsp",aK)};s();b(document).bind("mouseup.jsp",aK);return false}})}if(aE){G.bind("mousedown.jsp",function(aN){if(aN.originalTarget===c||aN.originalTarget==aN.currentTarget){var aL=b(this),aO=aL.offset(),aM=aN.pageX-aO.left-Z,aJ,aI=true,s=function(){var aR=aL.offset(),aS=aN.pageX-aR.left-at/2,aP=aj*ay.scrollPagePercent,aQ=k*aP/(S-aj);if(aM<0){if(Z-aQ>aS){P.scrollByX(-aP)}else{V(aS)}}else{if(aM>0){if(Z+aQ<aS){P.scrollByX(aP)}else{V(aS)}}else{aK();return}}aJ=setTimeout(s,aI?ay.initialDelay:ay.trackClickRepeatFreq);aI=false},aK=function(){aJ&&clearTimeout(aJ);aJ=null;b(document).unbind("mouseup.jsp",aK)};s();b(document).bind("mouseup.jsp",aK);return false}})}}function x(){if(G){G.unbind("mousedown.jsp")}if(ap){ap.unbind("mousedown.jsp")}}function aw(){b("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp");if(au){au.removeClass("jspActive")}if(i){i.removeClass("jspActive")}}function U(s,aI){if(!az){return}if(s<0){s=0}else{if(s>j){s=j}}if(aI===c){aI=ay.animateScroll}if(aI){P.animate(au,"top",s,ac)}else{au.css("top",s);ac(s)}}function ac(aI){if(aI===c){aI=au.position().top}al.scrollTop(0);I=aI;var aL=I===0,aJ=I==j,aK=aI/j,s=-aK*(Y-w);if(ai!=aL||aG!=aJ){ai=aL;aG=aJ;D.trigger("jsp-arrow-change",[ai,aG,O,l])}v(aL,aJ);X.css("top",s);D.trigger("jsp-scroll-y",[-s,aL,aJ]).trigger("scroll")}function V(aI,s){if(!aE){return}if(aI<0){aI=0}else{if(aI>k){aI=k}}if(s===c){s=ay.animateScroll}if(s){P.animate(i,"left",aI,ad)
}else{i.css("left",aI);ad(aI)}}function ad(aI){if(aI===c){aI=i.position().left}al.scrollTop(0);Z=aI;var aL=Z===0,aK=Z==k,aJ=aI/k,s=-aJ*(S-aj);if(O!=aL||l!=aK){O=aL;l=aK;D.trigger("jsp-arrow-change",[ai,aG,O,l])}t(aL,aK);X.css("left",s);D.trigger("jsp-scroll-x",[-s,aL,aK]).trigger("scroll")}function v(aI,s){if(ay.showArrows){aq[aI?"addClass":"removeClass"]("jspDisabled");ae[s?"addClass":"removeClass"]("jspDisabled")}}function t(aI,s){if(ay.showArrows){ax[aI?"addClass":"removeClass"]("jspDisabled");y[s?"addClass":"removeClass"]("jspDisabled")}}function L(s,aI){var aJ=s/(Y-w);U(aJ*j,aI)}function M(aI,s){var aJ=aI/(S-aj);V(aJ*k,s)}function aa(aU,aP,aJ){var aN,aK,aL,s=0,aT=0,aI,aO,aR,aQ,aS;try{aN=b(aU)}catch(aM){return}aK=aN.outerHeight();aL=aN.outerWidth();al.scrollTop(0);al.scrollLeft(0);while(!aN.is(".jspPane")){s+=aN.position().top;aT+=aN.position().left;aN=aN.offsetParent();if(/^body|html$/i.test(aN[0].nodeName)){return}}aI=aA();aO=aI+w;if(s<aI||aP){aQ=s-ay.verticalGutter}else{if(s+aK>aO){aQ=s-w+aK+ay.verticalGutter}}if(aQ){L(aQ,aJ)}viewportLeft=aC();aR=viewportLeft+aj;if(aT<viewportLeft||aP){aS=aT-ay.horizontalGutter}else{if(aT+aL>aR){aS=aT-aj+aL+ay.horizontalGutter}}if(aS){M(aS,aJ)}}function aC(){return -X.position().left}function aA(){return -X.position().top}function af(){al.unbind(ab).bind(ab,function(aL,aM,aK,aI){var aJ=Z,s=I;P.scrollBy(aK*ay.mouseWheelSpeed,-aI*ay.mouseWheelSpeed,false);return aJ==Z&&s==I})}function o(){al.unbind(ab)}function aB(){return false}function J(){X.find(":input,a").unbind("focus.jsp").bind("focus.jsp",function(s){aa(s.target,false)})}function E(){X.find(":input,a").unbind("focus.jsp")}function R(){var s,aI;X.focus(function(){D.focus()});D.attr("tabindex",0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp",function(aM){if(aM.target!==this){return}var aL=Z,aK=I;switch(aM.keyCode){case 40:case 38:case 34:case 32:case 33:case 39:case 37:s=aM.keyCode;aJ();break;case 35:L(Y-w);s=null;break;case 36:L(0);s=null;break}aI=aM.keyCode==s&&aL!=Z||aK!=I;return !aI}).bind("keypress.jsp",function(aK){if(aK.keyCode==s){aJ()}return !aI});if(ay.hideFocus){D.css("outline","none");if("hideFocus" in al[0]){D.attr("hideFocus",true)}}else{D.css("outline","");if("hideFocus" in al[0]){D.attr("hideFocus",false)}}function aJ(){var aL=Z,aK=I;switch(s){case 40:P.scrollByY(ay.keyboardSpeed,false);break;case 38:P.scrollByY(-ay.keyboardSpeed,false);break;case 34:case 32:P.scrollByY(w*ay.scrollPagePercent,false);break;case 33:P.scrollByY(-w*ay.scrollPagePercent,false);break;case 39:P.scrollByX(ay.keyboardSpeed,false);break;case 37:P.scrollByX(-ay.keyboardSpeed,false);break}aI=aL!=Z||aK!=I;return aI}}function Q(){D.attr("tabindex","-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp")}function C(){if(location.hash&&location.hash.length>1){var aJ,aI;try{aJ=b(location.hash)}catch(s){return}if(aJ.length&&X.find(location.hash)){if(al.scrollTop()===0){aI=setInterval(function(){if(al.scrollTop()>0){aa(location.hash,true);b(document).scrollTop(al.position().top);clearInterval(aI)}},50)}else{aa(location.hash,true);b(document).scrollTop(al.position().top)}}}}function ah(){b("a.jspHijack").unbind("click.jsp-hijack").removeClass("jspHijack")}function n(){ah();b("a[href^=#]").addClass("jspHijack").bind("click.jsp-hijack",function(){var s=this.href.split("#"),aI;if(s.length>1){aI=s[1];if(aI.length>0&&X.find("#"+aI).length>0){aa("#"+aI,true);return false}}})}function an(){var aJ,aI,aL,aK,aM,s=false;al.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp",function(aN){var aO=aN.originalEvent.touches[0];aJ=aC();aI=aA();aL=aO.pageX;aK=aO.pageY;aM=false;s=true}).bind("touchmove.jsp",function(aQ){if(!s){return}var aP=aQ.originalEvent.touches[0],aO=Z,aN=I;P.scrollTo(aJ+aL-aP.pageX,aI+aK-aP.pageY);aM=aM||Math.abs(aL-aP.pageX)>5||Math.abs(aK-aP.pageY)>5;return aO==Z&&aN==I}).bind("touchend.jsp",function(aN){s=false}).bind("click.jsp-touchclick",function(aN){if(aM){aM=false;return false}})}function h(){var s=aA(),aI=aC();
D.removeClass("jspScrollable").unbind(".jsp");D.replaceWith(ao.append(X.children()));ao.scrollTop(s);ao.scrollLeft(aI)}b.extend(P,{reinitialise:function(aI){aI=b.extend({},ay,aI);ar(aI)},scrollToElement:function(aJ,aI,s){aa(aJ,aI,s)},scrollTo:function(aJ,s,aI){M(aJ,aI);L(s,aI)},scrollToX:function(aI,s){M(aI,s)},scrollToY:function(s,aI){L(s,aI)},scrollToPercentX:function(aI,s){M(aI*(S-aj),s)},scrollToPercentY:function(aI,s){L(aI*(Y-w),s)},scrollBy:function(aI,s,aJ){P.scrollByX(aI,aJ);P.scrollByY(s,aJ)},scrollByX:function(s,aJ){var aI=aC()+s,aK=aI/(S-aj);V(aK*k,aJ)},scrollByY:function(s,aJ){var aI=aA()+s,aK=aI/(Y-w);U(aK*j,aJ)},positionDragX:function(s,aI){V(s,aI)},positionDragY:function(aI,s){V(aI,s)},animate:function(aI,aL,s,aK){var aJ={};aJ[aL]=s;aI.animate(aJ,{duration:ay.animateDuration,ease:ay.animateEase,queue:false,step:aK})},getContentPositionX:function(){return aC()},getContentPositionY:function(){return aA()},getContentWidth:function(){return S()},getContentHeight:function(){return Y()},getPercentScrolledX:function(){return aC()/(S-aj)},getPercentScrolledY:function(){return aA()/(Y-w)},getIsScrollableH:function(){return aE},getIsScrollableV:function(){return az},getContentPane:function(){return X},scrollToBottom:function(s){U(j,s)},hijackInternalLinks:function(){n()},destroy:function(){h()}});ar(N)}f=b.extend({},b.fn.jScrollPane.defaults,f);b.each(["mouseWheelSpeed","arrowButtonSpeed","trackClickSpeed","keyboardSpeed"],function(){f[this]=f[this]||f.speed});var e;this.each(function(){var g=b(this),h=g.data("jsp");if(h){h.reinitialise(f)}else{h=new d(g,f);g.data("jsp",h)}e=e?e.add(g):g});return e};b.fn.jScrollPane.defaults={showArrows:false,maintainPosition:true,clickOnTrack:true,autoReinitialise:false,autoReinitialiseDelay:500,verticalDragMinHeight:0,verticalDragMaxHeight:99999,horizontalDragMinWidth:0,horizontalDragMaxWidth:99999,animateScroll:false,animateDuration:300,animateEase:"linear",hijackInternalLinks:false,verticalGutter:4,horizontalGutter:4,mouseWheelSpeed:0,arrowButtonSpeed:0,arrowRepeatFreq:50,arrowScrollOnHover:false,trackClickSpeed:0,trackClickRepeatFreq:70,verticalArrowPositions:"split",horizontalArrowPositions:"split",enableKeyboardNavigation:true,hideFocus:false,keyboardSpeed:0,initialDelay:300,speed:30,scrollPagePercent:0.8}})(jQuery,this);