let storedElementDetails = null;

// Create the menu item
browser.contextMenus.create({
    id: "inspect-element",
    title: "Grab html details",
    icons: {
        "16": "grabber-16.png",
        "32": "grabber-32.png"
    },
    //contexts: ["page", "image", "link", "video", "selection", "editable"] // Include "editable" for text areas and inputs
    contexts: ["all"] // Include "editable" for text areas and inputs
});

// Handle clicks on the item
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "inspect-element") {
        browser.tabs.sendMessage(tab.id, {
            action: "inspect-element"
        });
    }
});

// Listen for messages from the content script
browser.runtime.onMessage.addListener((message) => {
    if (message.action === "store-element-details") {
        storedElementDetails = message.details; // Store the element details

        // Open the popup programmatically
        browser.windows.create({
            url: "popup.html",
            type: "popup",
            width: 600,
            height: 600
        });
    }
});

// Provide the stored element details to the popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "get-element-details") {
        sendResponse(storedElementDetails);
    }
});