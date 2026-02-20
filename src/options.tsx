import { useStorage } from "@plasmohq/storage/hook";
import "./extension-ui.css";

function IndexOptions() {
	// Use Plasmo storage hook with default value of false
	const [autoScan, setAutoScan] = useStorage("autoScan", false);
	const [saveStatus, setSaveStatus] = useStorage<string>("saveStatus", "");

	const handleAutoScanChange = (enabled: boolean) => {
		setAutoScan(enabled);
		// Show save feedback
		setSaveStatus("Settings saved successfully!");
		setTimeout(() => setSaveStatus(""), 3000);
	};

	return (
		<div className="options-container">
			<div className="options-header">
				<h1>IPv6 Hex to Binary Converter - Settings</h1>
				<p>Configure extension behavior and preferences</p>
			</div>

			<div className="settings-section">
				<h2>Scan Settings</h2>

				<div className="setting-item">
					<div className="setting-info">
						<h3>Automatic Page Scanning</h3>
						<p>Automatically scan pages for IPv6 addresses when loaded</p>
					</div>
					<div className="setting-control">
						<label className="toggle-switch">
							<input type="checkbox" checked={autoScan} onChange={(e) => handleAutoScanChange(e.target.checked)} />
							<span className="toggle-slider"></span>
						</label>
					</div>
				</div>

				<div className="setting-description">
					<p>
						<strong>Note:</strong> When disabled, you can manually scan pages using the "Scan Page" button in the popup.
					</p>
				</div>
			</div>

			<div className="options-footer">{saveStatus && <div className="save-status">{saveStatus}</div>}</div>
		</div>
	);
}

export default IndexOptions;
