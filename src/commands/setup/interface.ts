export const datadogSites = ["US1", "EU1", "US3", "US5", "GOV"] as const;

export type DatadogSite = typeof datadogSites[number];

export const DEFAULT_DATADOG_SITE: DatadogSite = "US1";
