
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface QuantumConcept {
  id: string;
  title: string;
  description: string;
  icon: string;
  detail: string;
}
