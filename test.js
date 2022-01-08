var price;
var carRate=20;
var no_of_days;
var arrDate="24/11/2020";
var retDate="02/01/2021";
var aryear=Number(arrDate.substring(6,10));
var retyear=Number(retDate.substring(6,10));
var retmon=Number(retDate.substring(3,5));
var arrmon=Number(arrDate.substring(3,5));
var arrdat=Number(arrDate.substring(0,2));
var retdat=Number(retDate.substring(0,2));
if((retyear-aryear)>0){
    retmon+=(retyear-aryear)*12;
 }
 if((retmon-arrmon)>0){
      retdat+=(retmon-arrmon)*30;
 }
 no_of_days=retdat-arrdat;
 price=carRate*no_of_days;
 console.log(no_of_days);
 console.log(price);