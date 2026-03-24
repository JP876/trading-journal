import { createFileRoute } from '@tanstack/react-router';

import TradesPage from '../../components/pages/trades';

export const Route = createFileRoute('/_auth/trades')({
  component: TradesPage,
});
