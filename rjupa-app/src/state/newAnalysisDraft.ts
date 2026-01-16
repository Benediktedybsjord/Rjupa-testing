let draftImageUri: string | null = null;

/** Sets the currently selected image for the New Analysis flow. */
export function setDraftImageUri(uri: string) {
  draftImageUri = uri;
}

/** Returns the currently selected image for the New Analysis flow. */
export function getDraftImageUri() {
  return draftImageUri;
}

/** Clears the currently selected image for the New Analysis flow. */
export function clearDraftImageUri() {
  draftImageUri = null;
}
