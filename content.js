let lastClickedElement = null;

// Listen for right-clicks to capture the element
document.addEventListener("contextmenu", (event) => {
    lastClickedElement = event.target; // Store the element that was right-clicked
});

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message) => {
    console.log("Received message:", message);
    if (message.action === "inspect-element") {
        try {
            if (lastClickedElement) {
                let elementDetails = {
                    tagName: lastClickedElement.tagName,
                    id: lastClickedElement.id || null,
                    className: lastClickedElement.className || null,
                    name: lastClickedElement.name || null,
                    type: lastClickedElement.type || null,
                    value: lastClickedElement.value || null,
                    placeholder: lastClickedElement.placeholder || null,
                    innerText: lastClickedElement.innerText || null,
                    attributes: Array.from(lastClickedElement.attributes).map(attr => ({
                        name: attr.name,
                        value: attr.value
                    }))
                };

                // Send the element details to the background script
                browser.runtime.sendMessage({
                    action: "store-element-details",
                    details: elementDetails
                });
            } else {
                console.warn("No element was right-clicked.");
            }
        } catch (e) {
            console.error("Error retrieving target element:", e);
        }
    }
});
