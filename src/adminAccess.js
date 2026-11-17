/** Storefront navigation is only a convenience; backend controls all staff access. */
export function canOpenAdmin({backendEnabled,user,verifiedRole}) {
  return Boolean(backendEnabled && user && verifiedRole);
}
