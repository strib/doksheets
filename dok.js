const LAST_SAS_VERSION = 41
const API_KEY = "YOUR DOK API KEY HERE"
const RATE_LIMIT_NUM_PER_TIME = 50
const RATE_LIMIT_TIME = 60000
const DOK_SHEET_NAME = "DoK data"
const DECK_ID_SUFFIX_START=33
const DECK_ID_COLUMN = 2

//Builds custom menu to trigger refreshes
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Deck Info Menu')
    .addItem('Refresh DoK Data', 'refreshSAS')
    .addToUi();
}

function getSAS(deckid, row) {
  /*
  Source of this data is Decks of Keyforge:
  https://decksofkeyforge.com/
  */
  //Set headers for decks of Keyforge API
  var headers = {
    "Api-Key" : API_KEY
  };

  //set params
  var params =  {
     "method" : "GET",
     "headers" : headers
  };

  // Call the DecksofKeyforge.com API to get SAS and AERC information.
  //var row = 18
  //var deckid = "4a366056-808d-4f81-a2d4-ba00c933248f";
  var url = "https://decksofkeyforge.com/public-api/v3/decks/" + deckid;
  var response = UrlFetchApp.fetch(url, params);
  // Parse response to variables
  var json = response.getContentText();
  var data = JSON.parse(json);
  //Logger.log(data);
  var name = data.deck.name;
  var creatureCount = data.deck.creatureCount;
  var houses = data.deck.housesAndCards.map(x=> x.house).join(',');
  var sasRating = data.deck.sasRating;
  var aerc = data.deck.aercScore;
  var actionCount = data.deck.actionCount
  var artifactCount = data.deck.artifactCount
  var upgradeCount = data.deck.upgradeCount
  var expectedAmber = data.deck.expectedAmber;
  var rawAmber = data.deck.rawAmber;
  var amberControl = data.deck.amberControl;
  var wins = data.deck.wins;
  var losses = data.deck.losses;
  var chains = data.deck.chains;
  var powerLevel = data.deck.powerLevel;
  var efficiency = data.deck.efficiency
  var artifactControl = data.deck.artifactControl
  var creatureControl = data.deck.creatureControl
  var sasVer = data.sasVersion
  var set = data.deck.expansion;
  if (set === 'AGE_OF_ASCENSION') {
    set = "AoA";
  } else {
    if (set === 'WORLDS_COLLIDE'){
      set = "WC";
    } else {
      if (set === 'MASS_MUTATION'){
        set = "MM";
      } else {
        if (set === 'DARK_TIDINGS'){
         set = "DT";
        } else {
         set = "CotA";
        }
      }
    }
  }

  //Put variables back into sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DOK_SHEET_NAME);
  if (response !== "undefined") {
    sheet.getRange(row,4).setValue([set]);
    sheet.getRange(row,5).setValue([houses]);
    sheet.getRange(row,6).setValue([sasRating]);
    sheet.getRange(row,7).setValue([aerc]);
    sheet.getRange(row,8).setValue([rawAmber]);
    sheet.getRange(row,9).setValue([expectedAmber]);
    sheet.getRange(row,10).setValue([amberControl]);
    sheet.getRange(row,11).setValue([efficiency])
    sheet.getRange(row,12).setValue([artifactControl])
    sheet.getRange(row,13).setValue([creatureControl])
    sheet.getRange(row,14).setValue([creatureCount]);
    sheet.getRange(row,15).setValue([actionCount]);
    sheet.getRange(row,16).setValue([artifactCount]);
    sheet.getRange(row,17).setValue([upgradeCount]);
    sheet.getRange(row,18).setValue([wins]);
    sheet.getRange(row,19).setValue([losses]);
    sheet.getRange(row,20).setValue([chains]);
    sheet.getRange(row,21).setValue([powerLevel]);
    sheet.getRange(row,22).setValue([sasVer])
  }
}

// Force a refresh of all SAS data.
function refreshSAS() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DOK_SHEET_NAME);
  var row;
  var count = 0
  for (row = sheet.getLastRow(); row >= 2; row--) {
    var deckid = sheet.getRange(row,DECK_ID_COLUMN).getValue();
    var sasVer = sheet.getRange(row,22).getValue()
    if (deckid !== "" && sasVer !== LAST_SAS_VERSION) {
      var deckid = deckid.slice(DECK_ID_SUFFIX_START);
      getSAS(deckid, row);
      count++
      //sleep to try to rate control and not overburden the API
      if(count%(RATE_LIMIT_NUM_PER_TIME-1) == 0){
        Utilities.sleep(RATE_LIMIT_TIME);
      }
    }
  }
}
