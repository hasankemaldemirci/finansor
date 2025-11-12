import { Container } from '@/shared/components/layout/Container';
import { SettingsPanel } from '@/features/settings/components/SettingsPanel';

export function SettingsPage() {
  return (
    <Container>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Ayarlar</h1>
        <SettingsPanel />
      </div>
    </Container>
  );
}

