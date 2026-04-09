export interface OrderSummary {
  id: string;
  client: string;
  date: string;
  status: string;
  total: number;
  imageUrl: string;
  progress: number;
  projectName: string;
  projectType: string;
  projectSize: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
}

export interface UpdateOrderPayload {
  status: string;
  notes?: string;
}

export interface ReviewOrderPayload {
  decision: 'approved' | 'rejected';
  comments?: string;
}

export type RawOrder = Record<string, unknown>;
