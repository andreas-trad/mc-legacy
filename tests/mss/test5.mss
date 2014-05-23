.loopad:Loop{

    .zzz ul li:first-child
	{
    	duration:300;
    	easing: easeInSine;
    	translateX:3px;
    	
    	complete
    	{
    		duration:300;
    		translateX:-3px;
    		
    		complete
    		{
    			duration:300;
    			translateX:3px;
    			
    			complete
    			{
    				duration:300;
    				translateX:0;
    			}
    		}
    	}
    }
    
    .zzz ul li:nth-child(2)
    {
    	duration:300;
    	easing: easeInSine;
    	translateX:-3px;
    	
    	complete
    	{
    		duration:300;
    		translateX:3px;
    		
    		complete
    		{
    			duration:300;
    			translateX:-3px;
    			
    			complete
    			{
    				duration:300;
    				translateX:0;
    			}
    		}
    	}
    }
    
    .zzz ul li:last-child
    {
    	duration:300;
    	easing: easeInSine;
    	translateX:3px;
    	
    	complete
    	{
    		duration:300;
    		translateX:-3px;
    		
    		complete
    		{
    			duration:300;
    			translateX:3px;
    			
    			complete
    			{
    				duration:300;
    				translateX:0;
    			}
    		}
    	}
    }
    
    .drop img
    {
    	duration:300;
    	easing: linear;
    	height:25px;	
    	width:15px;
    	
    	complete
    	{
    		duration:300;
    		easing: linear;
    		height:16px;
    		width:16px;
    		
    		complete
    		{
    			delay:500;
    			duration:300;
    			easing: linear;
    			height:25px;	
	    		width:15px;
	    		
	    		complete
	    		{
	    			delay:400;
	    			duration:300;
	    			easing: linear;
	    			height:16px;
	    			width:16px;
	    		}
    			
    		}
    	}
    }
    
    
    .goods ul li:first-child
    {
    	duration:500;
    	easing:linear;
    	opacity:1;
    	
    	complete
    	{
    		delay:2500;
    		duration:500;
	    	easing:linear;
    		opacity:0;
    	}
    }
    
    .goods ul li:nth-child(2)
    {
    	delay:300;
    	duration:500;
    	easing:linear;
    	opacity:1;
    	
    	complete
    	{
    		duration:500;
	    	easing:linear;
    		delay:2800;
    		opacity:0;
    	}
    }
    
    .goods ul li:last-child
    {
    	delay:600;
    	duration:500;
    	easing:linear;
    	opacity:1;
    	
    	complete
    	{
    		duration:500;
	    	easing:linear;
    		delay:3100;
    		opacity:0;
    	}
    }
    
    .goods span:first-child
    {
    	delay:1000;
    	duration:500;
    	easing:linear;
    	opacity:1;
    	
    	complete
    	{
    		delay: 3200;
    		opacity:0;
    		duration:500;
	    	easing:linear;
    	}
    }
    
    .goods span:nth-child(2)
    {
    	delay:1500;
    	duration:500;
    	easing:linear;
    	opacity:1;
    	
    	complete
    	{
    		delay: 3500;
    		opacity:0;
    		duration:500;
	    	easing:linear;
    	}
    }
    
    .goods span:nth-child(3)
    {
    	delay:2000;
    	duration:500;
    	easing:linear;
    	opacity:1;
    	
    	complete
    	{
    		delay:3800;
    		opacity:0;
    		duration:500;
	    	easing:linear;
    	}
    }
    
    .boxcat
    {
    	delay:6500;
    	duration:300;
    	top:0;
    	easing:linear;
    }
    
    .delivery
    {
    	delay:6800;
    	duration:300;
    	bottom:0px;
    	easing:linear;
    }

}

