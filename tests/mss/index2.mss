@fastTranformation:400;

.section1:triggeringElement:showPososta{
    backgroundColorBlue: @domel.data-pososto;
    backgroundColorGreen: @domel.data-pososto;
    duration:@domel.duration;
    width:@domel.data-pososto;
    easing: swing;

    complete{
        width:0%;
        duration:@params.duration;
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
