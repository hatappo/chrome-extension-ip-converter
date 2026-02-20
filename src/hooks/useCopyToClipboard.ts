import { useState } from "react";

const COPY_SUCCESS_DURATION = 2000; // ms

/**
 * Custom hook that provides clipboard copy functionality
 * @returns Copy function and copy success state
 */
export function useCopyToClipboard() {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), COPY_SUCCESS_DURATION);
			return true;
		} catch (error) {
			console.error("Failed to copy:", error);
			return false;
		}
	};

	return { copyToClipboard, isCopied };
}
