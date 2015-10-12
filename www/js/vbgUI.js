// This work for hire application was developed as a collaborative effort for the benefit of all parks and gardens.
// Copyright 2015 Michele Dunham.

// Nathan Strout, Developer and Director of Spatial Technology, University of Redlands. 

// Released under the GNU General Public License.  View full license text in the LICENSE.TXT file at the ROOT of
// this GitHub repository.  View the short license text and DISCLAIMER in the README.TXT file located at the
// ROOT of this GitHub repository.

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

