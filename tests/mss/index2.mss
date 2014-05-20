@fastTranformation:400;

.section1:showPososta{
    backgroundColorBlue: @domel.data-pososto;
    backgroundColorGreen: @domel.data-pososto;
    duration:@domel.duration;
    width:@domel.data-pososto;
    easing: swing;

    img{
        rotateZ: 360deg;
        duration:1500;
        complete{
            rotateZ:180deg;
        }
    }

    complete{
        width:300px;
        duration:1000;
        complete{
            height:500px;
            duration:2000;
            delay:1000;
        }
    }
}
