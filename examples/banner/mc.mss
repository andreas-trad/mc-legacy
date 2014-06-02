.myBanner:animate{
    .step1{
        opacity:0;
        duration:100;
        complete{
            delay:100;
            opacity:1;
            duration:100;
        }
        loop:4;
    }
}

animate:callback{
    eventName:stepTwo;
}

.myBanner:stepTwo{
    .step2{
        scale:4;
        duration:0;
        complete{
            delay:350;
            opacity:1;
            duration:250;
            scale:1;
            complete{
                colorRed:256;
                colorBlue:256;
                colorGreen:256;
                .initzero .onebyone{
                    width:12px;
                    duration:1000;
                }
                duration:500;
            }
        }
    }
    .step1{
        opacity:0;
        duration:500;
        scale:4;
        top:-=180px;
    }

}