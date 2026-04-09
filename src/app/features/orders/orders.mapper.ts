import { OrderSummary, RawOrder } from '../../core/models/order.model';

const DEFAULT_IMAGE = 'assets/plano_casa.jpg';

function toStringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function toNumberValue(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export function mapRawOrderToSummary(raw: RawOrder): OrderSummary {
  const id = toStringValue(raw['id'] ?? raw['orderId'], 'N/A');
  const client = toStringValue(raw['client'] ?? raw['customerName'] ?? raw['customer'], 'Cliente sin nombre');
  const date = toStringValue(raw['date'] ?? raw['createdAt'] ?? raw['updatedAt'], '');
  const status = toStringValue(raw['status'], 'Pendiente');
  const total = toNumberValue(raw['total'] ?? raw['amount'] ?? raw['totalAmount'], 0);
  const progress = toNumberValue(raw['progress'] ?? raw['completion'], 0);

  return {
    id,
    client,
    date,
    status,
    total,
    imageUrl: toStringValue(raw['imageUrl'], DEFAULT_IMAGE),
    progress,
    projectName: toStringValue(raw['projectName'] ?? raw['name'], 'Proyecto sin nombre'),
    projectType: toStringValue(raw['projectType'] ?? raw['type'], 'No especificado'),
    projectSize: toStringValue(raw['projectSize'] ?? raw['size'], 'No especificado'),
    customerEmail: toStringValue(raw['customerEmail'] ?? raw['email'], 'No disponible'),
    customerPhone: toStringValue(raw['customerPhone'] ?? raw['phone'], 'No disponible'),
    customerAddress: toStringValue(raw['customerAddress'] ?? raw['address'], 'No disponible')
  };
}
