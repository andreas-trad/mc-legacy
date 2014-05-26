.bar:showBars{
    .percentage{
        delay:@domel.data-duration;
        duration:1000;
        backgroundColorBlue:@domel.data-percentage;
        backgroundColorGreen:@domel.data-percentage;
        height: @domel.data-percentage;
    }
    .number{
        rotateX:180deg;
        duration:0;
        complete{
            delay:@domel.data-duration;
            duration:1000;
            opacity:1;
            rotateX:360deg;
        }
    }
}

.biggest.number:highlight{
    boxShadowBlur:2em;

    backgroundColorRed:100%;
    backgroundColorBlue:100%;
    backgroundColorGreen:100%;

    duration:100;
    complete{
        backgroundColorRed:0;
        backgroundColorBlue:63;
        backgroundColorGreen:63;

        colorRed:100%;
        colorGreen:100%;
        colorBlue:100%;

        duration:100;
    }

    loop:6;
}
