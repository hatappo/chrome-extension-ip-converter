import { useEffect, useMemo, useState } from "react";
import "./extension-ui.css";
import { BitDisplay } from "./components/BitDisplay";
import { MultiFormatTable } from "./components/MultiFormatTable";
import { detectAndConvertIPWithCIDR, type IPInfo } from "./utils/ip-address-common";
import { compressIPv6, normalizeIPv6 } from "./utils/ipv6-converter";
import { getMultiFormatInfo } from "./utils/multi-format";

function IndexPopup() {
	const [inputValue, setInputValue] = useState("");
	const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
	const [error, setError] = useState("");
	const [scanMessage, setScanMessage] = useState("");
	const [normMode, setNormMode] = useState<"expanded" | "compressed">("compressed");

	const normalizedAddress = useMemo(() => {
		if (!ipInfo || ipInfo.type !== "ipv6") return null;
		const expanded = normalizeIPv6(ipInfo.address);
		return normMode === "expanded" ? expanded : compressIPv6(expanded);
	}, [ipInfo, normMode]);

	const multiFormatInfo = useMemo(() => {
		if (!ipInfo) return null;
		return getMultiFormatInfo(ipInfo.address, ipInfo.type);
	}, [ipInfo]);

	// Auto-convert when input changes
	useEffect(() => {
		if (!inputValue.trim()) {
			setIpInfo(null);
			setError("");
			return;
		}

		const result = detectAndConvertIPWithCIDR(inputValue);
		if (result) {
			setIpInfo(result);
			setError("");
		} else {
			setIpInfo(null);
			setError("Please enter a valid IP address (IPv4 or IPv6, with optional /prefix)");
		}
	}, [inputValue]);

	const handleClear = () => {
		setInputValue("");
		setIpInfo(null);
		setError("");
	};

	const handleScan = async () => {
		try {
			// Get current active tab
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			if (tab.id) {
				// Send scan message to content script
				const response = await chrome.tabs.sendMessage(tab.id, { action: "scan" });
				if (response?.success) {
					// Show success feedback in scan message area
					setScanMessage("Page scanned successfully!");
					setTimeout(() => {
						setScanMessage("");
					}, 3000);
				}
			}
		} catch (error) {
			console.error("Scan error:", error);
			setScanMessage("Failed to scan page");
			setTimeout(() => {
				setScanMessage("");
			}, 3000);
		}
	};

	return (
		<div className="popup-container">
			<h2 className="popup-title">IP Address to Binary Converter</h2>

			<div className="input-group">
				<label htmlFor="ip-input" className="input-label">
					IP Address:
				</label>
				<input
					id="ip-input"
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="e.g. 192.168.1.0/24 or 2001:db8::1"
					className="input-field"
				/>
			</div>

			<button type="button" onClick={handleClear} className="btn btn-secondary btn-clear">
				Clear
			</button>

			{error && <div className="error-message">{error}</div>}

			{ipInfo && ipInfo.type === "ipv6" && normalizedAddress && (
				<div className="normalization-section">
					<div className="normalization-header">
						<span className="normalization-label">Normalized:</span>
						<div className="normalization-toggle">
							<button
								type="button"
								className={`norm-btn ${normMode === "compressed" ? "norm-btn-active" : ""}`}
								onClick={() => setNormMode("compressed")}
							>
								Compressed
							</button>
							<button
								type="button"
								className={`norm-btn ${normMode === "expanded" ? "norm-btn-active" : ""}`}
								onClick={() => setNormMode("expanded")}
							>
								Expanded
							</button>
						</div>
					</div>
					<div className="normalization-value">{normalizedAddress}</div>
				</div>
			)}

			<div className="result-container">
				<div className="result-label">Binary Representation:</div>
				<div className="result-box">
					{ipInfo && (
						<BitDisplay
							bits={ipInfo.binary}
							variant="popup"
							classification={ipInfo.classification}
							ipClassification={ipInfo.ipClassification}
							prefixLength={ipInfo.prefixLength}
						/>
					)}
				</div>
			</div>

			{multiFormatInfo && <MultiFormatTable info={multiFormatInfo} />}

			<div className="scan-section">
				<button type="button" onClick={handleScan} className="btn btn-scan">
					Scan Page
				</button>
				<p className="scan-description">Detect IP addresses on this page</p>
				{scanMessage && <div className="scan-message">{scanMessage}</div>}
			</div>

			<footer className="footer">Convert IP address to binary representation</footer>
		</div>
	);
}

export default IndexPopup;
