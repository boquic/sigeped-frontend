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

function normalizeOrderStatus(status: string): string {
  const normalized = status.trim().toLowerCase();

  switch (normalized) {
    case 'solicitado':
      return 'Pendiente';
    case 'aceptado':
      return 'En Progreso';
    case 'iniciado':
      return 'En Progreso';
    case 'completado':
      return 'Completado';
    case 'rechazado':
      return 'Cancelado';
    default:
      return status || 'Pendiente';
  }
}

function progressFromStatus(status: string): number {
  const normalized = status.trim().toLowerCase();

  switch (normalized) {
    case 'solicitado':
      return 10;
    case 'aceptado':
      return 35;
    case 'iniciado':
      return 65;
    case 'completado':
      return 100;
    case 'rechazado':
      return 0;
    default:
      return 0;
  }
}

export function mapRawOrderToSummary(raw: RawOrder): OrderSummary {
  const id = toStringValue(raw['id'] ?? raw['orderId'], 'N/A');
  const client = toStringValue(
    raw['customer_name'] ?? raw['customerName'] ?? raw['client'] ?? raw['customer'] ?? raw['phone_number'],
    'Cliente sin nombre'
  );
  const date = toStringValue(raw['created_at'] ?? raw['date'] ?? raw['createdAt'] ?? raw['updated_at'] ?? raw['updatedAt'], '');
  const rawStatus = toStringValue(raw['status'], 'solicitado');
  const status = normalizeOrderStatus(rawStatus);
  const total = toNumberValue(raw['total'] ?? raw['amount'] ?? raw['totalAmount'], 0);
  const progress = toNumberValue(raw['progress'] ?? raw['completion'], progressFromStatus(rawStatus));

  return {
    id,
    client,
    date,
    status,
    total,
    imageUrl: toStringValue(raw['imageUrl'], DEFAULT_IMAGE),
    progress,
    projectName: toStringValue(raw['projectName'] ?? raw['name'] ?? raw['specifications'], 'Proyecto sin nombre'),
    projectType: toStringValue(raw['service_type'] ?? raw['projectType'] ?? raw['type'], 'No especificado'),
    projectSize: toStringValue(raw['projectSize'] ?? raw['size'], 'No especificado'),
    customerEmail: toStringValue(raw['customerEmail'] ?? raw['email'], 'No disponible'),
    customerPhone: toStringValue(raw['phone_number'] ?? raw['customerPhone'] ?? raw['phone'], 'No disponible'),
    customerAddress: toStringValue(raw['customerAddress'] ?? raw['address'], 'No disponible')
  };
}
