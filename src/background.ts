// Plasmo Background Service Worker
export {};

// Create context menu
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "convertIP",
		title: "Convert IP Address",
		contexts: ["selection"],
	});
});

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "convertIP" && info.selectionText && tab?.id) {
		// Send selected text to content script
		// IP detection and conversion are handled in the content script
		chrome.tabs.sendMessage(tab.id, {
			action: "convertSelection",
			text: info.selectionText,
		});
	}
});
