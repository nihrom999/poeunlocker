window.addEventListener("load", function(e) { 
	
	var notificationService = Components.classes["@mozilla.org/messenger/msgnotificationservice;1"]
	.getService(Components.interfaces.nsIMsgFolderNotificationService);
    notificationService.addListener(newMailListener, notificationService.msgAdded);
	
	write("hello"); 
}, false);

var regEx = /((\w){3}-(\w){3}-(\w){4})/i;

function msgHdrToMessageBody(aMessageHeader, aStripHtml, aLength) {
  let messenger = Cc["@mozilla.org/messenger;1"].createInstance(Ci.nsIMessenger);
  let listener = Cc["@mozilla.org/network/sync-stream-listener;1"].createInstance(Ci.nsISyncStreamListener);
  let uri = aMessageHeader.folder.getUriForMsg(aMessageHeader);
  messenger.messageServiceFromURI(uri).streamMessage(uri, listener, null, null, false, "");
  let folder = aMessageHeader.folder;

  return folder.getMsgTextFromStream(
    listener.inputStream, aMessageHeader.Charset, 2*aLength, aLength, false, aStripHtml, { });
} 
	
var newMailListener = {
    msgAdded: function(aMsgHdr) {
        if( !aMsgHdr.isRead ) {
            var body = msgHdrToMessageBody(aMsgHdr, false, -1);
            var code = regEx.exec(body);

            if(code != null){
                const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
                clipboardHelper.copyString(code);
				write(code);
            }
        }
    }

}; 
	
function write(string) {
	var myPanel = document.getElementById("unlocker-panel");

	myPanel.label = "PoE unlocker: " + string;
}

