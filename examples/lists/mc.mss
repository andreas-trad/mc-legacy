.listContainer .listitem:not(triggeringElement):click{
    duration:3000;
    delay:@domel.data-delay;
    opacity:0.5;
    scale:0.8;
    easingeaseOutBack;
    backgroundColorRed:245;
    backgroundColorGreen:245;
    backgroundColorBlue:245;
    translateX:-@rand(220, 240)px;
    boxShadowBlur:0em;
}


.listContainer .listitem:triggeringElement:click{
    duration:3000;
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
    duration:3000;
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

.listContainer .listitem:stop{
    stop:true;
}

.listContainer .listitem:stop-and-reverse{
    stop:true;
}

.listContainer .listitem:reverse{
    reverse:true;
    duration:3000;
    delay:@domel.data-delay;
}

stop-and-reverse:callback{
    eventName:reverse;
}

.listContainer .listitem:reverse-loop{
    stop:true;
    complete{
        reverse:true;
        duration:3000;
        loop:100;
    }
}