import { Loader, Stack, Text } from '@mantine/core';
import { TemplateScreen } from '../template.screen';

interface Props {
  bread: {title: string | string[] ; href?: string}[];
  message: string;
}

export const LoaderFragment = ({ bread, message }: Props) => {
  return (<TemplateScreen bread={bread}>
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack align="center" gap="lg">
        <Text size="xl" fw={500}>
          {message}
        </Text>
        <Loader size="md" />
        <Text size="sm" style={{ animation: 'pulse 2s infinite' }}>
          Please wait...
        </Text>
      </Stack>
    </div>
  </TemplateScreen>);
};
