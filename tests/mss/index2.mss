@fastTranformation:400;

.section1:showPososta{
    backgroundColorBlue: @domel.data-pososto;
    backgroundColorGreen: @domel.data-pososto;
    duration:@domel.duration;
    width:@domel.data-pososto;
    easing: swing;

    complete{
        width:0%;
        duration:1000;
        img{
            rotateZ: 360deg;
            duration:3000;
            complete{
                height:500px;
            }
        }
        complete{
            width:150px;
            duration:1000;
        }
    }
}