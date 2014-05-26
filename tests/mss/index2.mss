@fastTranformation:400;

.section1:showPososta{
    backgroundColorBlue: @domel.data-pososto;
    backgroundColorGreen: @domel.data-pososto;
    duration:@domel.duration;
    width:@domel.data-pososto;
    easing: swing;
    <#execInnerCallback>;
    <#execInnerCallback2>;

    complete{
        width:0%;
        duration:@params.duration;
        img{
            rotateZ: 360deg;
            duration:3000;
            complete{
                height:500px;
                complete{
                    delay:1000;
                    height:50px;
                    rotateZ: 0deg;
                }
            }
        }

    }
    loop-overall:6;
}
