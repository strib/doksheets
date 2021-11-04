## Google Sheets script for Decks of Keyforge

All this code was originally by @blinkingline, all hail @blinkingline!
See
https://archonarcana.com/Essay:Build_a_Deck_Inventory_Spreadsheet_with_Google_Scripts.

## Use

The basic idea is that you have a sheet in your Google Spreadsheet
with a link to a deck in one of the columns.  By default, the code
assumes it's a decksofkeyforge.com link.  Then it uses your API key to
fetch the data and fill in other columns with DoK data for each deck.
Each user needs their own API key, and will have their own API limits
that need to be set in the constants at the top of the code.

The script updates rows from the bottom-up (since your newest decks
with no data will likely be on the bottom).  Every time there's a SAS
update, you must update the latest SAS version constant at the top of
the script.

Once you add and authorize this code (see
https://archonarcana.com/Essay:Build_a_Deck_Inventory_Spreadsheet_with_Google_Scripts
for those instructions), you will have a menu item where you can
refresh the data on command.

Happy forging!
