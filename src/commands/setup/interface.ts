export const datadogSites = ["US", "EU", "US3", "US5", "GOV"] as const;

export type DatadogSite = typeof datadogSites[number];

export const DEFAULT_DATADOG_SITE: DatadogSite = "US";
