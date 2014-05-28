.listContainer .listitem:not(triggeringElement):click{
    duration:@rand(100,300);
    delay:@domel.data-delay;
    opacity:0.5;
    scale:@rand(0.7,0.9);
    easingeaseOutBack;
    backgroundColorRed:245;
    backgroundColorGreen:245;
    backgroundColorBlue:245;
    translateX:-@rand(200, 300)px;
    boxShadowBlur:0em;
}


.listContainer .listitem:triggeringElement:click{
    duration:300;
    scale:1;
    opacity:1;
    easing:easeOutBack;
    backgroundColorRed:245;
    backgroundColorGreen:245;
    backgroundColorBlue:245;
    translateX:100px;
    complete{
        duration:1000;
        boxShadowBlur:1em;
    }
}

.listContainer .listitem:unclick{
    duration:300;
    scale:1;
    opacity:1;
    delay:@domel.data-delay;
    easing:easeOutBack;
    backgroundColorRed:255;
    backgroundColorGreen:255;
    backgroundColorBlue:255;
    translateX:0px;
    boxShadowBlur:0em;

}