function initVbgUI() {
    var screenHeight = screen.height;
    var homeImageSrc = "images/homeScreenLogo.png";
    if (screenHeight < 500) {
        homeImageSrc = "images/homeScreenLogoHorz.png";        
    }
    $("#imgBranding").attr('src', homeImageSrc);
    $("#imgBranding").css('height', "auto");
    $("#imgBranding").css('width', "auto");
    var homeImage = new Image();
    homeImage.src = homeImageSrc;
    homeImage.onload = function () {
        var topMargH = (((screenHeight - $("#homeLogo").height()) / 2) - $("#homeFooter").height())    -     ($("#homeBtnContainer").height() / 2);
        $("#homeBtnContainer").css("margin-top", topMargH);
        navigator.splashscreen.hide();
    }
    
}

