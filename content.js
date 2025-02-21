// List of words to censor
const badWords = ["fuck", "shit", "bitch", "asshole", "bastard", "dumbass", "motherfucker","stupid", "loser", "pathetic", "worthless", "dumb", "ugly", "idiot", "clown", "freak", "annoying", "failure", "disgrace", "joke", "irrelevant", "trash", "embarrassing", "hate", "destroy", "ruin", "end you", "wish you were gone", "you're overreacting", "no one cares", "stop being dramatic", "it's all in your head"];

// Function to replace and highlight abusive words
function highlightAndFilterText(node) {
    if (!node || !node.nodeValue) return;

    let text = node.nodeValue;
    let parent = node.parentNode;

    let modified = false;
    badWords.forEach((word) => {
        let regex = new RegExp(`\\b${word}\\b`, "gi");
        if (text.match(regex)) {
            modified = true;
            let censoredWord = "*".repeat(word.length);
            text = text.replace(regex, censoredWord);
        }
    });

    if (modified) {
        let span = document.createElement("span");
        span.textContent = text;
        span.style.backgroundColor = "yellow";
        span.style.color = "red";
        span.style.fontWeight = "bold";
        requestIdleCallback(() => {
            if (node.parentNode) {
                node.parentNode.replaceChild(span, node);
            }
        });
        
            
    }
}

// Function to scan and filter text nodes
function scanAndFilterTextNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
        highlightAndFilterText(node);
    }
}

// Function to observe DOM changes
function observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                scanAndFilterTextNodes();
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

// Initial scan on page load
scanAndFilterTextNodes();

// Ensure no old event listeners are left
if (window._observer) {
    window._observer.disconnect();
}

// Use MutationObserver instead of outdated events
window._observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                highlightAndFilterText(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                scanAndFilterTextNodes();
            }
        });
    }
});

// Start observing changes
window._observer.observe(document.body, { childList: true, subtree: true });

console.log("Content filter extension is active and error-free.");
