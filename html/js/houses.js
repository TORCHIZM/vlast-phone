var SelectedHousesTab = "myhouses";
var CurrentHouseData = {};
var HousesData = {};

$(document).on('click', '.houses-app-header-tab', function(e){
    e.preventDefault();
    var CurrentHouseTab = $("[data-housetab='"+SelectedHousesTab+"']");
    var Data = $(this).data('housetab');
    if (Data !== SelectedHousesTab) {
        $(".house-app-" + $(CurrentHouseTab).data('housetab') + "-container").css("display", "none");
        $(".house-app-" + Data + "-container").css("display", "block");
        $(CurrentHouseTab).removeClass('houses-app-header-tab-selected');
        $("[data-housetab='"+Data+"']").addClass('houses-app-header-tab-selected');
        SelectedHousesTab = Data
    }
});

// Fixlenene kadar kapalı uygulamayı bozuyor

// $(document).on('click', '.myhouses-house', function(e){
//     e.preventDefault();
//     var HouseData = $(this).data('HouseData');
//     console.log(HouseData);
//     CurrentHouseData = HouseData;
//     $(".myhouses-options-container").fadeIn(150);
//     $(".myhouses-options-header").html(HouseData.label);
// });

$(document).on('click', '#myhouse-option-close', function(e){
    e.preventDefault();

    $(".myhouses-options-container").fadeOut(150);
});

function SetupPlayerHouses(Houses) {
    $(".house-app-myhouses-container").html("");
    HousesData = Houses;
    if (Houses !== 0) {
            var elem = '<div class="myhouses-house" id="house-' + Houses + '"><div class="myhouse-house-icon"><i class="fas fa-home"></i></div> <div class="myhouse-house-titel">' + "Ev" + '</div> <div class="myhouse-house-details"> No: ' + Houses + '</div> </div>';
            $(".house-app-myhouses-container").append(elem);
            $("#house-" + Houses).data('HouseData', Houses)
    }
}


function setupPlayerVehicles() {

}

var AnimationDuration = 200;

$(document).on('click', '#myhouse-option-transfer', function(e){
    e.preventDefault();

    $(".myhouses-options").animate({
        left: -35+"vw"
    }, AnimationDuration);

    $(".myhouse-option-transfer-container").animate({
        left: 0
    }, AnimationDuration);
});

$(document).on('click', '#myhouse-option-keys', function(e){
    $(".keys-container").html("");
    if (CurrentHouseData.keyholders !== undefined && CurrentHouseData.keyholders !== null) {
        $.each(CurrentHouseData.keyholders, function(i, keyholder){
            if (keyholder !== null && keyholder !== undefined) {
                var elem;
                if (keyholder.charinfo.firstname !== NM.Phone.Data.PlayerData.charinfo.firstname && keyholder.charinfo.lastname !== NM.Phone.Data.PlayerData.charinfo.lastname) {
                    elem = '<div class="house-key" id="holder-'+i+'"><span class="house-key-holder">' + keyholder.charinfo.firstname + ' ' + keyholder.charinfo.lastname + '</span> <div class="house-key-delete"><i class="fas fa-trash"></i></div> </div>';
                } else {
                    elem = '<div class="house-key" id="holder-'+i+'"><span class="house-key-holder">(Ik) ' + keyholder.charinfo.firstname + ' ' + keyholder.charinfo.lastname + '</span></div>';
                } 
                $(".keys-container").append(elem);
                $('#holder-' + i).data('KeyholderData', keyholder);
            }
        });
    }
    $(".myhouses-options").animate({
        left: -35+"vw"
    }, AnimationDuration);
    $(".myhouse-option-keys-container").animate({
        left: 0
    }, AnimationDuration);
});

$(document).on('click', '.house-key-delete', function(e){
    e.preventDefault();
    var Data = $(this).parent().data('KeyholderData');

    $.each(CurrentHouseData.keyholders, function(i, keyholder){
        if (Data.citizenid == keyholder.citizenid) {
            CurrentHouseData.keyholders.splice(i);
        }
    });

    $.each(HousesData, function(i, house){
        if (house.name == CurrentHouseData.name) {
            HousesData[i].keyholders = CurrentHouseData.keyholders;
        }
    });

    SetupPlayerHouses(HousesData);

    $(this).parent().fadeOut(250, function(){
        $(this).remove();
    });

    $.post('http://qb-phone/RemoveKeyholder', JSON.stringify({
        HolderData: Data,
        HouseData: CurrentHouseData,
    }));
});

function shakeElement(element){
    $(element).addClass('shake');
    setTimeout(function(){
        $(element).removeClass('shake');
    }, 500);
};

$(document).on('click', '#myhouse-option-transfer-confirm', function(e){
    e.preventDefault();
        
    var NewBSN = $(".myhouse-option-transfer-container-citizenid").val();

    $.post('http://qb-phone/TransferCid', JSON.stringify({
        newBsn: NewBSN,
        HouseData: CurrentHouseData,
    }), function(CanTransfer){
        if (CanTransfer) {
            $(".myhouses-options").animate({
                left: 0
            }, AnimationDuration);
        
            $(".myhouse-option-transfer-container").animate({
                left: 35+"vw"
            }, AnimationDuration);

            setTimeout(function(){
                $.post('http://qb-phone/GetPlayerHouses', JSON.stringify({}), function(Houses){
                    SetupPlayerHouses(Houses);
                    $(".myhouses-options-container").fadeOut(150);
                });
            }, 100);
        } else {
            NM.Phone.Notifications.Add("houses", "Emlak", "Yanlış ID girdiniz");
            shakeElement(".myhouse-option-transfer-container");
            $(".myhouse-option-transfer-container-citizenid").val("");
        }
    });
});

$(document).on('click', '#myhouse-option-transfer-back', function(e){
    e.preventDefault();

    $(".myhouses-options").animate({
        left: 0
    }, AnimationDuration);

    $(".myhouse-option-transfer-container").animate({
        left: 35+"vw"
    }, AnimationDuration);
});

$(document).on('click', '#myhouse-option-keys-back', function(e){
    e.preventDefault();

    $(".myhouses-options").animate({
        left: 0
    }, AnimationDuration);
    $(".myhouse-option-keys-container").animate({
        left: 35+"vw"
    }, AnimationDuration);
});