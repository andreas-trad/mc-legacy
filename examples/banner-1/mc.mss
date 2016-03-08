.layer-1:anim{
	scale:2;
	duration:0;
	opacity:0;

	complete{
		opacity:1;
		scale:1;
		duration:3000;
		left: -256px;
		easing:easeOutQuad;
		complete{
			left:0px;
			duration:3000;
			easing:easeInOutQuad;
		}
	}

}

.layer-1:step2{
	scale: 0.75;
	duration:9000;
	top:0;
	left:0;
	easing:linear;
}


.info-row:step2{
	delay:@domel.data-delay;
	duration:3000;
	left:0;
}

.text:step2{
	duration:6000;
	left:0px;
}


.info-rows:step3{
	duration:1500;
	height:768px;
	rotateZ:90deg;
	top:-203px;
}

.player:step3{
	opacity:1;
	duration:1000;
}

.layer-1:step3{
	opacity:0;
	duration:1000;
	complete{
		+.:hdn;
	}
}

.thess:step3{
	left:-48px;
	duration:1500;
}

.text:step4{
	padding-top:0;
	duration:500;
}

.trophies:step4{
	-.:hdn;
}

.what:step4{
	delay:@domel.data-delay;
	duration:3000;
	margin-top:0px;
}




anim:callback{
	eventName:step2;
}

step2:callback{
	eventName:step3;
}

step3:callback{
	eventName:step4;
}