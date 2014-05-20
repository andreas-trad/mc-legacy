@fastTranformation:400;

.section1:eventName{
    backgroundColorRed: 0%;
    duration:@globals.fastTranformation;
    width:1200px;
    delay:@index*50;
    height:@domel.data-height;
    img{
        width:300px;
        complete{
            delay:0;
            width:150px;
            height:@params.height;
        }
    }
}

.section2:eventName{
    width: 1400px;
    duration:1000;
}