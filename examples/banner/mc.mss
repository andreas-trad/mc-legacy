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
    eventName:stepThree;
    eventName:stepTwo;
}

.myBanner:stepTwo{
    .step1{
        opacity:0;
        duration:500;
        scale:4;
        top:-=180px;
    }
}

.myBanner:stepThree{
    opacity:0;
    duration:1000;
}