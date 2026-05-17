export type ServiceDataSource = "mock" | "live";

const SERVICE_DATA_SOURCE: ServiceDataSource = "mock";

export function getServiceDataSource(): ServiceDataSource {
  return SERVICE_DATA_SOURCE;
}

export function shouldUseMockServices(): boolean {
  return getServiceDataSource() === "mock";
}

export function resolveServiceCall<T>(
  mockCall: () => Promise<T>,
  liveCall: () => Promise<T>,
): Promise<T> {
  return shouldUseMockServices() ? mockCall() : liveCall();
}
