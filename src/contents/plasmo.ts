import { Storage } from "@plasmohq/storage";
import ipRegex from "ip-regex";
import type { PlasmoCSConfig } from "plasmo";
import { addSpacingToBits, formatBitsToLines, getBitColorClass } from "../utils/bit-formatting";
import type { IPInfo } from "../utils/ip-address-common";
import { detectAndConvertIP } from "../utils/ip-address-common";
import { splitTextByIPAddresses } from "../utils/ip-text-segmentation";
import "./content-style.css";

export const config: PlasmoCSConfig = {
	matches: ["https://*/*", "http://*/*"],
};

const storage = new Storage();
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

// Extract the actual binary string to copy from bit notation
function getBinaryStringForCopy(bitsNotation: string, addressType: "ipv4" | "ipv6"): string {
	const segments = bitsNotation.split(":");
	return addressType === "ipv4"
		? segments
				.slice(0, 2)
				.join("") // IPv4: first 32 bits
		: segments.join(""); // IPv6: full 128 bits
}

// Create copy button
function createCopyButton(bitsNotation: string, addressType: "ipv4" | "ipv6"): HTMLButtonElement {
	const button = document.createElement("button");
	button.textContent = "Copy";
	button.className = "copy-button";
	button.title = "Copy binary string";
	button.style.cssText = "position: absolute; top: 8px; right: 8px; z-index: 11;";

	button.addEventListener("click", async () => {
		try {
			const binaryString = getBinaryStringForCopy(bitsNotation, addressType);
			await navigator.clipboard.writeText(binaryString);
			button.textContent = "Copied!";
			setTimeout(() => {
				button.textContent = "Copy";
			}, 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	});

	return button;
}

// Create tooltip element
function createTooltip(ipInfo: IPInfo): HTMLElement {
	const tooltip = document.createElement("div");
	tooltip.className = "ipv6-tooltip";
	tooltip.style.display = "none";

	const label = ipInfo.type === "ipv4" ? "IPv4 Binary:" : "IPv6 Binary:";

	// Header area (label + copy button)
	const header = document.createElement("div");
	header.className = "tooltip-header";

	const labelDiv = document.createElement("div");
	labelDiv.className = "tooltip-label";
	labelDiv.textContent = label;
	header.appendChild(labelDiv);

	// Container for classification info and copy button
	if (ipInfo.classification) {
		const classificationHeader = document.createElement("div");
		classificationHeader.className = "tooltip-classification-header";

		const classificationDiv = document.createElement("div");
		classificationDiv.className = "tooltip-classification";
		classificationDiv.innerHTML = `
			<div class="classification-type">${ipInfo.classification.type}</div>
			${ipInfo.classification.description ? `<div class="classification-description">${ipInfo.classification.description}</div>` : ""}
		`;
		classificationHeader.appendChild(classificationDiv);

		const copyButton = createCopyButton(ipInfo.binary, ipInfo.type as "ipv4" | "ipv6");
		copyButton.style.cssText = "position: static;";
		classificationHeader.appendChild(copyButton);

		tooltip.appendChild(header);
		tooltip.appendChild(classificationHeader);
	} else {
		const copyButton = createCopyButton(ipInfo.binary, ipInfo.type as "ipv4" | "ipv6");
		header.appendChild(copyButton);
		tooltip.appendChild(header);
	}

	// Bit display area
	const bitsContainer = document.createElement("div");
	bitsContainer.className = "tooltip-bits-container";
	const lines = formatBitsToLines(ipInfo.binary);

	lines.forEach((line) => {
		const lineDiv = document.createElement("div");
		lineDiv.className = "tooltip-line";

		const lineNumber = document.createElement("span");
		lineNumber.className = "tooltip-line-number";
		lineNumber.textContent = `${line.lineNumber}:`;

		const bitsSpan = document.createElement("span");
		bitsSpan.className = "tooltip-bits";
		bitsSpan.innerHTML = addSpacingToBits(line.bits)
			.split("")
			.map((char) => {
				if (char === " ") return char;
				const colorClass = getBitColorClass(char);
				return colorClass ? `<span class="${colorClass}">${char}</span>` : char;
			})
			.join("");

		lineDiv.appendChild(lineNumber);
		lineDiv.appendChild(bitsSpan);
		bitsContainer.appendChild(lineDiv);
	});

	tooltip.appendChild(bitsContainer);

	return tooltip;
}

// Create span element for detected IP address
function createIPSpan(ipAddress: string, addressType: "ipv4" | "ipv6"): HTMLSpanElement {
	const span = document.createElement("span");
	span.textContent = ipAddress;
	span.style.position = "relative";
	span.style.cursor = "help";
	span.style.textDecoration = "underline";
	span.style.textDecorationStyle = "dotted";
	span.setAttribute("data-ip", ipAddress);
	span.setAttribute("data-ip-type", addressType);
	span.setAttribute("data-ip-converted", "true");
	return span;
}

// Set hover events for tooltip
function setupTooltipHoverEvents(element: HTMLElement, tooltip: HTMLElement): void {
	let hideTimeout: NodeJS.Timeout;

	const showTooltip = () => {
		clearTimeout(hideTimeout);
		const rect = element.getBoundingClientRect();
		tooltip.style.display = "block";
		tooltip.style.position = "fixed";
		tooltip.style.left = `${rect.left}px`;
		tooltip.style.top = `${rect.bottom + 2}px`;
		tooltip.style.zIndex = "10000";
	};

	const hideTooltip = () => {
		hideTimeout = setTimeout(() => {
			tooltip.style.display = "none";
		}, 200);
	};

	element.addEventListener("mouseenter", showTooltip);
	element.addEventListener("mouseleave", hideTooltip);

	tooltip.addEventListener("mouseenter", () => {
		clearTimeout(hideTimeout);
	});
	tooltip.addEventListener("mouseleave", hideTooltip);
}

function shouldSkipElement(element: Element): boolean {
	if (
		element.matches("[data-ip-converted='true'], .ipv6-tooltip, .ipv6-tooltip-context") ||
		element.tagName === "SCRIPT" ||
		element.tagName === "STYLE" ||
		element.tagName === "NOSCRIPT" ||
		element.tagName === "TEMPLATE"
	) {
		return true;
	}

	return element.namespaceURI === SVG_NAMESPACE;
}

// Detect IP addresses in a text node and attach hover behavior
function processTextNode(textNode: Text): void {
	const parent = textNode.parentElement;
	if (!parent) return;

	if (shouldSkipElement(parent)) return;

	const text = textNode.textContent;
	if (!text) return;

	const segments = splitTextByIPAddresses(text);
	if (!segments.some((segment) => segment.kind === "ip")) {
		return;
	}

	const fragment = document.createDocumentFragment();
	let replaced = false;

	for (const segment of segments) {
		if (segment.kind === "text") {
			if (segment.value.length > 0) {
				fragment.appendChild(document.createTextNode(segment.value));
			}
			continue;
		}

		const ipInfo = detectAndConvertIP(segment.value);
		if (!ipInfo) {
			fragment.appendChild(document.createTextNode(segment.value));
			continue;
		}

		const ipSpan = createIPSpan(segment.value, segment.addressType);
		const tooltip = createTooltip(ipInfo);
		ipSpan.appendChild(tooltip);
		setupTooltipHoverEvents(ipSpan, tooltip);

		fragment.appendChild(ipSpan);
		replaced = true;
	}

	if (!replaced) return;

	parent.replaceChild(fragment, textNode);
}

// Recursively process the DOM tree
function processNode(node: Node): void {
	if (node.nodeType === Node.TEXT_NODE) {
		processTextNode(node as Text);
	} else if (node.nodeType === Node.ELEMENT_NODE) {
		const element = node as Element;
		if (shouldSkipElement(element)) {
			return;
		}

		// Process child nodes
		for (const child of Array.from(node.childNodes)) {
			processNode(child);
		}
	}
}

// Clear previously processed elements
function clearProcessedMarkers(): void {
	const convertedElements = document.querySelectorAll("[data-ip-converted='true']");
	convertedElements.forEach((element) => {
		const ipAddress = element.getAttribute("data-ip");
		if (!ipAddress) {
			element.remove();
			return;
		}

		element.replaceWith(document.createTextNode(ipAddress));
	});

	// Remove context-menu tooltips appended directly under document.body
	const tooltips = document.querySelectorAll(".ipv6-tooltip-context");
	tooltips.forEach((tooltip) => {
		tooltip.remove();
	});
}

// Initialization
async function initializeIPConverter(): Promise<void> {
	// Check settings
	const autoScan = await storage.get<boolean>("autoScan");

	// Process only when auto-scan is enabled
	if (autoScan === true) {
		processNode(document.body);
	}
}

// Show tooltip near the current text selection
function showTooltipAtSelection(ipInfo: IPInfo): void {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return;

	const range = selection.getRangeAt(0);
	const rect = range.getBoundingClientRect();

	// Create tooltip
	const tooltip = createTooltip(ipInfo);
	tooltip.style.display = "block";
	tooltip.style.position = "fixed";
	tooltip.style.left = `${rect.left}px`;
	tooltip.style.top = `${rect.bottom + 2}px`;
	tooltip.style.zIndex = "10001";

	// Remove existing context-menu tooltip
	const existingTooltip = document.querySelector(".ipv6-tooltip-context");
	if (existingTooltip) {
		existingTooltip.remove();
	}

	// Add marker class for context-menu tooltip
	tooltip.classList.add("ipv6-tooltip-context");
	document.body.appendChild(tooltip);

	// Auto-remove after 10 seconds
	const autoRemoveTimeout = setTimeout(() => {
		tooltip.remove();
	}, 10000);

	// Remove on click
	const handleClick = (e: MouseEvent) => {
		// Ignore clicks inside tooltip
		if (tooltip.contains(e.target as Node)) return;

		clearTimeout(autoRemoveTimeout);
		tooltip.remove();
		document.removeEventListener("click", handleClick);
	};

	// Delay listener registration to ignore right-click menu click
	setTimeout(() => {
		document.addEventListener("click", handleClick);
	}, 100);
}

// Message listener for manual triggers
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
	if (request.action === "scan") {
		// Clear existing processing
		clearProcessedMarkers();
		// Run scan
		processNode(document.body);
		sendResponse({ success: true });
	} else if (request.action === "convertSelection") {
		// Detect IP address from selected text
		const text = request.text;
		const ipPattern = ipRegex();
		const matches = text.match(ipPattern);

		if (matches && matches.length > 0) {
			// Convert the first matched IP address
			const ipAddress = matches[0];
			const ipInfo = detectAndConvertIP(ipAddress);

			if (ipInfo) {
				// Show tooltip
				showTooltipAtSelection(ipInfo);
				sendResponse({ success: true });
			} else {
				sendResponse({ success: false, error: "Invalid IP address" });
			}
		} else {
			sendResponse({ success: false, error: "No IP address found" });
		}
	}
	return true;
});

// Run after page load
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeIPConverter);
} else {
	initializeIPConverter();
}
