import { Container } from '@/shared/components/layout/Container';
import { SettingsPanel } from '@/features/settings/components/SettingsPanel';
import { useTranslation } from 'react-i18next';

export function SettingsPage() {
  const { t } = useTranslation();
  
  return (
    <Container>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
        <SettingsPanel />
      </div>
    </Container>
  );
}
