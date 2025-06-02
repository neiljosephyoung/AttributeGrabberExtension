document.addEventListener("DOMContentLoaded", () => {
    // Request the stored element details from the background script
    browser.runtime.sendMessage({ action: "get-element-details" }).then((details) => {
        const container = document.getElementById("element-details");
        if (details) {
            let html = `<h3>HTML Element Details</h3>`;
            const addCopyButton = (label, value) => {
                return `<div class="element-detail">
                            <p><strong>${label}:</strong> ${value}</p>
                            <button class="copy-button" data-value="${value}">Copy to clipboard</button>
                        </div>`;
            };

            html += addCopyButton("Tag Name", details.tagName);
            if (details.id) html += addCopyButton("ID", details.id);
            if (details.className) html += addCopyButton("Class", details.className);
            if (details.name) html += addCopyButton("Name", details.name);
            if (details.type) html += addCopyButton("Type", details.type);
            if (details.value) html += addCopyButton("Value", details.value);
            if (details.placeholder) html += addCopyButton("Placeholder", details.placeholder);
            if (details.innerText) html += addCopyButton("Text Content", details.innerText);
            if (details.attributes.length > 0) {
                html += `<h4>Attributes:</h4>`;
                details.attributes.forEach(attr => {
                    html += addCopyButton(attr.name, attr.value);
                });
            }

            container.innerHTML = html;

            // Add event listeners to copy buttons
            document.querySelectorAll(".copy-button").forEach(button => {
                button.addEventListener("click", (event) => {
                    const value = event.target.getAttribute("data-value");
                    navigator.clipboard.writeText(value).then(() => {
                        console.log(`Copied to clipboard: ${value}`);
                    }).catch(err => {
                        console.error("Failed to copy text: ", err);
                    });
                });
            });
        } else {
            container.innerHTML = "<p>No element details available.</p>";
        }
    });
});