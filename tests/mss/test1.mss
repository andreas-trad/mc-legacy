.section1:showPercentage{
    backgroundColorBlue: @domel.data-percentage;
    backgroundColorGreen: @domel.data-percentage;
    backgroundColorRed: @domel.data-percentage;
    duration:@domel.duration;
    width:@domel.data-percentage;
    easing: swing;
	
	complete
	{
		span
		{
			duration:500;
			opacity:1;
		}
	}
}
