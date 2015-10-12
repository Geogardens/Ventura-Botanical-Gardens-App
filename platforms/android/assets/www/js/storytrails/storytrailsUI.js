
var scClientId = "b9d59b0609d6f9f6c898c4ee1639cbd4";
var audio;
var audioPlayed;
var audioPlaying;
var player;
var inForeground = true;
var currentArticle;
var previousArticle;


function initUI() {
    var style;
    //init geolocation to get the required permission from the user for iOS
    navigator.geolocation.getCurrentPosition(function () { return false;});
    if (device.platform != "Android") {
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", "css/iosTheme.css");
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }


    try {
        SC.initialize({ client_id: scClientId });
    }
    catch (e) {
        konsole.log("couldn't initialize sound cloud");
    }
    
    $("#aboutBtn").on("singletap", function () {
        referringArticle = "main";
        $.UIGoToArticle("#about");
        //if (!$("#about").hasClass("current")) {
        //    $("#about").addClass("current");
        //}
    });
    $(".GuidedTourButton").on("singletap", function (e) {
        if (appProfile.guidedTourOn == true) {
            $(".GuidedTourButton").removeClass("tourOn");
            $(".tourStatus").text("Guided Tour OFF");
            $(".tourBtn").attr("src", "images/Buttons/stopTour.png");
            $(".LowGpsWarning").hide();
            stopGeofencing();

            appProfile.guidedTourOn = false;
            
        }
        else {
            $(".tourBtn").attr("src", "images/loaderCS6.gif");
            //check that we're within a mile of a stop
            //check that we're within a mile of a stop
            var geo_options = {
                enableHighAccuracy: true

            };
            navigator.geolocation.getCurrentPosition(function (position) {
                $(".tourBtn").attr("src", "images/Buttons/stopTour.png");
                var mapLocation = esri.geometry.geographicToWebMercator(new esri.geometry.Point(position.coords.longitude, position.coords.latitude));
                var stopInDistance = getStopInDistance(mapLocation, appProfile.currentTour.stops, 5280);
                if (stopInDistance != null && typeof (stopInDistance) != "undefined") {
                    $.UIPopup({
                        selector: "#" + currentArticle,
                        id: "confirmGeofence",
                        title: 'Starting Guided Tour',
                        message: 'The guided tour feature will track your location and alert you when you are approaching a tour stop. The app will then automatically update to show you the content for that stop.</br><i>Warning: This feature consumes more battery power.</i>',
                        cancelButton: 'Nevermind',
                        continueButton: "Let's go!",
                        callback: function () {
                            $(".GuidedTourButton").addClass("tourOn");
                            $(".tourStatus").text("Guided Tour ON");
                            $(".tourBtn").attr("src", "images/Buttons/startTour.png");
                            appProfile.guidedTourOn = true;
                            startGeofencing();
                        }
                    });

                }
                else {
                    $.UIPopup({
                        selector: "#" + currentArticle,
                        id: "geofenceWarning",
                        title: 'Too Far',
                        message: 'Sorry, you are too far away to begin this tour. You must be within 1 mile of a tour stop to use this feature.',
                        cancelButton: 'Got it'
                    });
                }

            }, locationError, geo_options);

        }
        e.preventDefault();
        return false;
    });

    $("#sponsorBtn").on("mouseup", function (e) {
        referringArticle = "main";

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        $.UIGoToArticle("#sponsors");
        //setTimeout(function () { loadAppSponsorsList(appData.sponsors); }, 250);
        
        //if (!$("#sponsors").hasClass("current")) {
        //    $("#sponsors").addClass("current");
        //}
        return false;
    });
    $("#mapLeftNavigation").on("tap", function () {
        $.UIGoToArticle("#main");
        //if (!$("#main").hasClass("current")) {
        //    $("#main").addClass("current");
        //}
    });
    $("#tourBtn").on("tap", function (e) {
        referringArticle = "main";
        //getTrailLists();

        $.UIGoToArticle("#trailList");
        //if (!$("#trailList").hasClass("current")) {
        //    $("#trailList").addClass("current");
        //}
    });

    $("#gardenBtn").on("tap", function () {
        referringArticle = "main";


        //MapStartup();
        viewMap(false, "main");
        $.UIGoToArticle("#mapArticle");
        //if (!$("#mapArticle").hasClass("current")) {
        //    $("#mapArticle").addClass("current");
        //}
    });
    $("#aboutBack").on('tap', function () {
        referringArticle = "aboutUs";
        $.UIGoBackToArticle("#main");
        //if (!$("#main").hasClass("current")) {
        //    $("#main").addClass("current");
        //}
    });
    $("#toursBack").on('tap', function () {

        $.UIGoBackToArticle("#main");
        //if (!$("#main").hasClass("current")) {
        //    $("#main").addClass("current");
        //}
    });
    $("#sponsorBack").on('tap', function () {
        //this avoids the event order issue that we've been having.
        //$("#SponsorsList").empty();
        referringArticle = "sponsors";
        $.UIGoBackToArticle("#main");
        //if (!$("#main").hasClass("current")) {
        //    $("#main").addClass("current");
        //}
    });

    $("#hrefTourList").on('singletap', function () {
        referringArticle = "main";
        konsole.log("navigating");
        var x = $.UINavigationHistory;
        $.UIGoBackToArticle("#trailList");
        //if (!$("#trailList").hasClass("current")) {
        //    $("#trailList").addClass("current");
        //}

    });

    $("#hrefViewStops").on("tap", function () {
        referringArticle = "stopView";
        appProfile.geofenceSwipeAway = true;
        stopPlayer();

        $.UIGoBackToArticle("#listOfStops");
        //if (!$("#listOfStops").hasClass("current")) {
        //    $("#listOfStops").addClass("current");
        //}
    });

    $("#hrefStopView").on("tap", function () {
        referringArticle = "PhotoList";
        $.UIGoBackToArticle("#stopView");
        //if (!$("#stopView").hasClass("current")) {
        //    $("#stopView").addClass("current");
        //}
    });

    $("#hrefPhotoList").on("singletap", function () {
        referringArticle = "stopView";
        $(".OverlayText").removeClass("SlideUpPhotoList");
        $(".OverlayText").addClass("SlideDownPhotoList");
        $.UIGoBackToArticle("#photoList");
        //if (!$("#photoList").hasClass("current")) {
        //    $("#photoList").addClass("current");
        //}
    });
    $("#hrefTourMap").on("tap", function () {
        //referringArticle = "ListOfStops";
        //localStorage.setItem("ReferringArticle", "ListOfStops");

        clearHighlighted();
        viewMap(true, "listOfStops");
        //MapStartup();

        $.UIGoToArticle("#mapArticle");
        //if (!$("#mapArticle").hasClass("current")) {
        //    $("#mapArticle").addClass("current");
        //}
        //This setInterval function addresses a bug in our iOS builds. The viewMap call above doesn't
        //redraw correctly without some timeout...so we are forcing it through an async interval (total of 5 seconds).
        var mapRedraws = 0;
        var redrawTimer = setInterval(function () {
            //konsole.log(mapRedraws + " - redrawing..");
            viewMap(true, "listOfStops");
            mapRedraws++;
            if (mapRedraws >= 50) {

                clearInterval(redrawTimer);
                mapRedraws = 0;
            }
        },
            100)
        //setTimeout(function () { viewMap(); }, 500);
    });
    $("#hrefStopViewTourMap").on("tap", function () {



        (player != null) ? player.destroy() : null;

        //isAudioPlaying = false;
        //MapStartup();
        viewMap(true, "stopView");
        $.UIGoToArticle("#mapArticle");
        //if (!$("#mapArticle").hasClass("current")) {
        //    $("#mapArticle").addClass("current");
        //}
        //This setInterval function addresses a bug in our iOS builds. The viewMap call above doesn't
        //redraw correctly without some timeout...so we are forcing it through an async interval (total of 5 seconds).
        mapRedraws = 0;
        var redrawTimer = setInterval(function () {

            viewMap(true, "stopView");
            mapRedraws++;
            //konsole.log(mapRedraws + " - redrawing..");
            if (mapRedraws >= 50) {

                clearInterval(redrawTimer);
                mapRedraws = 0;
            }
        },
            100)
    });
    document.addEventListener("backbutton",
        function () {

            var currentArticle = $(".current");
            var currentId = currentArticle.attr("id");
            if (currentId == "main" || currentArticle == null || typeof (currentId) != "undefined") {
                navigator.app.exitApp();
            }
            else {
                $.UIGoBackToArticle("#" + backTarget);
                //if (!$("#" + backTarget).hasClass("current")) {
                //    $("#" + backTarget).addClass("current");
                //}
                if (backTarget == "listOfStops") {
                    stopPlayer();
                }

            }
        }
    , false);

    $('article').on('navigationend', function (e) {
        // e.target is the current article that loaded
        previousArticle = currentArticle;
        currentArticle = e.target.id;
        konsole.log("navigated from" + previousArticle + " to " + currentArticle);
        var nav = $(e.target).prev();
        var target = $(e.target);
        if (e.target.id == 'main') {

            $("#global-nav").hide();

        } else {

            $("#global-nav").show();
        }
        if (e.target.id == "trailList" || e.target.id == "main") {
            appProfile.currentTour = null;
            appProfile.currentStop = null;
            appProfile.guidedTourOn = false;
        }
        nav.removeClass("previous");
        nav.removeClass("next");
        target.removeClass("previous");
        target.removeClass("next");
        if (!target.hasClass("current")) {
            target.removeClass();
            konsole.log("adding class");
            target.addClass("current");
        }
        if (previousArticle == "mapArticle") {
            stopGeolocation();
        }

        switch (e.target.id) {
            case "main":
                backTarget = "main";
                break;
            case "about":
                backTarget = "main";
                break;
            case "sponsors":
                backTarget = "main";
                break;
            case "trailList":
                backTarget = "main";
                break;
            case "splash":
                backTarget = "trailList";
                break;
            case "listOfStops":
                backTarget = "trailList";
                break;
            case "stopView":
                backTarget = "listOfStops";
                break;
            case "photoList":
                backTarget = "stopView";
                break;
            case "individualPhotos":
                backTarget = "photoList";
                break;
            case "mapArticle":
                startGeolocation();
                if (referringArticle == "stopView") {
                    backTarget = "stopView";
                }
                else if (referringArticle == "listOfStops") {
                    backTarget = "listOfStops";
                }
                else {
                    backTarget = "main";
                }

                break;
            default:
                backTarget = "main";
        }


    });
  
    
    $(".RightSwitchArrow").on("singletap", function (e) {
        if (appProfile.guidedTourOn == true) {
            appProfile.geofenceSwipeAway = true;
        }
        goToNextStop();
        e.preventDefault();
        e.stopPropagation();
        $(this).off('click');
        return false;
    });
    $("#stopView").on("swipeleft", function (e) {
        if (appProfile.guidedTourOn == true) {
            appProfile.geofenceSwipeAway = true;
        }
        goToNextStop();
        e.preventDefault();
        
        return false;
    });

    $(".LeftSwitchArrow").on("tap", function (e) {
        if (appProfile.guidedTourOn == true) {
            appProfile.geofenceSwipeAway = true;
        }
        goToPreviousStop();
        e.preventDefault();
        return false;
    });
    $("#stopView").on("swiperight", function (e) {
        if (appProfile.guidedTourOn == true) {
            appProfile.geofenceSwipeAway = true;
        }
        goToPreviousStop();
        e.preventDefault();
        return false;
    });
    $("#VideoLink").click(function () {
        if (appProfile.currentStop.videoLink != null && appProfile.currentStop.videoLink != "") {
            playVideo(appProfile.currentStop.videoLink);

        }

    });
    $("#AudioButton").click(function () {
        var timeDone;
        if (audio.loaded == false) {
            loadAudio(appProfile.currentStop.audioLink);
            return false;
        }
        if (appProfile.currentStop.audioLink != null && appProfile.currentStop.audioLink != "") {
            if (!audioPlayed) {
                //$("#PlayAudio").attr("src", "images/loaderCS6.gif");
                $("#PlayAudio").attr("src", "images/pauseBtn.png");
            }
            else {
                $("#PlayAudio").attr("src", "images/pauseBtn.png");
            }
            audio.play();
            audioPlayed = true;
            $("#MainControl").addClass("SlideDown");
            $("#AudioControl").removeClass("hidden");
            audioPlaying = true;
            $("#AudioImage").attr("src", "images/Buttons/soundIcon.png");
        }
    });
    $("#PlaySound").click(function (e) {
        audio.togglePause();
        if (audioPlaying) {
            $("#PlayAudio").attr("src", "images/playBtn.png");

        } else {
            $("#PlayAudio").attr("src", "images/pauseBtn.png");

        }
        audioPlaying = !audioPlaying;
        e.preventDefault();
        return false;
    });

    $("#StopSound").click(function () {
        stopPlayer();
    });
    $("#RewindSound").click(function () {
        if (audio.position < 15000) {
            audio.setPosition(0);
        } else {
            audio.setPosition(audio.position - 15000);
        }
    });
    document.addEventListener("resume", function () {
        inForeground = true;
       
        konsole.log("app in foreground");
        if (currentArticle == "stopView") {
            if (audio == null || audio.loaded == false) {
                setTimeout(function () {
                    goToStop(appProfile.currentTour.tag, appProfile.currentStop.orderId);
                }, 500);
                
                //loadAudio(appProfile.currentTour.stops[appProfile.currentStop.orderId + 1].audioLink);
                //loadAudio(appProfile.currentTour.stops[appProfile.currentStop.orderId].audioLink);
                //$("#PlayAudio").attr("src", "images/playBtn.png");


            }
            //goToStop(appProfile.currentTour.tag, appProfile.currentStop.orderId);
            //if (audio != null && audio.loaded && audioPlaying != true && audio.paused != true) {
            //    $("#PlayAudio").attr("src", "images/playBtn.png");
            //}
           
        }
    }, false);
    document.addEventListener("pause", function () {
        stopPlayer();
        inForeground = false;
        appProfile.lastActive = new Date();
        localStorage.appProfile = JSON.stringify(appProfile);
        konsole.log("app in background");
    }, false);
}
function loadAppSponsorsList(appSponsors) {
    //need to clear this everytime because I'm getting a strange event ordering issue.
    if (appSponsors.length > 0) {
        $("#SponsorsList").empty();
    }
    for (var i = 0; i < appSponsors.length; i++) {
        var spon = appSponsors[i];
        var sponName = spon.name;
        var sponLogo = spon.logoLink;
        var sponWebsite = spon.website;
        var nameCaption = "<b>" + sponName + "</b>";
        if (typeof (spon.caption) != "undefined" && spon.caption != null && spon.caption != "") {
            nameCaption += "<br/><i>" + spon.caption + "</i>";
        }
        var listItem = $('<li></li>');
        listItem.addClass('SponsorItem');
        var element = "";
        if (sponLogo == "" || sponLogo == null) {
            if (sponWebsite == "" || sponWebsite == null) {
                var text = $('<div class="tourSponsorItem sponsorLevel2">' + nameCaption + '</div>');
                listItem.append(text);
            }
            else {
                var text = $('<div class="tourSponsorItem sponsorLevel2">' + nameCaption + '</div>');
                text.attr('onmousedown', "window.open('" + sponWebsite + "','_blank','location=yes,EnableViewPortScale=yes','closebuttoncaption=Return')");
                listItem.append(text);
            }
        }
        else {


            if (sponWebsite == "" || sponWebsite == null) {
                var logo = $('<img class="LogoImg"></img>');
                logo.attr('src', sponLogo);
                listItem.append(logo);
                var text = $('<p>' + nameCaption + '</p>');
                listItem.append(text);
                //element = '<div>' + sponName + '</div>';
            }
            else {
                var logo = $('<img class="LogoImg"></img>');
                logo.attr('src', sponLogo);
                logo.attr('onmousedown', "window.open('" + sponWebsite + "','_blank','location=yes,EnableViewPortScale=yes','closebuttoncaption=Return')");
                listItem.append(logo);
                var text = $('<p>' + nameCaption + '</p>');
                listItem.append(text);
            }
        }
        $("#SponsorsList").append(listItem);
    }
}
function loadTourList(tours) {

    //empty list so it doesn't double load
    $("#ul_Trails").empty();
    //display all tours on page
    for (i = 0; i < tours.length; i++) {
        theTour = tours[i];
        var name = theTour.name;
        var tourTag = theTour.tag;
        var lst = $('<li  id="tour' + tourTag + '"></li>');
        lst.addClass('ListItem');
        var description = theTour.description.toString();
        var distance = theTour.distance.toString();
        var titleSpan = $("<span class='tourTitle'></span>");
        var distSpan = $("<span class='tourDist'></span>");
        var descSpan = $("<span class='tourDesc'></span>");
        titleSpan.html(name);
        distSpan.html(distance);
        descSpan.html(description);
        lst.append(titleSpan);

        lst.append(distSpan);
        lst.append("<br/>");
        lst.append(descSpan);
        $("#ul_Trails").append(lst);
        $("#tour" + tourTag).on('singletap', function (e) {
            referringArticle = "trailList";
            var elemtentId = this.id;
            var tag = elemtentId.substring(4);
            goToTour(tag, 5);
        });

    }
}
function goToTour(tag, splashSeconds) {
    var tour = getTour(tag);

    if (tour == null || typeof tour == 'undefined') {
        return;
    }
    appProfile.currentTour = tour;

    $(".TourName").text(tour.name);

    splashSeconds = typeof splashSeconds !== 'undefined' ? splashSeconds : 5;

    if (splashSeconds > 0 && tour.sponsors.length > 0) {
        $("#tourSplashTitle").text("This tour sponsored by...");
        //Go to list of stops after 5 seconds
        $.UIGoToArticle("#splash");
        setTimeout(function () {
            $.UIGoToArticle("#listOfStops");
        }, splashSeconds * 1000);

        $("#tourSplashTitle").text("Tour sponsored by...");
        $("#tourSponsorList").empty();


        var lastLevel = 0;

        for (var i = 0; i < tour.sponsors.length; i++) {
            var sponsor = tour.sponsors[i];
            var sponName = sponsor.name;
            var sponLogo = sponsor.logoLink;

            var sponWebsite = sponsor.website;
            var sponLevel = sponsor.level;

            var listItem = $('<li></li>');
            var sponItem = $('<div>' + sponName + '</div>');

            sponItem.addClass('tourSponsorItem');
            if (!(sponLevel > 0)) {
                sponLevel = 4;
            }
            sponItem.addClass("sponsorLevel" + sponLevel);
            if (sponLevel > 1 && sponLevel > lastLevel) {
                sponItem.addClass('firstInLevel');
            }
            lastLevel = sponLevel;
            listItem.append(sponItem);
            $("#tourSponsorList").append(listItem);
        }


    }
    else {
        $.UIGoToArticle("#listOfStops");
    }
    $(".TourHeader").show();
    $(".GuidedTourButton").removeClass("tourOn");
    $(".tourStatus").text("Guided Tour OFF");
    $(".tourBtn").attr("src", "images/Buttons/stopTour.png");
    appProfile.guidedTourOn = false;

    $("#TrailStopList").empty();
    $("#OverlayText").text(tour.name);
    $("#spanTourDistance").text(tour.distance);
    $("#spanTourDescription").text(tour.description);

    GetPinImages();
    for (var i = 0; i < tour.stops.length; i++) {
        var stop = tour.stops[i];
        var stopNumber = parseInt(stop.orderId);

        var stopItem = $('<li></li>');

        stopItem.addClass('StopItem');
        var stopContainer = $("<div></div>");
        stopContainer.addClass("StopContainer");

        var imgTourStop = $('<img></img>');
        imgTourStop.attr('src', imgArray[stopNumber].src);
        imgTourStop.attr("float", "left");
        imgTourStop.addClass('imgTourStops');

        var tourStopName = stop.title;
        stopItem.attr('id', "stop_" + stopNumber);
        stopContainer.append(imgTourStop);
        var stopTitle = $('<span></span>');
        stopTitle.addClass('stopName');
        stopTitle.html(tourStopName);
        stopContainer.append(stopTitle);
        stopItem.append(stopContainer);
        $("#TrailStopList").append(stopItem);
        //cache the images
        var stopImg = new Image();
        stopImg.src = stop.primaryPhotoLink;
    }
    $(".StopItem").on("singletap", function () {
        if (appProfile.currentStop != null && appProfile.currentStop.orderId == this.id.substring(5)) {
            $.UIGoToArticle("#stopView");
            return false;
        }
        goToStop(appProfile.currentTour.tag, this.id.substring(5));
    });
    addTourPushpins(tour.stops);
    if (tour.basemap.toLowerCase() == "garden" || tour.basemap.toLowerCase() == "imagery" || tour.basemap.toLowerCase() == "topo") {
        changeView(tour.basemap);
    }
    else {
        changeView("Imagery");
    }
    
    $("body").on('swipe', function (e) {
        e.preventDefault();
    });
}
function goToStop(tourTag, stopNumber) {
    var stop = getStop(tourTag, stopNumber);

    if (stop == null || typeof stop == 'undefined') {
        return;
    }
    appProfile.currentStop = stop;
    $(".StopContainer").removeClass("TargetStopItem");
    $("#stop_" + appProfile.currentStop.orderId + " > .StopContainer").addClass("TargetStopItem");
    if (player != null) {
        player.destroy();
        player = null;
    }
    stopPlayer();


    //var bgImg = new Image();
    //bgImg.onload = function () {
    $.get(appProfile.currentStop.primaryPhotoLink).done(function () {
        $('.CoverImageDiv').css('background-image', 'url("' + stop.primaryPhotoLink + '")');
    }).fail(function () {
        $('.CoverImageDiv').css('background-image', 'url("images/imagePlaceholder.jpg")');
    })

    //$('.CoverImageDiv').css('background-image', 'url("' + stop.primaryPhotoLink + '")');
    //}
    //bgImg.src = stop.primaryPhotoLink;
    //$('.CoverImageDiv').css('background-image', 'url("images/imagePlaceholder.jpg")');
    $("#hrefGotoPhotoList").off("tap");


    $("#stopDescriptionContainer").height($("#stopView").height() - $("#divTrailInfo").height() - 50);


    //rebinding them
    $("#hrefGotoPhotoList").on("singletap", function () {
        referringArticle = "stopView";
        $("#GoToPhotos").addClass("Tapped");
        $.UIGoToArticle("#photoList");
        $("#GoToPhotos").removeClass("Tapped");
    });


    $("#stopDescription").text(stop.description);
    $("#OverlayText").text(stop.title);

    var stopOrder = stop.orderId;
    highlightStop(stopOrder);
    centerAtStop(appProfile.currentStop);
    $("#PinImage").attr("src", GetPinImageUrl(stopOrder));

    //set the css for the pin image - scaling down to 50%
    $("#PinImage").addClass("pinImage");
    audio = null;
    if (inForeground == true && stop.audioLink != null && stop.audioLink != "" && navigator.connection.type != Connection.NONE) {
        $("#AudioImage").attr("src", "images/loaderCS6.gif");
        loadAudio(stop.audioLink);
    }
    else {
        $("#AudioImage").attr("src", "images/soundInactive.png");
    }
    if (stop.videoLink == null || stop.videoLink == "" || navigator.connection.type == Connection.NONE) {
        $("#VideoImage").attr("src", "images/videoInactive.png");
    } else {
        $("#VideoImage").attr("src", "images/Buttons/videoCamera.png");
    }
    if (appProfile.currentStop.flickrSetId != null) {
        GetPhotosFromSet(appProfile.currentStop.flickrSetId);
    }
    else
    {
        GetPhotoList(stop.tag);
    }
    


    //setSrc("CoverImage", featureSet.features[i].attributes.PrimaryImage);
    //$('.CoverImageDiv').css('background-image', 'url("' + stop.primaryPhotoLink + '")');
    $.UIGoToArticle("#stopView");
}
function loadAudio(url) {
    //var clientID = "b9d59b0609d6f9f6c898c4ee1639cbd4";
    audioPlayed = false;
    var jqxhr = $.ajax({
        url: "http://api.soundcloud.com/resolve.json?url=" + url + "&client_id=" + scClientId,
        async: true,
        cache:false
    }).done(function (data) {
        //Load Audio       

        // first do async action

        SC.stream("http://api.soundcloud.com/tracks/" + data.id, {
            autoLoad: true,
            useHTML5Audio: true,
            preferFlash: false,
            whileloading: function () {
                konsole.log("loading...");
                $("#AudioImage").attr("src", "images/loaderCS6.gif");
            },
            onload: function () {
                $("#AudioImage").attr("src", "images/Buttons/soundIcon.png");
                konsole.log("loaded");
               
            },
            onplay: function () {
                konsole.log("playing");
                //("#PlayAudio").attr("src", "images/pauseBtn.png");
            },
            onsuspend: function(){
                konsole.log("suspended");
            },
            onpause: function () {
                konsole.log("paused");
            },
            onresume: function () {
                konsole.log("resumed");
            },
            onfinish: function () {
                konsole.log("finished");
                stopPlayer();
            }
        }, function (sound) {
            konsole.log("stream callback");
            audio = sound;
            if (audio.loaded == true) {
                $("#AudioImage").attr("src", "images/loaderCS6.gif");
            }
            else {
                audio.load();

            }


        }
    );
    })
}
function stopPlayer() {
    if (audio) {
        audio.stop();
        $("#AudioControl").addClass("hidden");
        $("#MainControl").removeClass("SlideDown");
        $("#AudioImage").attr("src", "images/Buttons/soundIcon.png");

    }
    audioPlaying = false;
}
function playVideo(youTubeLink) {

    //player = null;
    $("#VideoImage").attr("src", "images/loaderCS6.gif");
    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPhone" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";

    if (deviceType == "Android") {
        cordova.plugins.videoPlayer.play(youTubeLink);
        $("#VideoImage").attr("src", "images/Buttons/videoCamera.png");
    } else {

        var id = matchYoutubeUrl(youTubeLink);
        konsole.log(id);
        if (player == null) {
            player = new YT.Player('player', {
                height: '0',
                width: '0',
                videoId: id,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onStateChange
                }
            });
        } else {
            player.playVideo();
            $("#VideoImage").attr("src", "images/Buttons/videoCamera.png");
        }

        function onPlayerReady(event) {
            event.target.playVideo();
        }

        function onStateChange(event) {
            if (event.data == 1) {
                $("#VideoImage").attr("src", "images/Buttons/videoCamera.png");
            }

        }

    }

}
function goToNextStop() {
    stopPlayer();
    if (appProfile.currentStop.orderId + 1 > appProfile.currentTour.stops.length) {
        goToStop(appProfile.currentTour.tag, 1);
    }
    else {
        goToStop(appProfile.currentTour.tag, appProfile.currentStop.orderId + 1);
    }
}
function goToPreviousStop() {
    stopPlayer();
    if (appProfile.currentStop.orderId - 1 == 0) {
        goToStop(appProfile.currentTour.tag, appProfile.currentTour.stops.length);
    }
    else {
        goToStop(appProfile.currentTour.tag, appProfile.currentStop.orderId - 1);
    }
}



function getStop(tourTag, stopNumber) {
    for (var i = 0; i < appData.tours.length ; i++) {
        if (appData.tours[i].tag == tourTag) {
            var tour = appData.tours[i];
            for (var j = 0; j < tour.stops.length; j++) {
                if (tour.stops[j].orderId == stopNumber) {
                    return tour.stops[j];
                }

            }

        }
    }
    return;
}
function getTour(tourTag) {
    for (var i = 0; i < appData.tours.length ; i++) {
        if (appData.tours[i].tag == tourTag) {
            return appData.tours[i];
        }

    }
}
function GetPinImageUrl(stopNumber) {
    return "images/pushpins/Normal/" + stopNumber + "Circle.png";
}

var konsole = {
    log: function () {
        if (typeof (debug) == "undefined" || debug == true) {
            console.log(arguments)
        }


    }
}